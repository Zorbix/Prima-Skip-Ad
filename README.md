# Prímový Skip Ad

Neoficiální rozšíření pro Chrome. Kliknutí na ikonu otevře panel s nastavením posunu. Výchozí hodnota je 60 sekund. Hodnotu můžeš přepsat nebo měnit tlačítky −15 a +60; minimum je 0. Nastavení se automaticky ukládá. Tlačítko „Posunout“ posune první video se zdrojem, které nemá `display: none`, o zvolený počet sekund dopředu. Při hodnotě 0 je posun vypnutý. Používá stejný výběr videa jako původní skript do konzole. U konce záznamu je posun kratší.

## Automatické přeskočení reklam

V panelu zapni **Automaticky přeskočit reklamní blok**. Režim běží i po zavření panelu, pouze v této kartě a do obnovení stránky nebo vypnutí přepínače. Když aplikace na přehrávání zakáže posun vpřed uvnitř známého reklamního bloku, rozšíření přečte časové údaje reklam z přehrávače a nastaví video na konec celého souvislého bloku. Nečeká na tlačítko „Přeskočit reklamu“. Ruční posun v sekundách zůstává samostatný; hodnota 0 automatický režim nevypíná.

Podporovány jsou záznamy s časovou osou odpovídající údajům pořadu. Chybějící údaje, odlišná časová osa živého vysílání či vloženého reklamního videa nebo dosud nedostupný konec bloku nevyvolají odhadovaný skok. Pozastavené video se neposouvá. Výsledek se kontroluje po 1,5 sekundy; každý blok se zkouší nejvýše jednou za zapnutí režimu a zdroj videa. Integrace používá interní data aplikace na přehrávání a může přestat fungovat po změně webu.

Ověření: `node --test tools/ad-skip.test.cjs`. Při živém ověření 25. 9. 2026 přímý posun z blokované reklamy na 28:38 uspěl a tlačítko posunu vpřed se znovu aktivovalo.

Rozšíření používá oprávnění `activeTab`, `scripting` a `storage` pro uložení nastavení: přístup k aktivní stránce získá kliknutím na ikonu. Neodesílá žádná data. Funguje i na jiných stránkách s běžným HTML videem. Video uvnitř vloženého rámce (iframe) tato verze nevyhledává. Omezení přetáčení stanovená přehrávačem zůstávají v platnosti.

Po změně souborů klikni u rozšíření na **Znovu načíst**. Složku po instalaci nepřesouvej ani nemaž.

