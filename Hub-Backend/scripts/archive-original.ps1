# ====================================================================
# GB-Back-Nest-Original 디렉토리 아카이브 스크립트 (PowerShell)
# ====================================================================

Write-Host "🗂️  GB-Back-Nest-Original 디렉토리 아카이브 시작" -ForegroundColor Cyan
Write-Host ""

# 현재 날짜/시간
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$archiveName = "GB-Back-Nest-Original_$timestamp.zip"

# 아카이브 대상 디렉토리 확인
if (-Not (Test-Path "GB-Back-Nest-Original")) {
    Write-Host "❌ GB-Back-Nest-Original 디렉토리가 존재하지 않습니다." -ForegroundColor Red
    exit 1
}

Write-Host "📦 아카이브 파일명: $archiveName" -ForegroundColor Yellow
Write-Host ""

# 디렉토리 크기 확인
$size = (Get-ChildItem -Recurse "GB-Back-Nest-Original" | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "📊 디렉토리 크기: $([math]::Round($size, 2)) MB" -ForegroundColor Green
Write-Host ""

# 아카이브 생성
Write-Host "🔄 압축 중..." -ForegroundColor Yellow
try {
    Compress-Archive -Path "GB-Back-Nest-Original" -DestinationPath $archiveName -Force

    $archiveSize = (Get-Item $archiveName).Length / 1MB
    Write-Host ""
    Write-Host "✅ 아카이브 생성 완료!" -ForegroundColor Green
    Write-Host "   파일: $archiveName" -ForegroundColor White
    Write-Host "   크기: $([math]::Round($archiveSize, 2)) MB" -ForegroundColor White
    Write-Host ""

    # 삭제 확인
    $reply = Read-Host "📁 원본 디렉토리를 삭제하시겠습니까? (y/N)"

    if ($reply -eq "y" -or $reply -eq "Y") {
        Write-Host "🗑️  원본 디렉토리 삭제 중..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "GB-Back-Nest-Original"

        if (-Not (Test-Path "GB-Back-Nest-Original")) {
            Write-Host "✅ 원본 디렉토리 삭제 완료" -ForegroundColor Green
            Write-Host ""
            Write-Host "📝 다음 단계:" -ForegroundColor Cyan
            Write-Host "   1. $archiveName 을 안전한 곳에 백업" -ForegroundColor White
            Write-Host "   2. Git 커밋: git add . && git commit -m 'chore: Archive GB-Back-Nest-Original'" -ForegroundColor White
            Write-Host "   3. 테이블 삭제 진행" -ForegroundColor White
        }
        else {
            Write-Host "❌ 디렉토리 삭제 실패" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "ℹ️  원본 디렉토리는 유지됩니다." -ForegroundColor Blue
        Write-Host "   아카이브만 생성되었습니다: $archiveName" -ForegroundColor White
    }
}
catch {
    Write-Host "❌ 아카이브 생성 실패: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ 완료!" -ForegroundColor Green
