"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingButtonsTransition() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4 seconds timer
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
    <div className= "h-screen bg-gradient-to-br from-blue-600 to-blue-300 flex flex-col items-center justify-start pt-20"
          style={{
            backgroundImage: "url('/images/securityBackground.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
      }}
    >
      {loading ? (
        <Button
          size="large"
          variant="outlined"
          disabled={loading}
          startIcon={<CircularProgress size={50} sx={{ color: "white" }} />} // White spinner
          sx={{ fontSize: "1.5rem", fontWeight: "bold", color: "blue", borderColor: "blue" }} // White text and border
        >
          Uploading scripts...
        </Button>
      ) : (
        <Button
          size="large"
          variant="contained"
          color="primary"
          sx={{ fontSize: "1.5rem", fontWeight: "bold" }}
          onClick={() => window.open("http://localhost:4000", "_blank")} // Redirect on click
        >
          Open Grafana
        </Button>
      )}
    </Box>
    </div>
    </div>
  );
}
