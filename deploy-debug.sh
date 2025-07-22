#!/bin/bash

# Debug Deployment Script - Shows detailed rsync output
# This script helps troubleshoot deployment issues

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo -e "${BLUE}=== Debug Deployment Script ===${NC}"
echo ""
echo "Configuration:"
echo "  Remote User: $REMOTE_USER"
echo "  Remote Host: $REMOTE_HOST"
echo "  Remote Path: $REMOTE_PATH"
echo "  Local Dist:  $LOCAL_DIST_PATH"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

# Build the project
echo -e "${BLUE}Building the project...${NC}"
if npm run build; then
    echo -e "${GREEN}✓ Build completed successfully!${NC}"
else
    echo -e "${RED}✗ Build failed.${NC}"
    exit 1
fi

# Check if dist directory exists and show contents
if [ ! -d "$LOCAL_DIST_PATH" ]; then
    echo -e "${RED}Error: dist directory not found. Build may have failed.${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Local dist directory contents:${NC}"
ls -la "$LOCAL_DIST_PATH"
echo ""

# Show the exact rsync command that will be executed
echo -e "${BLUE}Rsync command that will be executed:${NC}"
echo -e "${YELLOW}rsync -avz --delete --exclude='.DS_Store' --exclude='Thumbs.db' --progress ${LOCAL_DIST_PATH%/}/ $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/${NC}"
echo ""

# Ask for confirmation
read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Create remote directory if it doesn't exist
echo -e "${BLUE}Ensuring remote directory exists...${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" "mkdir -p $REMOTE_PATH"

# Deploy using rsync with maximum verbosity
echo -e "${BLUE}Deploying with verbose output...${NC}"
rsync -avz --delete \
    --exclude='.DS_Store' \
    --exclude='Thumbs.db' \
    --progress \
    --verbose \
    "${LOCAL_DIST_PATH%/}/" \
    "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo ""
echo -e "${GREEN}Deployment completed!${NC}"
echo ""
echo -e "${BLUE}Checking remote directory contents:${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" "ls -la $REMOTE_PATH/"
echo ""
echo -e "${BLUE}Checking remote assets directory:${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" "ls -la $REMOTE_PATH/assets/ 2>/dev/null || echo 'Assets directory not found or empty'"
