param(
  [string]$RepoName = "driveXfriends",
  [switch]$SkipCreate
)

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
    if ($val.StartsWith('"') -and $val.EndsWith('"') -and $val.Length -ge 2) {
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

function Push-WithToken([string]$Token) {
  # Avoid storing the token in git config by using an extra HTTP header.
  # GitHub git-over-https expects Basic auth.
  $bytes = [Text.Encoding]::ASCII.GetBytes(("x-access-token:{0}" -f $Token))
  $b64 = [Convert]::ToBase64String($bytes)
  $configArg = ("http.https://github.com/.extraheader=AUTHORIZATION: basic {0}" -f $b64)
  & git -c $configArg push -u origin main
  if ($LASTEXITCODE -ne 0) { throw "git push failed." }
}

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
    $status = $null
    try { $status = $_.Exception.Response.StatusCode.value__ } catch { $status = $null }
    if ($status -eq 422) {
      Write-Host "Repo already exists: $full"
    } elseif ($status -eq 403) {
      throw "GitHub token cannot create repositories (403). Create the private repo '$full' on GitHub, then rerun with -SkipCreate."
    } else {
      throw
    }
  }
}

Ensure-RemoteOrigin ("https://github.com/$full.git")
Push-WithToken $token

Write-Host "Pushed to: https://github.com/$full"
