// pages/api/uploadZest.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { IncomingForm, File as FormidableFile } from "formidable";
import fs from "fs";
import util from "util";

// Disable Next.js built-in body parsing to use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

const gitlabBaseURL = "https://gitlab.scss.tcd.ie/api/v4"; // Updated for your instance
const { GITLAB_TOKEN, GITLAB_PROJECT_ID } = process.env;

async function commitFile(filePath: string, content: string, commitMessage: string) {
  const endpoint = `${gitlabBaseURL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID!)}/repository/files/${encodeURIComponent(filePath)}`;
  
  // Determine whether the file exists by trying to GET it.
  let method: "POST" | "PUT" = "POST";
  try {
    await axios.get(endpoint, {
      headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
      params: { ref: "main" }, // Ensure this matches your branch name
    });
    method = "PUT";
  } catch (error: any) {
    // If the file doesn't exist, continue with POST.
    // You can add extra checking here if desired.
  }
  
  // Correct Axios call
  const response = await axios({
    method,
    url: endpoint,
    headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    data: {
      branch: "main", // Ensure this matches your branch name
      content: content,
      commit_message: commitMessage,
    },
  });
  
  return response.data;
}

async function updateCiYaml(scriptCommand: string) {
  const ciFilePath = ".gitlab-ci.yml";
  const endpoint = `${gitlabBaseURL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID!)}/repository/files/${encodeURIComponent(ciFilePath)}`;

  const res = await axios.get(endpoint, {
    headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    params: { ref: "main" },
  });
  const currentContent = Buffer.from(res.data.content, "base64").toString("utf8");

  const placeholder = "# zest-script-placeholder";
  if (!currentContent.includes(placeholder)) {
    throw new Error("Placeholder for zest script not found in .gitlab-ci.yml");
  }
  const newContent = currentContent.replace(
    placeholder,
    `${placeholder}\n    - ${scriptCommand}`
  );

  const response = await axios({
    method: "PUT",
    url: endpoint,
    headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    data: {
      branch: "main",
      content: newContent,
      commit_message: "Update CI YAML to add new zest script command",
    },
  });
  return response.data;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const form = new IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ error: "Error parsing form data" });
    }

    try {
      const fileField = files.file;
      if (!fileField) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Normalize to an array so we can support single or multiple files
      const uploadedFiles: FormidableFile[] = Array.isArray(fileField)
        ? fileField.filter(Boolean) as FormidableFile[]
        : [fileField as FormidableFile];

      for (const uploadedFile of uploadedFiles) {
        const fileContent = fs.readFileSync(uploadedFile.filepath, "utf8");
        const targetFilePath = `zest-scripts/${uploadedFile.originalFilename}`;
        
        await commitFile(
          targetFilePath,
          fileContent,
          `Add zest script: ${uploadedFile.originalFilename}`
        );
        
        const scriptCommand = `/System/Volumes/Data/Applications/ZAP.app/Contents/Java/zap.sh -cmd -script "$CI_PROJECT_DIR/${targetFilePath}" > data/output.txt`;
        await updateCiYaml(scriptCommand);
      }

      res.status(200).json({ success: true, message: "Zest script(s) uploaded and CI YAML updated" });
    } catch (error: any) {
        if (error.response) {
          // Log only the essential parts to avoid circular structure issues
          console.error("Error status:", error.response.status);
          console.error("Error headers:", util.inspect(error.response.headers, { depth: null }));
          console.error("Error data:", util.inspect(error.response.data, { depth: null }));
        } else {
          console.error("Error processing upload:", error.message);
        }
        res.status(500).json({ error: error.message });
        }
  });
}
