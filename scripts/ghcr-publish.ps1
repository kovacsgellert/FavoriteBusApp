param(
    [Alias("v")]
    [Parameter(Mandatory=$true)]
    [string]$version,

    [Alias("api")]
    [switch]$publishApi,

    [Alias("client")]
    [switch]$publishClient
)

# Ensure the script is run from the root of the repository
$currentDir = Split-Path -Leaf (Get-Location)
if ($currentDir -eq "scripts") {
    Set-Location ..
}

$GHCR_USER = "kovacsgellert"
$REPO = "favoritebusapp"

echo $env:GHCR_PAT | docker login ghcr.io -u $GHCR_USER --password-stdin

if ($publishApi) {
    $API_IMAGE = "ghcr.io/$GHCR_USER/$REPO/favoritebusapp-api"
    docker build -f src/FavoriteBusApp.Api/Dockerfile -t "${API_IMAGE}:$version" .
    docker tag "${API_IMAGE}:$version" "${API_IMAGE}:latest"
    docker push "${API_IMAGE}:$version"
    docker push "${API_IMAGE}:latest"
} else {
    echo "Skipping API image build and push."
}

if ($publishClient) {
    $CLIENT_IMAGE = "ghcr.io/$GHCR_USER/$REPO/favoritebusapp-client"
    docker build -f src/favoritebusapp-client/Dockerfile -t "${CLIENT_IMAGE}:$version" .
    docker build -f src/favoritebusapp-client/Dockerfile -t "${CLIENT_IMAGE}:$version" .
    docker tag "${CLIENT_IMAGE}:$version" "${CLIENT_IMAGE}:latest"
    docker push "${CLIENT_IMAGE}:$version"
    docker push "${CLIENT_IMAGE}:latest"
} else {
    echo "Skipping Client image build and push."
}