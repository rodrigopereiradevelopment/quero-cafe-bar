param(
  [switch]$SkipClone
)

$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$MYSQL_BIN = "C:\xampp\mysql\bin\mysql.exe"
$MYSQLD_BIN = "C:\xampp\mysql\bin\mysqld.exe"
$DB_PORT = 3307

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Quero Café Bar - Setup Automático" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# ─── 1. Instalar dependências ───────────────────────────────────────
Write-Host "`n📦 Instalando dependências..." -ForegroundColor Yellow

if (-not (Test-Path "$ROOT\backend\node_modules")) {
  Push-Location "$ROOT\backend"
  npm install
  Pop-Location
} else {
  Write-Host "   Backend: já instalado" -ForegroundColor Green
}

if (-not (Test-Path "$ROOT\frontend\node_modules")) {
  Push-Location "$ROOT\frontend"
  npm install
  Pop-Location
} else {
  Write-Host "   Frontend: já instalado" -ForegroundColor Green
}

# ─── 2. Iniciar MySQL do XAMPP ─────────────────────────────────────
Write-Host "`n🐬 Iniciando MySQL (XAMPP)..." -ForegroundColor Yellow

# Mata processos MySQL antigos do XAMPP (porta 3307)
Get-Process -Name "mysqld" -ErrorAction SilentlyContinue | Where-Object {
  $_.Id -and (netstat -ano | Select-String "3307.*$($_.Id)")
} | ForEach-Object {
  Write-Host "   Encerrando MySQL antigo (PID $($_.Id))..." -ForegroundColor DarkYellow
  Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 2
}

# Inicia o mysqld do XAMPP
$mysqlLog = "$ROOT\mysql.log"
Start-Process -NoNewWindow -FilePath $MYSQLD_BIN -ArgumentList "--port=$DB_PORT --datadir=C:\xampp\mysql\data" -RedirectStandardOutput $mysqlLog -RedirectStandardError $mysqlLog

# Aguarda MySQL ficar pronto
Write-Host "   Aguardando MySQL iniciar..." -NoNewline
$maxWait = 30
$waited = 0
while ($waited -lt $maxWait) {
  Start-Sleep -Seconds 1
  $waited++
  try {
    & $MYSQL_BIN -u root -P $DB_PORT -e "SELECT 1" 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) {
      Write-Host " pronto!" -ForegroundColor Green
      break
    }
  } catch {}
  Write-Host "." -NoNewline
}
if ($waited -ge $maxWait) {
  Write-Host "`n❌ MySQL não iniciou a tempo. Verifique o log: $mysqlLog" -ForegroundColor Red
  exit 1
}

# ─── 3. Criar schema ────────────────────────────────────────────────
Write-Host "`n🗄️  Criando schema quero_cafe_bar..." -ForegroundColor Yellow
& $MYSQL_BIN -u root -P $DB_PORT -e "CREATE SCHEMA IF NOT EXISTS quero_cafe_bar;"
Write-Host "   OK" -ForegroundColor Green

# ─── 4. Migrations ──────────────────────────────────────────────────
Write-Host "`n🔄 Rodando migrations..." -ForegroundColor Yellow
Push-Location "$ROOT\backend"
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js --dataSource src/config/orm.config.ts migration:run
Pop-Location
Write-Host "   OK" -ForegroundColor Green

# ─── 5. Seed ────────────────────────────────────────────────────────
Write-Host "`n🌱 Rodando seed..." -ForegroundColor Yellow
Push-Location "$ROOT\backend"
npx ts-node -r tsconfig-paths/register src/database/seed.ts
Pop-Location

# ─── 6. Iniciar servidores ──────────────────────────────────────────
Write-Host "`n🚀 Iniciando servidores..." -ForegroundColor Yellow

Write-Host "   Backend  → http://localhost:3001" -ForegroundColor Green
Push-Location "$ROOT\backend"
Start-Job -Name "backend" -ScriptBlock { param($d) cd $d; npx nest start --watch } -ArgumentList "$ROOT\backend"
Pop-Location

Write-Host "   Frontend → http://localhost:5173" -ForegroundColor Green
Push-Location "$ROOT\frontend"
Start-Job -Name "frontend" -ScriptBlock { param($d) cd $d; npx vite --host } -ArgumentList "$ROOT\frontend"
Pop-Location

Start-Sleep -Seconds 5

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  ✅ Setup concluído!" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:3001" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`nCredenciais padrão:" -ForegroundColor White
Write-Host "  admin / admin (Administrador)" -ForegroundColor Gray
Write-Host "  garcom / garcom (Atendente)" -ForegroundColor Gray
Write-Host "  rodrigo / rodrigo (Cliente)" -ForegroundColor Gray
Write-Host "`nPressione qualquer tecla para encerrar os servidores..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Get-Job | Stop-Job | Remove-Job
