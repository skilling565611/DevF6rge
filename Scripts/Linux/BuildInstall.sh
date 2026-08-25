#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
version="2.1.2"
vsix="$project_dir/devforge-language-$version.vsix"

cd "$project_dir"

command -v npx >/dev/null 2>&1 || {
    echo "Node.js/npm is required. Install it, then run this file again."
    exit 1
}
command -v code >/dev/null 2>&1 || {
    echo "The VS Code 'code' command was not found in PATH."
    exit 1
}

echo "Building DevForge $version..."
npx --yes @vscode/vsce package --out "$vsix"

echo "Installing $vsix..."
code --install-extension "$vsix" --force

echo "DevForge $version is installed."
echo "In VS Code, run: Developer: Reload Window"
