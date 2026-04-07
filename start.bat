@echo off
echo Starting Ward Civic Intelligence Portal...

start cmd /k "cd backend && node server.js"
start cmd /k "cd frontend && npm run dev"

echo Portal initialized. 
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
pause
