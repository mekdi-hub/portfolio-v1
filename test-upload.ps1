# Test Image Upload Script
Write-Host "=== Image Upload Test ===" -ForegroundColor Cyan

# Check if backend is running
Write-Host ""
Write-Host "Checking backend server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000/api/projects" -UseBasicParsing
    Write-Host "Backend is running (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "Backend is NOT running!" -ForegroundColor Red
    Write-Host "Please start the backend server first" -ForegroundColor Yellow
    exit 1
}

# Find a test image
Write-Host ""
Write-Host "Looking for test image..." -ForegroundColor Yellow
$testImage = Get-ChildItem -Path "backend\storage\app\public\projects" -Filter "*.png" -File | Select-Object -First 1

if (-not $testImage) {
    Write-Host "No test image found" -ForegroundColor Red
    exit 1
}

Write-Host "Using test image: $($testImage.Name)" -ForegroundColor Green
Write-Host "Size: $([math]::Round($testImage.Length / 1KB, 2)) KB" -ForegroundColor Gray

# Upload image
Write-Host ""
Write-Host "Uploading image..." -ForegroundColor Yellow

try {
    $uri = "http://localhost:8000/api/projects/upload-image"
    $fileBytes = [System.IO.File]::ReadAllBytes($testImage.FullName)
    $fileName = $testImage.Name
    $boundary = [System.Guid]::NewGuid().ToString()
    $LF = "`r`n"
    
    $bodyLines = (
        "--$boundary",
        "Content-Disposition: form-data; name=`"image`"; filename=`"$fileName`"",
        "Content-Type: application/octet-stream$LF",
        [System.Text.Encoding]::GetEncoding("iso-8859-1").GetString($fileBytes),
        "--$boundary--$LF"
    ) -join $LF
    
    $response = Invoke-WebRequest -Uri $uri -Method Post -ContentType "multipart/form-data; boundary=$boundary" -Body $bodyLines -UseBasicParsing
    
    Write-Host "Upload successful! (Status: $($response.StatusCode))" -ForegroundColor Green
    
    $result = $response.Content | ConvertFrom-Json
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host "Success: $($result.success)" -ForegroundColor $(if ($result.success) { "Green" } else { "Red" })
    if ($result.url) {
        Write-Host "URL: $($result.url)" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "Upload failed!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Test Complete ===" -ForegroundColor Cyan
