#!/bin/bash

# This script automates creating a new branch, committing changes, and pushing it to GitHub.
# Before running this script, make sure you have:
# 1. Initialized a Git repository (`git init -b main`)
# 2. Added your remote GitHub repository (`git remote add origin YOUR_REPOSITORY_URL`)

# Ask for a branch name
echo "🌿 Enter a name for your new branch (e.g., 'feature/add-login' or 'fix/style-bug'):"
read BRANCH_NAME

# Use a default name with a timestamp if none is provided
if [ -z "$BRANCH_NAME" ]; then
    BRANCH_NAME="update/$(date +%Y-%m-%d-%H%M%S)"
    echo "No branch name entered. Using default: '$BRANCH_NAME'"
fi

# Create the new branch and switch to it
echo "🌳 Creating and switching to new branch: $BRANCH_NAME..."
git checkout -b "$BRANCH_NAME"

echo ""
echo "ℹ️  Staging all new and modified files..."
git add .

# Ask for a commit message
echo "💬 Enter a commit message for your changes:"
read COMMIT_MESSAGE

# Use a default message if none is provided
if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="Feat: Sync project updates"
    echo "No message entered. Using default: '$COMMIT_MESSAGE'"
fi

echo "💾 Committing changes to branch '$BRANCH_NAME'..."
git commit -m "$COMMIT_MESSAGE"

echo "🚀 Pushing the new branch '$BRANCH_NAME' to GitHub..."
git push -u origin "$BRANCH_NAME"

echo ""
echo "✅ Success! Your code has been pushed to the new branch on GitHub."
echo "You can now create a Pull Request on GitHub to merge '$BRANCH_NAME' into 'main'."

# Switch back to the main branch for safety
echo "🔄 Switching back to the 'main' branch locally."
git checkout main
