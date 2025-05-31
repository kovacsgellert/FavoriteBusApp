# Ensure the script is run from the root of the repository
$currentDir = Split-Path -Leaf (Get-Location)
if ($currentDir -eq "scripts") {
    Set-Location ..
}

dotnet run --project src\FavoriteBusApp.AppHost\FavoriteBusApp.AppHost.csproj -- $args