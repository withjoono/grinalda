<#
.SYNOPSIS
    Centralized Deployment Script for Hub Ecosystem
.DESCRIPTION
    Deploys any or all applications in the Hub ecosystem from a single entry point.
.EXAMPLE
    .\deploy-ecosystem.ps1
    Opens an interactive menu to select apps to deploy.
#>

param (
    [string]$TargetApp = ""
)

$apps = @{
    "1" = @{ Name = "Hub"; Path = "E:\Dev\github\Hub"; BackendCmd = "npm run cloudrun:deploy"; FrontendCmd = "firebase deploy --only hosting:hub"; BackendDir = "Hub-Backend"; FrontendDir = "." }
    "2" = @{ Name = "Susi (MySanggibu)"; Path = "E:\Dev\github\MySanggibu"; BackendCmd = "npm run cloudrun:deploy"; FrontendCmd = "firebase deploy --only hosting:ms"; BackendDir = "backend"; FrontendDir = "." }
    "3" = @{ Name = "Jungsi"; Path = "E:\Dev\github\Jungsi"; BackendCmd = "npm run cloudrun:deploy"; FrontendCmd = "firebase deploy --only hosting:jungsi"; BackendDir = "jungsi-backend"; FrontendDir = "." }
    "4" = @{ Name = "StudyPlanner"; Path = "E:\Dev\github\StudyPlanner"; BackendCmd = "gcloud builds submit --config cloudbuild.yaml"; FrontendCmd = "firebase deploy --only hosting"; BackendDir = "."; FrontendDir = "." }
    "5" = @{ Name = "ExamHub"; Path = "E:\Dev\github\ExamHub"; BackendCmd = "gcloud builds submit --config cloudbuild.yaml"; FrontendCmd = "firebase deploy --only hosting:examhub"; BackendDir = "."; FrontendDir = "." }
    "6" = @{ Name = "TutorBoard"; Path = "E:\Dev\github\TutorBoard"; BackendCmd = "gcloud builds submit --config cloudbuild.yaml"; FrontendCmd = "firebase deploy --only hosting:tutorboard"; BackendDir = "backend"; FrontendDir = "." }
    "7" = @{ Name = "StudyArena"; Path = "E:\Dev\github\StudyArena"; BackendCmd = "gcloud builds submit --config cloudbuild.yaml"; FrontendCmd = "firebase deploy --only hosting:studyarena"; BackendDir = "apps/studyarena-backend"; FrontendDir = "." }
    "8" = @{ Name = "ParentAdmin"; Path = "E:\Dev\github\ParentAdmin"; BackendCmd = "gcloud builds submit --config cloudbuild.yaml"; FrontendCmd = ""; BackendDir = "."; FrontendDir = "" }
    "9" = @{ Name = "TeacherAdmin"; Path = "E:\Dev\github\teacher_Admin"; BackendCmd = "gcloud builds submit --config cloudbuild.yaml"; FrontendCmd = ""; BackendDir = "."; FrontendDir = "" }
    "10" = @{ Name = "Susi (Legacy)"; Path = "E:\Dev\github\Susi"; BackendCmd = "npm run cloudrun:deploy"; FrontendCmd = ""; BackendDir = "susi-back"; FrontendDir = "" }
}

function Run-Deployment {
    param (
        [string]$AppName,
        [string]$BasePath,
        [string]$BackendCmd,
        [string]$FrontendCmd,
        [string]$BackendDir,
        [string]$FrontendDir
    )

    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host " Deploying $AppName" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan

    # Backend Deployment
    if ($BackendCmd) {
        $fullBackendPath = Join-Path $BasePath $BackendDir
        Write-Host "Action: Deploying Backend" -ForegroundColor Yellow
        Write-Host "Path: $fullBackendPath" -ForegroundColor Gray
        Write-Host "Command: $BackendCmd" -ForegroundColor Gray
        
        if (Test-Path $fullBackendPath) {
            Push-Location $fullBackendPath
            Invoke-Expression $BackendCmd
            Pop-Location
        } else {
            Write-Error "Backend path not found: $fullBackendPath"
        }
    }

    # Frontend Deployment
    if ($FrontendCmd) {
        $fullFrontendPath = Join-Path $BasePath $FrontendDir
        Write-Host "Action: Deploying Frontend" -ForegroundColor Yellow
        Write-Host "Path: $fullFrontendPath" -ForegroundColor Gray
        Write-Host "Command: $FrontendCmd" -ForegroundColor Gray

        if (Test-Path $fullFrontendPath) {
            Push-Location $fullFrontendPath
            Invoke-Expression $FrontendCmd
            Pop-Location
        } else {
            Write-Error "Frontend path not found: $fullFrontendPath"
        }
    }
    
    Write-Host "Done with $AppName.`n" -ForegroundColor Green
}

# Interactive Menu
if ($TargetApp -eq "") {
    Clear-Host
    Write-Host "Hub Ecosystem Centralized Deployment" -ForegroundColor Cyan
    Write-Host "------------------------------------"
    $apps.GetEnumerator() | Sort-Object {[int]$_.Key} | ForEach-Object {
        Write-Host "$($_.Key). $($_.Value.Name)"
    }
    Write-Host "A. Deploy ALL" -ForegroundColor Magenta
    Write-Host "Q. Quit"
    Write-Host "------------------------------------"
    
    $selection = Read-Host "Select an app to deploy (1-10) or 'A' for All"
} else {
    $selection = $TargetApp
}

if ($selection -eq "Q") { exit }

if ($selection -eq "A") {
    $apps.GetEnumerator() | Sort-Object {[int]$_.Key} | ForEach-Object {
        Run-Deployment -AppName $_.Value.Name -BasePath $_.Value.Path -BackendCmd $_.Value.BackendCmd -FrontendCmd $_.Value.FrontendCmd -BackendDir $_.Value.BackendDir -FrontendDir $_.Value.FrontendDir
    }
} elseif ($apps.ContainsKey($selection)) {
    $app = $apps[$selection]
    Run-Deployment -AppName $app.Name -BasePath $app.Path -BackendCmd $app.BackendCmd -FrontendCmd $app.FrontendCmd -BackendDir $app.BackendDir -FrontendDir $app.FrontendDir
} else {
    Write-Host "Invalid selection." -ForegroundColor Red
}
