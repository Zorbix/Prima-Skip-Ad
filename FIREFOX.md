# Prímový Skip Ad pro Firefox

Firefox varianta používá Manifest V3 a vyžaduje Firefox 128 nebo novější. Ruční posun funguje na aktivní kartě; automatické přeskočení reklam je určené pro Oneplay.

## Místní test

1. Otevři `about:debugging#/runtime/this-firefox`.
2. Klikni na **Load Temporary Add-on…**.
3. Vyber `firefox/manifest.json`.
4. Otevři stránku s videem a klikni na ikonu doplňku.

Dočasně načtený doplněk se po restartu Firefoxu odstraní.

## Balíček a vydání

Sestavení vytvoří balíček pro Firefox Add-ons:

```sh
node tools/prepare-firefox.cjs
```

Výsledkem je `store/firefox/prímový-skip-ad-1.2.2.xpi`. Pro trvalou instalaci v běžném Firefoxu je nutné balíček nahrát do Firefox Add-ons a nechat jej podepsat.
