#!/usr/bin/env bash
set -euo pipefail

# Ensure a terminal editor is present each time the container starts.
code --command workbench.action.createTerminalEditor >/dev/null 2>&1 || true
