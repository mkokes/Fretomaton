#!/bin/bash

# Script to check what's currently on the remote server

# Colors for output
GREEN='\033[0;32m'
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

echo -e "${BLUE}=== Remote Server Check ===${NC}"
echo ""
echo "Checking: $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
echo ""

echo -e "${BLUE}Main directory contents:${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" "ls -la $REMOTE_PATH/ 2>/dev/null || echo 'Directory not found'"
echo ""

echo -e "${BLUE}Assets directory contents:${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" "ls -la $REMOTE_PATH/assets/ 2>/dev/null || echo 'Assets directory not found or empty'"
echo ""

echo -e "${BLUE}Disk usage:${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" "du -sh $REMOTE_PATH/* 2>/dev/null || echo 'No files found'"
echo ""

echo -e "${BLUE}File types in main directory:${NC}"
ssh "$REMOTE_USER@$REMOTE_HOST" "find $REMOTE_PATH -maxdepth 2 -type f -exec file {} \; 2>/dev/null || echo 'No files found'"
