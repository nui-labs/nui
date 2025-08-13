#!/bin/bash
set -e
echo "🧹 Cleaning up..."
find . \( -name node_modules -o -name .tsbuildinfo -o -name dist -o -name bun.lock \) -exec rm -rf {} +
echo "✅ Cleaning complete."
