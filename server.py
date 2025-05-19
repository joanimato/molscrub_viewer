from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import time

import subprocess

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change this to ["http://localhost:5173"] for better security)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Define a request model for receiving input
class ScriptInput(BaseModel):
    user_text: str

@app.post("/run-script")
def run_script(input: ScriptInput):
    userInputList = input.user_text.split()
    print(f"Scriptinput: {userInputList}")
    try:
        result = subprocess.run(
            ["scrub.py", *userInputList], 
            capture_output=True, text=True)
        print(result.stdout)
        print(result.stderr)
        return {"output": result.stdout, "error": result.stderr}
    except Exception as e:
        return {"error": str(e)}

@app.get("/check-file")
def check_file():
    """Endpoint to check if test.sdf exists and is fully written."""
    file_path = "test.sdf"
    if os.path.exists(file_path):
        return {"exists": True}
    return {"exists": False}

# Run the FastAPI server
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
