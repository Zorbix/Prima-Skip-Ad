# Prima Skip Ad

Neoficiální rozšíření pro Chrome. Kliknutí na ikonu otevře panel s nastavením posunu. Výchozí hodnota je 60 sekund. Hodnotu můžeš přepsat nebo měnit tlačítky −15 a +60; minimum je 0. Nastavení se automaticky ukládá. Tlačítko „Posunout“ posune první video se zdrojem, které nemá `display: none`, o zvolený počet sekund dopředu. Při hodnotě 0 je posun vypnutý. Používá stejný výběr videa jako původní skript do konzole. U konce záznamu je posun kratší.

## Instalace z Chrome Web Store

Otevři [Prima Skip Ad v Chrome Web Store](https://chromewebstore.google.com/detail/prima-skip-ad/nbfjjcajjpfkiccigakjkgpmbbbafldm) a klikni na **Přidat do Chromu**. Po instalaci připni rozšíření pomocí ikony puzzle na liště Chromu.

## Ruční instalace pro vývoj

1. V Chromu otevři `chrome://extensions`.
2. Vpravo nahoře zapni **Režim pro vývojáře**.
3. Klikni na **Načíst rozbalené** a vyber složku s projektem, která obsahuje `manifest.json`.
4. V nabídce rozšíření (ikona puzzle) připni **Prima Skip Ad** na lištu.
5. Spusť video a klikni na ikonu rozšíření. Nastav počet sekund a klikni na **Posunout**.

Výsledek posunu nebo případná chyba se zobrazí přímo v panelu.

## Automatické přeskočení reklam na Oneplay (1.2.0)

V panelu zapni **Automaticky přeskočit reklamní blok**. Režim běží i po zavření panelu, pouze v této kartě a do obnovení stránky nebo vypnutí přepínače. Když Oneplay zakáže posun vpřed uvnitř známého reklamního bloku, rozšíření přečte časové údaje reklam z přehrávače a nastaví video na konec celého souvislého bloku. Nečeká na tlačítko „Přeskočit reklamu“. Ruční posun v sekundách zůstává samostatný; hodnota 0 automatický režim nevypíná.

Podporovány jsou záznamy s časovou osou odpovídající údajům pořadu. Chybějící údaje, odlišná časová osa živého vysílání či vloženého reklamního videa nebo dosud nedostupný konec bloku nevyvolají odhadovaný skok. Pozastavené video se neposouvá. Výsledek se kontroluje po 1,5 sekundy; každý blok se zkouší nejvýše jednou za zapnutí režimu a zdroj videa. Integrace používá interní data Oneplay a může přestat fungovat po změně webu.

Ověření: `node --test tools/ad-skip.test.cjs`. Při živém ověření 25. 9. 2026 přímý posun z blokované reklamy na 28:38 uspěl a tlačítko posunu vpřed se znovu aktivovalo.

Rozšíření používá oprávnění `activeTab`, `scripting` a `storage` pro uložení nastavení: přístup k aktivní stránce získá kliknutím na ikonu. Neodesílá žádná data. Funguje i na jiných stránkách s běžným HTML videem. Video uvnitř vloženého rámce (iframe) tato verze nevyhledává. Omezení přetáčení stanovená přehrávačem zůstávají v platnosti.

Po změně souborů klikni u rozšíření na **Znovu načíst**. Složku po instalaci nepřesouvej ani nemaž.

## Chrome Web Store

Připravený balíček: `store/prima-skip-ad-1.1.0.zip`. Podklady, texty a zbývající kroky jsou v `CHROMEWEBSTORE.md`. Zásady ochrany soukromí jsou v `PRIVACY.md`; do obchodu vložte https://github.com/Zorbix/Prima-Skip-Ad/blob/main/PRIVACY.md. Podpora: [petr.dvorak192@seznam.cz](mailto:petr.dvorak192@seznam.cz), https://github.com/Zorbix. Výsledky automatizované kontroly a její omezení jsou v `store/VALIDATION.md`.
