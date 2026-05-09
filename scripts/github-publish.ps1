$ErrorActionPreference = "Stop"

function Load-DotEnvLocal([string]$Path) {
  if (!(Test-Path -LiteralPath $Path)) { return }
  Get-Content -LiteralPath $Path | ForEach-Object {
    $line = $_.Trim()
    if ($line.Length -eq 0) { return }
    if ($line.StartsWith("#")) { return }
    $idx = $line.IndexOf("=")
    if ($idx -lt 1) { return }
    $key = $line.Substring(0, $idx).Trim()
    $val = $line.Substring($idx + 1).Trim()
    if ($val.StartsWith("\"") -and $val.EndsWith("\"") -and $val.Length -ge 2) {
      $val = $val.Substring(1, $val.Length - 2)
    }
    Set-Item -Path ("Env:\" + $key) -Value $val
  }
}

function Invoke-GhApi([string]$Method, [string]$Url, [object]$Body = $null) {
  $token = $env:DXF_GH_TOKEN
  if ([string]::IsNullOrWhiteSpace($token)) { throw "DXF_GH_TOKEN is missing. Put it in .env.local or environment." }
  $headers = @{
    Authorization       = "Bearer $token"
    "X-GitHub-Api-Version" = "2022-11-28"
    "User-Agent"        = "dxf-publish-script"
  }
  if ($null -ne $Body) {
    return Invoke-RestMethod -Method $Method -Uri $Url -Headers $headers -Body ($Body | ConvertTo-Json -Depth 6) -ContentType "application/json"
  }
  return Invoke-RestMethod -Method $Method -Uri $Url -Headers $headers
}

function Ensure-GitRepo() {
  git rev-parse --is-inside-work-tree 1>$null 2>$null
  if ($LASTEXITCODE -ne 0) { throw "Not a git repository. Run this script from the project root." }
}

function Ensure-BranchMain() {
  $branch = (git branch --show-current).Trim()
  if ($branch -ne "main") {
    git branch -M main
  }
}

function Ensure-RemoteOrigin([string]$Url) {
  $remote = (git remote).Trim() -split "`r?`n" | Where-Object { $_ -eq "origin" }
  if ($remote) {
    git remote set-url origin $Url
  } else {
    git remote add origin $Url
  }
}

function Push-WithBearer([string]$Token) {
  # Avoid putting the token into git remote config by using an extra HTTP header.
  git -c http.https://github.com/.extraheader="AUTHORIZATION: bearer $Token" push -u origin main
  if ($LASTEXITCODE -ne 0) { throw "git push failed." }
}

param(
  [string]$RepoName = "driveXfriends",
  [switch]$SkipCreate
)

$root = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $root

Load-DotEnvLocal (Join-Path $root ".env.local")
Ensure-GitRepo
Ensure-BranchMain

$token = $env:DXF_GH_TOKEN
if ([string]::IsNullOrWhiteSpace($token)) {
  throw "DXF_GH_TOKEN is missing. Create .env.local (see .env.local.example) and paste the token there."
}

$me = Invoke-GhApi "GET" "https://api.github.com/user"
$owner = $me.login
$full = "$owner/$RepoName"

if (-not $SkipCreate) {
  try {
    Invoke-GhApi "POST" "https://api.github.com/user/repos" @{ name = $RepoName; private = $true } | Out-Null
    Write-Host "Created repo: $full"
  } catch {
    # 422: already exists
    $msg = $_.Exception.Message
    Write-Host "Repo create skipped (maybe already exists): $msg"
  }
}

Ensure-RemoteOrigin ("https://github.com/$full.git")
Push-WithBearer $token

Write-Host "Pushed to: https://github.com/$full"
