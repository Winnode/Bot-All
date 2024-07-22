#!/bin/bash

REPO_URL="https://github.com/Winnode/Bot-All.git"
REPO_DIR="Bot-All"
PROJECT_DIR="Bot-All/Plume"
VENV_DIR="venv"
PYTHON_VERSION="python3.9"

sudo apt update
sudo apt install -y git $PYTHON_VERSION $PYTHON_VERSION-venv

if [ -d "$REPO_DIR" ]; then
    echo "Repository directory already exists."
    cd $REPO_DIR || exit
    echo "Pulling the latest changes..."
    git pull
else
    echo "Cloning repository..."
    git clone $REPO_URL
    cd $REPO_DIR || exit
fi

cd $PROJECT_DIR || exit

if [ ! -d "$VENV_DIR" ]; then
    echo "Creating virtual environment..."
    $PYTHON_VERSION -m venv $VENV_DIR
fi

echo "Activating virtual environment..."
source $VENV_DIR/bin/activate

echo "Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "Running the bot..."
python3 run.py
