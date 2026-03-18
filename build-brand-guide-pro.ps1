param(
    [string]$OutputPdf = "C:\Users\Nico\Downloads\Astrivia-Brand-Guide-Pro.pdf"
)

$ErrorActionPreference = "Stop"

$projectRoot = "n:\astrivia-website\astrivia-next-hotfix"
$astriviaLogoPath = Join-Path $projectRoot "public\images\astrivia-logo-fixed.png"
$astriviaSymbolPath = Join-Path $projectRoot "public\images\logo-symbol.png"
$googleLogoPath = Join-Path $projectRoot "public\images\partners\google-cloud-full-color.png"

$requiredAssets = @($astriviaLogoPath, $astriviaSymbolPath, $googleLogoPath)
foreach ($asset in $requiredAssets) {
    if (-not (Test-Path $asset)) {
        throw "Asset nao encontrado: $asset"
    }
}

$astriviaLogoUri = (New-Object System.Uri($astriviaLogoPath)).AbsoluteUri
$astriviaSymbolUri = (New-Object System.Uri($astriviaSymbolPath)).AbsoluteUri
$googleLogoUri = (New-Object System.Uri($googleLogoPath)).AbsoluteUri

$colorCards = @(
    @{ Name = "Cyan principal"; Hex = "#00D9FF"; Use = "Identidade e destaques principais" },
    @{ Name = "Preto base"; Hex = "#0A0A0A"; Use = "Fundos institucionais e hero" },
    @{ Name = "Superficie"; Hex = "#141414"; Use = "Cards, blocos e secoes elevadas" },
    @{ Name = "Roxo de apoio"; Hex = "#A855F7"; Use = "Acentos secundarios e gradientes" },
    @{ Name = "Verde credibilidade"; Hex = "#10B981"; Use = "Status, validacao e sinais positivos" }
)

$swatchesHtml = ($colorCards | ForEach-Object {
    @"
<div class='swatch-card'>
  <div class='swatch' style='background: $($_.Hex);'></div>
  <div class='swatch-meta'>
    <h4>$($_.Name)</h4>
    <p><code>$($_.Hex)</code></p>
    <small>$($_.Use)</small>
  </div>
</div>
"@
}) -join "`n"

$generatedAt = (Get-Date).ToString("dd/MM/yyyy HH:mm")

