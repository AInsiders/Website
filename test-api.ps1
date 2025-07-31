# PowerShell script to test NurmoAI API
$API_KEY = "nu-bVI8A2TPpxfwfxPP4oKrkvq5mlgwj8efUcQHstcoE8Knvs4M"
$API_URL = "https://api.nurmo.app/v1/chat/completions"
$CHARACTER_ID = "43413d25-073c-4f3d-8cf1-f1c98cfa00b3"

Write-Host "Testing NurmoAI API..." -ForegroundColor Green
Write-Host "API URL: $API_URL" -ForegroundColor Yellow
Write-Host "Character ID: $CHARACTER_ID" -ForegroundColor Yellow
Write-Host "API Key: $($API_KEY.Substring(0,10))..." -ForegroundColor Yellow
Write-Host ""

# Test 1: Basic request
Write-Host "Test 1: Basic NurmoAI request" -ForegroundColor Cyan
$body = @{
    messages = @(
        @{
            role = "user"
            content = "Hello, how are you?"
        }
    )
    model = "nurmo-3"
    character = $CHARACTER_ID
} | ConvertTo-Json -Depth 3

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $API_KEY"
}

try {
    $response = Invoke-RestMethod -Uri $API_URL -Method POST -Body $body -Headers $headers
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 5)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        $statusDescription = $_.Exception.Response.StatusDescription
        Write-Host "Status: $statusCode - $statusDescription" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test 2: Without character ID" -ForegroundColor Cyan
$body2 = @{
    messages = @(
        @{
            role = "user"
            content = "Hello"
        }
    )
    model = "nurmo-3"
} | ConvertTo-Json -Depth 3

try {
    $response2 = Invoke-RestMethod -Uri $API_URL -Method POST -Body $body2 -Headers $headers
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Response: $($response2 | ConvertTo-Json -Depth 5)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        $statusDescription = $_.Exception.Response.StatusDescription
        Write-Host "Status: $statusCode - $statusDescription" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test 3: Different endpoint (.ai domain)" -ForegroundColor Cyan
$API_URL_AI = "https://api.nurmo.ai/v1/chat/completions"

try {
    $response3 = Invoke-RestMethod -Uri $API_URL_AI -Method POST -Body $body -Headers $headers
    Write-Host "Success!" -ForegroundColor Green
    Write-Host "Response: $($response3 | ConvertTo-Json -Depth 5)" -ForegroundColor White
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        $statusDescription = $_.Exception.Response.StatusDescription
        Write-Host "Status: $statusCode - $statusDescription" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Test 4: Authentication test" -ForegroundColor Cyan
$headers_invalid = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer invalid-key"
}

try {
    $response4 = Invoke-RestMethod -Uri $API_URL -Method POST -Body $body -Headers $headers_invalid
    Write-Host "Unexpected success with invalid key!" -ForegroundColor Yellow
} catch {
    Write-Host "Expected error with invalid key: $($_.Exception.Message)" -ForegroundColor Green
}

Write-Host ""
Write-Host "All tests completed!" -ForegroundColor Green 