#!/bin/bash
cd /home/kavia/workspace/code-generation/fitflex-personalized-workout-hub-39919-1a73a394/main_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

