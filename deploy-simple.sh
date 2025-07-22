#!/bin/bash

# Simple Fretomaton Deployment Script
# This script builds the project and provides rsync command for manual deployment

set -e  # Exit on any error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
else
    echo -e "${RED}Error: .env file not found. Please copy .env.example to .env and configure your deployment settings.${NC}"
    exit 1
fi

# Configuration from environment variables
REMOTE_USER="${DEPLOY_REMOTE_USER}"
REMOTE_HOST="${DEPLOY_REMOTE_HOST}"
REMOTE_PATH="${DEPLOY_REMOTE_PATH}"
LOCAL_DIST_PATH="${DEPLOY_LOCAL_DIST_PATH}"

echo -e "${BLUE}=== Fretomaton Deployment Script ===${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${YELLOW}Error: package.json not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

# Run tests first
echo -e "${BLUE}Step 1: Running tests...${NC}"
if npm run test:run; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
else
    echo -e "${YELLOW}✗ Tests failed. Please fix tests before deploying.${NC}"
    exit 1
fi

echo ""

# Build the project
echo -e "${BLUE}Step 2: Building the project...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build completed successfully!${NC}"
else
    echo -e "${YELLOW}✗ Build failed. Please fix build errors.${NC}"
    exit 1
fi

echo ""

# Check if dist directory exists
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    echo -e "${YELLOW}Error: dist directory not found. Build may have failed.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project built successfully!${NC}"
echo ""
echo -e "${BLUE}Step 3: Deploy to server${NC}"
echo "Run the following command to deploy:"
echo ""
echo -e "${YELLOW}rsync -avz --delete --progress $LOCAL_DIST_PATH $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/${NC}"
echo ""
echo "This will:"
echo "• Upload all files from ./dist/ to the remote server"
echo "• Delete any files on the server that don't exist locally (--delete)"
echo "• Show progress during upload (--progress)"
echo "• Preserve file permissions and timestamps (-avz)"
echo ""
echo -e "${BLUE}Alternative: Deploy automatically (will prompt for password)${NC}"
echo "If you want to deploy automatically, run:"
echo ""
echo -e "${YELLOW}./deploy.sh${NC}"
echo ""
