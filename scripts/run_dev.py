import subprocess
import sys
import time

def main():
    print("Launching KnowSure Development Stack...")
    # Launch backend uvicorn server
    backend_proc = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "app.main:app", "--reload", "--port", "8000"
    ], cwd="backend")
    print("Backend server started on http://localhost:8000")

    try:
        backend_proc.wait()
    except KeyboardInterrupt:
        print("Stopping servers...")
        backend_proc.terminate()

if __name__ == "__main__":
    main()
