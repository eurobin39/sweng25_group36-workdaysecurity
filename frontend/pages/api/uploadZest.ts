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

const gitlabBaseURL = "https://gitlab.scss.tcd.ie/api/v4"; // Your GitLab instance URL
const { GITLAB_TOKEN, GITLAB_PROJECT_ID } = process.env;

async function commitFile(filePath: string, content: string, commitMessage: string) {
  const endpoint = `${gitlabBaseURL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID!)}/repository/files/${encodeURIComponent(filePath)}`;
  
  let method: "POST" | "PUT" = "POST";
  try {
    await axios.get(endpoint, {
      headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
      params: { ref: "tim_test_branch2" }, // Adjust branch name if necessary
    });
    method = "PUT";
  } catch (error: any) {
    // If the file doesn't exist, we'll use POST.
  }
  
  const response = await axios({
    method,
    url: endpoint,
    headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    data: {
      branch: "tim_test_branch2",
      content: content,
      commit_message: commitMessage,
    },
  });
  
  return response.data;
}

async function updatePentestYaml(scriptCommand: string) {
  // Update the file path to yaml_files/pentest.yml
  const yamlFilePath = "yaml_files/pentest.yml";
  const endpoint = `${gitlabBaseURL}/projects/${encodeURIComponent(GITLAB_PROJECT_ID!)}/repository/files/${encodeURIComponent(yamlFilePath)}`;

  // Get the current content of pentest.yml
  const res = await axios.get(endpoint, {
    headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    params: { ref: "tim_test_branch2" },
  });
  const currentContent = Buffer.from(res.data.content, "base64").toString("utf8");

  // Look for a placeholder in your pentest.yml where new commands should be injected.
  // Ensure your pentest.yml file contains the following placeholder comment:
  //    # zest-script-placeholder
  const placeholder = "# zest-script-placeholder";
  if (!currentContent.includes(placeholder)) {
    throw new Error("Placeholder for zest script not found in yaml_files/pentest.yml");
  }
  const newContent = currentContent.replace(
    placeholder,
    `${placeholder}\n    - ${scriptCommand}`
  );

  // Update the pentest.yml file in GitLab
  const response = await axios({
    method: "PUT",
    url: endpoint,
    headers: { "PRIVATE-TOKEN": GITLAB_TOKEN },
    data: {
      branch: "tim_test_branch2",
      content: newContent,
      commit_message: "Update pentest.yml to add new zap command",
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

      // Normalize to an array to support single or multiple file uploads.
      const uploadedFiles: FormidableFile[] = Array.isArray(fileField)
        ? fileField.filter(Boolean) as FormidableFile[]
        : [fileField as FormidableFile];

      for (const uploadedFile of uploadedFiles) {
        // Read the zap zest script as a UTF-8 text file.
        const fileContent = fs.readFileSync(uploadedFile.filepath, "utf8");
        // Define where to store the file in your GitLab repository.
        const targetFilePath = `zest-scripts/${uploadedFile.originalFilename}`;
        
        // Commit the file to GitLab.
        await commitFile(
          targetFilePath,
          fileContent,
          `Add zest script: ${uploadedFile.originalFilename}`
        );
        
        // Define the zap command to be injected.
        const scriptCommand = `/System/Volumes/Data/Applications/ZAP.app/Contents/Java/zap.sh -cmd -script "$CI_PROJECT_DIR/${targetFilePath}" >> data/output.txt`;
        
        // Update pentest.yml instead of .gitlab-ci.yml
        await updatePentestYaml(scriptCommand);
      }

      res.status(200).json({ success: true, message: "Zest script(s) uploaded and pentest.yml updated" });
    } catch (error: any) {
      if (error.response) {
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