$html = @"
<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Astrivia Brand Guide</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #111;
      background: #f4f6f8;
      line-height: 1.45;
    }
    .page {
      width: 210mm;
      min-height: 297mm;
      margin: 0 auto 10mm auto;
      background: #fff;
      box-shadow: 0 6px 24px rgba(0,0,0,0.10);
      padding: 22mm 18mm;
      page-break-after: always;
    }
    .page:last-child { page-break-after: auto; }
    .cover {
      background: linear-gradient(160deg, #0a0a0a 0%, #071221 55%, #0b0f17 100%);
      color: #fff;
      position: relative;
      overflow: hidden;
    }
    .cover:before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 85% 15%, rgba(0,217,255,.20), transparent 35%);
      pointer-events: none;
    }
    .logo-row {
      text-align: center;
      margin-top: 24mm;
      margin-bottom: 14mm;
    }
    .logo-row img.main-logo {
      width: 115mm;
      max-width: 100%;
      height: auto;
    }
    .cover h1 {
      text-align: center;
      font-size: 30px;
      margin: 0 0 6mm;
      letter-spacing: .3px;
    }
    .cover p {
      text-align: center;
      margin: 0 auto;
      max-width: 138mm;
      color: rgba(255,255,255,.80);
      font-size: 13.5px;
    }
    .chip {
      display: inline-block;
      margin-top: 8mm;
      margin-left: auto;
      margin-right: auto;
      background: rgba(0,217,255,.14);
      border: 1px solid rgba(0,217,255,.40);
      color: #d9f8ff;
      padding: 7px 13px;
      border-radius: 999px;
      font-size: 12px;
    }
    .section-title {
      font-size: 20px;
      margin: 0 0 4mm;
      color: #0b1726;
    }
    .section-sub {
      margin: 0 0 7mm;
      color: #455060;
      font-size: 12px;
    }
    .split {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8mm;
      align-items: start;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 5mm;
      background: #fff;
    }
    .card h3 {
      margin: 0 0 3mm;
      font-size: 14px;
      color: #0f1f33;
    }
    .card p, .card li {
      font-size: 11.5px;
      color: #4a5568;
    }
    ul {
      margin: 2mm 0 0 5mm;
      padding: 0;
    }
    li { margin-bottom: 2.2mm; }
    .swatch-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5mm;
      margin-top: 4mm;
    }
    .swatch-card {
      border: 1px solid #e4e9f0;
      border-radius: 10px;
      padding: 4mm;
      overflow: hidden;
      background: #fff;
    }
    .swatch {
      height: 16mm;
      border-radius: 8px;
      border: 1px solid rgba(0,0,0,0.10);
      margin-bottom: 3mm;
    }
    .swatch-meta h4 {
      margin: 0 0 1.5mm;
      font-size: 12.5px;
      color: #1a2433;
    }
    .swatch-meta p {
      margin: 0 0 1.5mm;
      font-size: 11px;
      color: #3f4a59;
    }
    code {
      background: #f1f5f9;
      padding: 1px 5px;
      border-radius: 4px;
      font-family: Consolas, monospace;
      font-size: 10.5px;
    }
    .swatch-meta small {
      color: #5f6b7b;
      font-size: 10.5px;
      display: block;
    }
    .logo-box {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 5mm;
      margin-top: 5mm;
      text-align: center;
      background: #ffffff;
    }
    .logo-box img {
      max-width: 100%;
      height: auto;
    }
    .logo-box img.wordmark { width: 90mm; }
    .logo-box img.symbol { width: 26mm; margin-top: 4mm; }
    .rule-ok { color: #0b7d53; font-weight: 600; }
    .rule-no { color: #b42318; font-weight: 600; }
    .footer-note {
      margin-top: 7mm;
      font-size: 10.5px;
      color: #718096;
      border-top: 1px solid #e2e8f0;
      padding-top: 3mm;
    }
    .google-strip {
      margin-top: 6mm;
      padding: 4mm;
      border: 1px dashed #d0d7e2;
      border-radius: 10px;
      background: #fbfdff;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 4mm;
      align-items: center;
    }
    .google-strip p {
      margin: 0;
      font-size: 11.5px;
      color: #3f4a59;
    }
    .google-strip img {
      width: 42mm;
      height: auto;
      border-radius: 6px;
      border: 1px solid #eceff4;
      background: #fff;
      padding: 2mm;
    }
  </style>
</head>
<body>
  <section class="page cover">
    <div class="logo-row">
      <img class="main-logo" src="$astriviaLogoUri" alt="Astrivia AI logo oficial" />
    </div>
    <h1>Astrivia Brand Guide</h1>
    <p>Guia oficial para apresentacoes comerciais, materiais institucionais, propostas e comunicacao de marca.</p>
    <p class="chip">Parte do Google for Startups Cloud Program</p>
    <p style="margin-top: 62mm; font-size: 11px; color: rgba(255,255,255,.58);">Versao 1.1 - Gerado em $generatedAt</p>
  </section>

  <section class="page">
    <h2 class="section-title">1. Logo oficial da Astrivia</h2>
    <p class="section-sub">Use sempre os arquivos oficiais abaixo. Nao recriar, nao redesenhar e nao alterar proporcoes.</p>
    <div class="split">
      <div class="card">
        <h3>Arquivos oficiais</h3>
        <ul>
          <li>Wordmark principal: <code>public/images/astrivia-logo-fixed.png</code></li>
          <li>Versao vetorial: <code>public/images/astrivia-logo-hires.svg</code></li>
          <li>Simbolo: <code>public/images/logo-symbol.png</code></li>
        </ul>
      </div>
      <div class="card">
        <h3>Regras de uso</h3>
        <ul>
          <li><span class="rule-ok">DO:</span> manter contraste alto com fundo.</li>
          <li><span class="rule-ok">DO:</span> preservar area de respiro ao redor do logo.</li>
          <li><span class="rule-no">DON'T:</span> distorcer, rotacionar ou aplicar sombra pesada.</li>
          <li><span class="rule-no">DON'T:</span> trocar as cores do logo manualmente.</li>
        </ul>
      </div>
    </div>

    <div class="logo-box">
      <img class="wordmark" src="$astriviaLogoUri" alt="Astrivia AI wordmark oficial" />
      <br />
      <img class="symbol" src="$astriviaSymbolUri" alt="Astrivia AI simbolo oficial" />
    </div>

    <h2 class="section-title" style="margin-top: 8mm;">2. Paleta principal (5 cores)</h2>
    <p class="section-sub">Paleta extraida do design system atual do site Astrivia.</p>
    <div class="swatch-grid">
      $swatchesHtml
    </div>

    <div class="footer-note">
      Arquivo preparado para envio a clientes e parceiros. Em caso de duvida, usar esta versao como referencia oficial.
    </div>
  </section>

  <section class="page">
    <h2 class="section-title">3. Tipografia e aplicacao</h2>
    <div class="split">
      <div class="card">
        <h3>Tipografia</h3>
        <ul>
          <li>Titulos: <code>Space Grotesk</code> (peso 600-700)</li>
          <li>Texto corrido: <code>Inter</code> (peso 400-500)</li>
          <li>Uso recomendado: hierarquia forte com alto contraste.</li>
        </ul>
      </div>
      <div class="card">
        <h3>Direcao visual</h3>
        <ul>
          <li>Base escura com acentos em cyan.</li>
          <li>Elementos com borda suave e leitura limpa.</li>
          <li>Evitar excesso de efeitos que prejudiquem legibilidade.</li>
        </ul>
      </div>
    </div>

    <h2 class="section-title" style="margin-top: 9mm;">4. Relacao com Google Cloud</h2>
    <div class="card">
      <h3>Texto permitido</h3>
      <ul>
        <li>Parte do Google for Startups Cloud Program</li>
        <li>Google Cloud technology enables us to ...</li>
        <li>Compatible / integrates with Google Cloud</li>
      </ul>
      <h3 style="margin-top: 5mm;">Texto a evitar</h3>
      <ul>
        <li><span class="rule-no">DON'T:</span> "Powered by Google Cloud"</li>
      </ul>

      <div class="google-strip">
        <p>Ao usar o logo Google Cloud, manter o arquivo oficial, boa legibilidade e texto claro descrevendo a relacao real.</p>
        <img src="$googleLogoUri" alt="Google Cloud official logo" />
      </div>
    </div>

    <div class="footer-note">
      Gerado automaticamente em $generatedAt | Astrivia AI
    </div>
  </section>
</body>
</html>
"@

$tempHtml = Join-Path $env:TEMP "astrivia-brand-guide-pro.html"
Set-Content -Path $tempHtml -Value $html -Encoding UTF8

$word = $null
$doc = $null

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    $doc = $word.Documents.Open($tempHtml)
    $doc.ExportAsFixedFormat($OutputPdf, 17)

    Write-Output "PDF gerado com sucesso: $OutputPdf"
}
finally {
    if ($doc -ne $null) {
        $doc.Close($false) | Out-Null
    }
    if ($word -ne $null) {
        $word.Quit() | Out-Null
    }
    if (Test-Path $tempHtml) {
        Remove-Item $tempHtml -Force
    }
}
