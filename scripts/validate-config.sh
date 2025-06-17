#!/bin/bash

# VCode Configuration Validation Script
echo "🔍 Validating VCode Configuration..."

# Check required files
REQUIRED_FILES=(
  "config/main-config.json"
  ".env.production"
  "browser-extension/manifest.json"
  "config/accessibility/accessibility-config.json"
  "config/legal/legal-compliance.json"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing required file: $file"
    exit 1
  else
    echo "✅ Found: $file"
  fi
done

# Validate environment variables
echo "🔍 Validating environment variables..."
source .env.production

REQUIRED_VARS=(
  "PROJECT_ID"
  "GROQ_API_KEY"
  "DB_PASSWORD"
  "JWT_SECRET"
  "EVIDENCE_SIGNING_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "❌ Missing environment variable: $var"
    exit 1
  else
    echo "✅ Found: $var"
  fi
done

# Test Groq API connection
echo "🧠 Testing Groq API connection..."
if command -v curl &> /dev/null; then
  response=$(curl -s -H "Authorization: Bearer $GROQ_API_KEY" \
    "https://api.groq.com/openai/v1/models" | grep -o '"id"' | wc -l)
  
  if [ "$response" -gt 0 ]; then
    echo "✅ Groq API connection successful"
  else
    echo "❌ Groq API connection failed"
    exit 1
  fi
else
  echo "⚠️ curl not found, skipping API test"
fi

# Validate accessibility configuration
echo "♿ Validating accessibility configuration..."
if [ -f "config/accessibility/accessibility-config.json" ]; then
  if command -v jq &> /dev/null; then
    wcag_level=$(jq -r '.wcag.level' config/accessibility/accessibility-config.json)
    asl_enabled=$(jq -r '.asl.enabled' config/accessibility/accessibility-config.json)
    
    echo "✅ WCAG Level: $wcag_level"
    echo "✅ ASL Support: $asl_enabled"
  else
    echo "⚠️ jq not found, skipping JSON validation"
  fi
fi

echo "✅ Configuration validation complete!"
