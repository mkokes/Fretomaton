#!/bin/bash

# Fretomaton Deployment Script
# This script builds the project and deploys it to the remote server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    print_error ".env file not found. Please copy .env.example to .env and configure your deployment settings."
    exit 1
fi

# Configuration from environment variables
REMOTE_USER="${DEPLOY_REMOTE_USER}"
REMOTE_HOST="${DEPLOY_REMOTE_HOST}"
REMOTE_PATH="${DEPLOY_REMOTE_PATH}"
LOCAL_DIST_PATH="${DEPLOY_LOCAL_DIST_PATH}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_status "Checking prerequisites..."

if ! command_exists npm; then
    print_error "npm is not installed. Please install Node.js and npm."
    exit 1
fi

if ! command_exists rsync; then
    print_error "rsync is not installed. Please install rsync."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Run tests first
print_status "Running tests..."
if npm run test:run; then
    print_success "All tests passed!"
else
    print_error "Tests failed. Deployment aborted."
    exit 1
fi

# Build the project
print_status "Building the project..."
if npm run build; then
    print_success "Build completed successfully!"
else
    print_error "Build failed. Deployment aborted."
    exit 1
fi

# Check if dist directory exists
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    print_error "dist directory not found. Build may have failed."
    exit 1
fi

# Test SSH connection
print_status "Testing SSH connection to $REMOTE_USER@$REMOTE_HOST..."
if ssh -o ConnectTimeout=10 -o BatchMode=yes "$REMOTE_USER@$REMOTE_HOST" exit 2>/dev/null; then
    print_success "SSH connection successful!"
else
    print_error "Cannot connect to $REMOTE_USER@$REMOTE_HOST. Please check your SSH configuration."
    print_warning "Make sure you have SSH key authentication set up."
    exit 1
fi

# Create remote directory if it doesn't exist
print_status "Ensuring remote directory exists..."
ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH"

# Deploy using rsync
print_status "Deploying to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH..."
print_status "Syncing files from $LOCAL_DIST_PATH to remote server..."

if rsync -avz --delete \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db' \
    --progress \
    "${LOCAL_DIST_PATH%/}/" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"; then
    
    print_success "Deployment completed successfully!"
    print_success "Your application is now live at the configured domain."
    
    # Show deployment summary
    echo ""
    echo "=== Deployment Summary ==="
    echo "Local source: $LOCAL_DIST_PATH"
    echo "Remote target: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
    echo "Deployment time: $(date)"
    echo "=========================="
    
else
    print_error "Deployment failed during rsync."
    exit 1
fi
