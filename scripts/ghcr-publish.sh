#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/ghcr-publish.sh -v <version> [--api] [--client]

VERSION=""
PUBLISH_API=false
PUBLISH_CLIENT=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -v|--version)
      VERSION="$2"
      shift 2
      ;;
    --api)
      PUBLISH_API=true
      shift
      ;;
    --client)
      PUBLISH_CLIENT=true
      shift
      ;;
    -h|--help)
      echo "Usage: $0 -v <version> [--api] [--client]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: $0 -v <version> [--api] [--client]" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$VERSION" ]]; then
  echo "Error: version is required. Use -v <version>" >&2
  exit 1
fi

# Ensure the script is run from the root of the repository
CURRENT_DIR_NAME=$(basename "$PWD")
if [[ "$CURRENT_DIR_NAME" == "scripts" ]]; then
  cd ..
fi

GHCR_USER="kovacsgellert"
REPO="favoritebusapp"

if [[ -z "${GHCR_PAT:-}" ]]; then
  echo "Error: GHCR_PAT environment variable is not set." >&2
  echo "Generate a GitHub Container Registry PAT with 'write:packages' and set GHCR_PAT." >&2
  exit 1
fi

echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USER" --password-stdin

if [[ "$PUBLISH_API" == true ]]; then
  API_IMAGE="ghcr.io/$GHCR_USER/$REPO/favoritebusapp-api"
  docker build -f src/FavoriteBusApp.Api/Dockerfile -t "${API_IMAGE}:$VERSION" .
  docker tag "${API_IMAGE}:$VERSION" "${API_IMAGE}:latest"
  docker push "${API_IMAGE}:$VERSION"
  docker push "${API_IMAGE}:latest"
else
  echo "Skipping API image build and push."
fi

if [[ "$PUBLISH_CLIENT" == true ]]; then
  CLIENT_IMAGE="ghcr.io/$GHCR_USER/$REPO/favoritebusapp-client"
  docker build -f src/favoritebusapp-client/Dockerfile -t "${CLIENT_IMAGE}:$VERSION" .
  docker tag "${CLIENT_IMAGE}:$VERSION" "${CLIENT_IMAGE}:latest"
  docker push "${CLIENT_IMAGE}:$VERSION"
  docker push "${CLIENT_IMAGE}:latest"
else
  echo "Skipping Client image build and push."
fi
