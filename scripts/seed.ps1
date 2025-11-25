#!/usr/bin/env pwsh
<#
.SYNOPSIS
    PowerShell helper script to run the seed script with proper environment setup
.DESCRIPTION
    This script ensures .env.local is loaded before running the seed script
#>

# Load environment variables from .env.local
$envFile = Join-Path $PSScriptRoot ".env.local"

if (Test-Path $envFile) {
    Write-Host "📂 Loading environment from: $envFile" -ForegroundColor Cyan
    
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*$' -or $_ -match '^\s*#') {
            # Skip empty lines and comments
            return
        }
        if ($_ -match '(\w+)=(.*)') {
            $key = $matches[1]
            $value = $matches[2].Trim('"''')
            [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
            if ($key -eq "MONGODB_URI") {
                Write-Host "✅ Set MONGODB_URI" -ForegroundColor Green
            }
        }
    }
} else {
    Write-Host "❌ Error: .env.local not found at $envFile" -ForegroundColor Red
    exit 1
}

# Verify MONGODB_URI is set
if ([string]::IsNullOrEmpty([System.Environment]::GetEnvironmentVariable("MONGODB_URI"))) {
    Write-Host "❌ Error: MONGODB_URI is not set after loading .env.local" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Running seed script..." -ForegroundColor Yellow
# Run the seed script
npx tsx scripts/seed-database.ts
