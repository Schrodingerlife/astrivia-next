$ErrorActionPreference = "Stop"

$sourcePath = "n:\astrivia-website\astrivia-next-hotfix\BRAND-GUIDE.md"
$outputPath = "C:\Users\Nico\Downloads\Astrivia-Brand-Guide.pdf"

if (-not (Test-Path $sourcePath)) {
    throw "Arquivo fonte nao encontrado: $sourcePath"
}

$word = $null
$doc = $null

try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $word.DisplayAlerts = 0

    $doc = $word.Documents.Add()
    $content = Get-Content -Path $sourcePath -Raw -Encoding UTF8

    $doc.Content.Text = $content
    $doc.Content.Font.Name = "Calibri"
    $doc.Content.Font.Size = 11

    # 17 = wdExportFormatPDF
    $doc.ExportAsFixedFormat($outputPath, 17)

    Write-Output "PDF gerado: $outputPath"
}
finally {
    if ($doc -ne $null) {
        $doc.Close($false) | Out-Null
    }
    if ($word -ne $null) {
        $word.Quit() | Out-Null
    }
}
