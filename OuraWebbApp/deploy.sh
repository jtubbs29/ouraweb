#!/bin/bash

echo "🚀 Deploying Oura Health Dashboard to GitHub Pages..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git branch -M main
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit with timestamp
echo "💾 Committing changes..."
git commit -m "Deploy Oura Health Dashboard - $(date)"

# Add remote if not exists
if ! git remote get-url origin &> /dev/null; then
    echo "🔗 Adding GitHub remote..."
    git remote add origin https://github.com/jtubbs29/bsb.git
fi

# Push to GitHub
echo "⬆️ Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Deployment initiated!"
echo ""
echo "🔗 Your app will be available at:"
echo "   https://jtubbs29.github.io/bsb/"
echo ""
echo "🔐 Password: jt+cursor+agent129369"
echo ""
echo "⏱️ Deployment typically takes 2-3 minutes."
echo "   Check the Actions tab in GitHub for deployment status."
echo ""
echo "🎉 Happy health tracking!"