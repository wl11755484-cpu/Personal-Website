#!/bin/bash

# Personal Website Deployment Script
# This script helps you deploy your personal website to various platforms

set -e

echo "🚀 Personal Website Deployment Helper"
echo "====================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please run this script from the project root."
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  You have uncommitted changes. Please commit them first."
    echo "Run: git add . && git commit -m 'Your commit message'"
    exit 1
fi

echo "✅ Git repository is ready"

# Function to deploy to Vercel
deploy_vercel() {
    echo "\n🌟 Deploying to Vercel..."
    echo "Please follow these steps:"
    echo "1. Visit https://vercel.com and sign in with GitHub"
    echo "2. Click 'New Project' and import your GitHub repository"
    echo "3. Configure the following environment variables:"
    echo "   - NEXTAUTH_URL: https://your-app.vercel.app"
    echo "   - NEXTAUTH_SECRET: $(openssl rand -base64 32)"
    echo "   - DATABASE_URL: (PostgreSQL connection string)"
    echo "   - EMAIL_SERVER_HOST: (your email provider)"
    echo "   - EMAIL_SERVER_PORT: 587"
    echo "   - EMAIL_SERVER_USER: (your email)"
    echo "   - EMAIL_SERVER_PASSWORD: (your email password)"
    echo "   - EMAIL_FROM: (your email)"
    echo "4. Click 'Deploy'"
    echo "\n📋 Copy this NEXTAUTH_SECRET for your environment variables:"
    echo "$(openssl rand -base64 32)"
}

# Function to show GitHub setup instructions
setup_github() {
    echo "\n📦 Setting up GitHub repository..."
    echo "Please follow these steps:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: personal-website"
    echo "3. Description: A modern personal website built with Next.js 15"
    echo "4. Make it Public (recommended for free hosting)"
    echo "5. Don't initialize with README (we already have files)"
    echo "6. Click 'Create repository'"
    echo "7. Copy the repository URL and run:"
    echo "   git remote add origin <your-repo-url>"
    echo "   git branch -M main"
    echo "   git push -u origin main"
}

# Function to show environment setup
show_env_setup() {
    echo "\n🔧 Environment Variables Setup"
    echo "Copy .env.example to .env.local and configure:"
    echo "\n# Authentication"
    echo "NEXTAUTH_URL=https://your-domain.com"
    echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
    echo "\n# Database (for production, use PostgreSQL)"
    echo "DATABASE_URL=postgresql://user:password@host:port/database"
    echo "\n# Email (for authentication)"
    echo "EMAIL_SERVER_HOST=smtp.gmail.com"
    echo "EMAIL_SERVER_PORT=587"
    echo "EMAIL_SERVER_USER=your-email@gmail.com"
    echo "EMAIL_SERVER_PASSWORD=your-app-password"
    echo "EMAIL_FROM=your-email@gmail.com"
}

# Main menu
echo "\nChoose your deployment option:"
echo "1. Setup GitHub repository"
echo "2. Deploy to Vercel (Recommended)"
echo "3. Show environment variables setup"
echo "4. All steps (complete guide)"
echo "5. Exit"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        setup_github
        ;;
    2)
        deploy_vercel
        ;;
    3)
        show_env_setup
        ;;
    4)
        setup_github
        echo "\n" && read -p "Press Enter after setting up GitHub repository..."
        deploy_vercel
        show_env_setup
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo "\n✨ Deployment preparation complete!"
echo "📚 For detailed instructions, check DEPLOYMENT.md"
echo "🔗 API documentation: API.md"
echo "📋 Deployment checklist: CHECKLIST.md"