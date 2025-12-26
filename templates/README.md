
# Valid Templates

This directory should contain the `.docx` template files for the contracts.

Important: The filenames must match the `slug` of the product in the database + `.docx` extension.

## Required Templates:
1. `ev-kira-sozlesmesi.docx`
2. `is-belirsiz-sureli-sozlesme.docx`
3. `gizlilik-sozlesmesi-nda.docx`

## How to create a template:
Use `{variable_name}` syntax for simple replacements.
Example:
> Kira Başlangıç Tarihi: {baslangicTarihi}
> Kiracı: {kiraciAdSoyad}

Conditional Logic in DocxTemplater:
{#kefilVarMi == "evet"}
  Kefil Adı: {kefilAdSoyad}
{/kefilVarMi == "evet"}
