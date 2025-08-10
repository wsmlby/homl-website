#!/bin/sh
#
# This script fetches and executes the main HoML installation script from the GitHub repository.
# This allows for a stable, vanity URL (like homl.dev/install.sh) to always point to the
# latest version of the installer script in the main branch.
#
# To use it, host this script's content at your desired URL and instruct users to run:
# curl -sSL https://your-url.com/install.sh | sh

set -e

# URL of the raw main installation script on GitHub:
INSTALL_SCRIPT_URL="https://raw.githubusercontent.com/wsmlby/homl/main/scripts/install.sh"

# Fetch and execute the script.
# -f: Fail silently on server errors.
# -s: Silent or quiet mode.
# -S: Show error message if it fails.
# -L: Follow redirects.
if command -v curl >/dev/null 2>&1; then
  sh -c "$(curl -fsSL "$INSTALL_SCRIPT_URL")"
else
  echo "Error: curl is required to download the installer." >&2
  exit 1
fi
