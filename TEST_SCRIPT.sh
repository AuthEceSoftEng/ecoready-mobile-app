#!/bin/bash

# EcoReady App - Complete Testing Suite
# Run this script to test all features (US14-17)

echo "🌍 EcoReady App - Testing Suite"
echo "================================"
echo ""

# Step 1: Install dependencies
echo "📦 Step 1: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 2: Clear cache
echo "🧹 Step 2: Clearing Expo cache..."
expo start --c
echo ""
