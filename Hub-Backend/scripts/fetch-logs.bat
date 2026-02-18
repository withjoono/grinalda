
@echo off
echo Fetching App Engine logs...
echo.
call gcloud app logs read --service=default --limit=30
echo.
echo If the above command failed or showed nothing, try Cloud Run logs:
echo.
call gcloud run services logs read geobukschool-backend --region asia-northeast3 --limit=30
pause
