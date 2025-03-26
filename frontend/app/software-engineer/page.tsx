"use client";

import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import StepIcon from '@mui/material/StepIcon';
import StepConnector from '@mui/material/StepConnector';
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from '@mui/system';
import { Code } from "lucide-react";


// New stages
const steps = [
  'Start services',
  'Extract metadata',
  'Run pen test',
  'Save results',
  'Visualize'
];

// Create a custom StepIcon with larger size
const CustomStepIcon = styled(StepIcon)({
  width: 40,  // Increase the width of the circle
  height: 40, // Increase the height of the circle
  fontSize: 24, // Adjust the size of the number/label inside the circle
});

// Create a custom StepConnector to maintain the horizontal lines
const CustomStepConnector = styled(StepConnector)({
  borderTop: '2px solid white', // Set the line color to white or customize as needed
  marginTop: 10, // Space between the icon and the line
});

export default function MultiStepLoaderPage() {
  const [activeStep, setActiveStep] = React.useState(0); // Track the current step
  const [completedSteps, setCompletedSteps] = React.useState<boolean[]>(new Array(steps.length).fill(false)); // Track which steps are completed

  // Define phase messages for each step
  const phaseMessages = [
    "Starting target service.... ",
    "Extracting metadata.... ",
    "Running penetration tests.... ",
    "Saving results to database.... ",
    "Visualizing.... "
  ];

  React.useEffect(() => {
    if (activeStep < steps.length) {
      // Wait 3 seconds before marking the current step as successful
      const timeout = setTimeout(() => {
        setCompletedSteps((prev) => {
          const updated = [...prev];
          updated[activeStep] = true; // Mark the current step as completed
          return updated;
        });
        setActiveStep((prev) => prev + 1); // Move to the next step
      }, 3000); // 3 seconds delay

      return () => clearTimeout(timeout); // Cleanup timeout on component unmount or step change
    }
  }, [activeStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-green-600 text-white">
    <Code className="w-16 h-16 text-lime-300 mb-4" />
      {/* Display phase message or success message after completion */}
      <h1 className="text-4xl font-bold mb-6">
        {activeStep < steps.length 
          ? phaseMessages[activeStep] // Show phase message if there are remaining steps
          : <span className="text-3xl font-bold text-green-500">Pipeline successfully completed!</span> // Show success message when all steps are done
        }
        {/* Only show CircularProgress if there are still steps remaining */}
        {activeStep < steps.length && <CircularProgress size={40} sx={{ color: "white" }} />}
      </h1>
      <p className="text-gray-200 mb-6">Progress through the stages of the pipeline.</p>

      <Box sx={{ width: '100%' }}>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          connector={<CustomStepConnector />}
        >
          {steps.map((label, index) => {
            const labelProps: {
              optional?: React.ReactNode;
              error?: boolean;
            } = {};

            // If the step is completed, mark it as successful
            if (completedSteps[index]) {
              labelProps.optional = (
                <Typography variant="caption" color="dark grey">
                  Completed
                </Typography>
              );
            }

            return (
              <Step key={label}>
                <StepLabel {...labelProps} StepIconComponent={CustomStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
    </div>
  );
}
