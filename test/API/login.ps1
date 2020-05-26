$res = @()
$res += Invoke-WebRequest -Headers @{'Content-Type' = 'application/json' } -Uri http://toko/api/user/login -Method 'POST' -Body '{"username":"hanyuu","password":"123"}'
$res += Invoke-WebRequest -Headers @{'Content-Type' = 'application/json' } -Uri http://toko/api/user/login -Method 'POST' -Body '{"username":"hanyuu","password":"1234"}'
foreach ($item in $res) {
    Write-Output($item.Content)
}