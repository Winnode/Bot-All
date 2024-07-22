#!/bin/bash

REPO_URL="https://github.com/Winnode/Bot-All/archive/refs/heads/main.zip"
ZIP_FILE="Bot-All.zip"
EXTRACTED_DIR="Bot-All-main"
PLUME_DIR="Plume"
DEST_DIR="/root/Bot-All"
PLUME_PATH="$DEST_DIR/$PLUME_DIR"
PYTHON_VERSION="python3.9"

echo "Updating package list..."
sudo apt update

echo "Installing required packages..."
sudo apt install -y git $PYTHON_VERSION $PYTHON_VERSION-venv unzip wget

echo "Downloading the latest version of Bot-All..."
wget $REPO_URL -O $ZIP_FILE

echo "Extracting $ZIP_FILE..."
unzip $ZIP_FILE

if [ -d "$EXTRACTED_DIR/$PLUME_DIR" ]; then
    echo "Copying $PLUME_DIR folder to $DEST_DIR..."
    mkdir -p $DEST_DIR  
    cp -r $EXTRACTED_DIR/$PLUME_DIR $DEST_DIR/
else
    echo "Directory $PLUME_DIR not found in the extracted files."
    exit 1
fi

cd $PLUME_PATH || { echo "Failed to enter $PLUME_PATH"; exit 1; }
a
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_VERSION -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
if [ -f "requirements.txt" ]; then
    pip install --upgrade pip
    pip install -r requirements.txt
else
    echo "requirements.txt not found"
    exit 1
fi

echo "Cleaning up..."
cd
rm -f $ZIP_FILE
rm -rf $EXTRACTED_DIR
echo "Setup complete. The environment is ready in $PLUME_PATH."
