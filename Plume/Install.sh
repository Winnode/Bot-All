#!/bin/bash

# Variables
REPO_URL="https://github.com/Winnode/Bot-All.git"
REPO_DIR="Bot-All"
PROJECT_DIR="Bot-All/Plume"
VENV_DIR="venv"
PYTHON_VERSION="python3.9"

# Update and install dependencies
sudo apt update
sudo apt install -y git $PYTHON_VERSION $PYTHON_VERSION-venv

# Clone the repository
if [ -d "$REPO_DIR" ]; then
    echo "Repository already cloned. Pulling the latest changes..."
    cd $REPO_DIR
    git pull
else
    echo "Cloning repository..."
    git clone $REPO_URL
    cd $REPO_DIR
fi

# Navigate to the project directory
cd $PROJECT_DIR

# Set up Python virtual environment
if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    $PYTHON_VERSION -m venv $VENV_DIR
fi

echo "Activating virtual environment..."
source $VENV_DIR/bin/activate

# Install Python dependencies
echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run the bot
echo "Running the bot..."
python run.py
