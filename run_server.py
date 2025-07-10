#!/usr/bin/env python3
"""
Simple script to run the FastAPI course generation server.
Usage: python run_server.py
"""

if __name__ == "__main__":
    import uvicorn
    print("Starting Course Generation API server...")
    print("API will be available at: http://localhost:8001")
    print("Documentation at: http://localhost:8001/docs")
    print("Health check at: http://localhost:8001/health")
    
    uvicorn.run(
        "fastapi_server:app", 
        host="0.0.0.0", 
        port=8001, 
        reload=True  # Auto-reload on file changes for development
    ) 