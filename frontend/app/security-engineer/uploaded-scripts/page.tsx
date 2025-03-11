"use client";
import * as React from "react";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function LoadingButtonsTransition() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 4초 타이머
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-blue-400"
      style={{
        backgroundImage: "url('/images/securityBackground.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        className="relative flex items-center justify-center min-h-[300px] w-[350px]" // 고정 크기 유지
      >
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute flex flex-col items-center"
          >
            <CircularProgress size={60} sx={{ color: "white" }} />
            <p className="mt-4 text-white text-lg font-semibold">Uploading scripts...</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute"
          >
            <Button
              size="large"
              variant="contained"
              color="primary"
              sx={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                padding: "12px 24px",
                borderRadius: "12px",
                backgroundColor: "#1565C0",
                "&:hover": { backgroundColor: "#0D47A1" },
              }}
              onClick={() => window.open("http://172.20.10.3:4000", "_blank")}
            >
              Open Grafana
            </Button>
          </motion.div>
        )}
      </Box>
    </div>
  );
}
