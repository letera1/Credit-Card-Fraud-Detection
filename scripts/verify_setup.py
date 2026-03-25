"""Verify project setup and dependencies."""

import sys
from pathlib import Path

def check_dependencies():
    """Check if all required packages are installed."""
    required_packages = [
        'numpy', 'pandas', 'sklearn', 'xgboost', 
        'imblearn', 'matplotlib', 'seaborn', 'yaml',
        'fastapi', 'uvicorn', 'pytest'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"✓ {package}")
        except ImportError:
            print(f"✗ {package} - MISSING")
            missing.append(package)
    
    return missing

def check_structure():
    """Check if project structure is correct."""
    required_dirs = [
        'src', 'src/api', 'src/config', 'src/features',
        'src/monitoring', 'src/pipeline', 'tests', 'scripts',
        'config', 'docs', 'notebooks'
    ]
    
    required_files = [
        'config/config.yaml', 'requirements.txt', 'setup.py',
        'Makefile', 'Dockerfile', 'docker-compose.yml'
    ]
    
    print("\nChecking directory structure...")
    for dir_path in required_dirs:
        if Path(dir_path).exists():
            print(f"✓ {dir_path}/")
        else:
            print(f"✗ {dir_path}/ - MISSING")
    
    print("\nChecking required files...")
    for file_path in required_files:
        if Path(file_path).exists():
            print(f"✓ {file_path}")
        else:
            print(f"✗ {file_path} - MISSING")

def main():
    """Run all verification checks."""
    print("=" * 60)
    print("PROJECT SETUP VERIFICATION")
    print("=" * 60)
    
    print("\nChecking Python version...")
    print(f"Python {sys.version}")
    
    print("\nChecking dependencies...")
    missing = check_dependencies()
    
    check_structure()
    
    print("\n" + "=" * 60)
    if missing:
        print(f"⚠ WARNING: {len(missing)} packages missing")
        print("Run: pip install -r requirements.txt")
    else:
        print("✓ All checks passed!")
    print("=" * 60)

if __name__ == "__main__":
    main()
