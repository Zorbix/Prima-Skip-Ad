# Prima Skip Ad — Chrome Web Store submission

Prepared 2026-09-24 for version 1.1.0. Local materials are prepared; the item has not been uploaded or submitted. The privacy policy is included in the GitHub repository; the publisher must complete account setup and dashboard declarations.

## Package and assets

- Upload `store/prima-skip-ad-1.1.0.zip` (only runtime files; manifest at root).
- Store icon: `store/assets/icon-128.png` (128 × 128 PNG; circular artwork 112 px).
- Required small promotion: `store/assets/promo-440x280.png`.
- Screenshot: `store/assets/screenshot-1280x800.png`.
- Privacy policy for a public GitHub repository: `PRIVACY.md` (an HTML copy is also in `store/privacy/index.html`).
- Keep the larger toolbar icons; the store icon has separate padding.

## Store listing — Czech primary language

Name: Prima Skip Ad

Short description: Posune přehrávané video o nastavitelný počet sekund.

Suggested category: Tools (choose the corresponding current dashboard category).

Detailed description:

Prima Skip Ad je jednoduché neoficiální rozšíření pro ruční posun HTML videa dopředu.

Klikněte na ikonu rozšíření, zvolte počet sekund a stiskněte „Posunout“. Výchozí hodnota je 60 sekund. Interval lze zadat ručně nebo měnit tlačítky −60 a +60. Rozšíření si nastavení pamatuje lokálně v prohlížeči. Hodnota 0 posun vypne.

Funkce:
• Posun videa o zvolený počet sekund.
• Rychlá změna intervalu tlačítky −60 a +60.
• Automatické místní uložení nastavení.
• Zpráva o výsledku přímo v panelu.
• Bez registrace a bez odesílání dat vývojáři.

Omezení:
Rozšíření pracuje s prvním videem na stránce, které má zdroj a není skryté pomocí display: none. Nepodporuje videa uvnitř vložených rámců (iframe). Některé přehrávače nebo živé přenosy přetáčení neumožňují. Na interních stránkách prohlížeče rozšíření nefunguje. Rozšíření automaticky nerozpoznává ani neblokuje reklamy a neobchází omezení přehrávače. Název neznamená záruku přeskočení reklam.

Nejde o oficiální produkt skupiny Prima a rozšíření není touto skupinou podporováno ani s ní spojeno.

## Privacy practices — paste-ready English

Single purpose:
Allow the user to manually move the first eligible HTML video on the active page forward by a configurable number of seconds.

activeTab justification:
Provides temporary access to the active page after the user invokes the extension. Access is used only when the user presses the skip button to control the video on that page. Persistent access to all websites is not requested.

scripting justification:
Injects the packaged video-seeking function into the active tab's main frame when the user presses the skip button. It finds the first eligible video and advances its currentTime by the selected interval, capped at a finite duration.

storage justification:
Stores only the selected interval in seconds in chrome.storage.local so the user's setting persists between popup openings. The extension does not use storage.sync.

Remote code: No. All executable code is included in the extension ZIP. No remote scripts, eval, external libraries or remote WebAssembly are used.

Data practices:
No user data is transmitted to or collected by the developer. Only the interval is retained locally. Video metadata and playback position are accessed transiently to carry out the requested action; they are not logged or transmitted. No analytics or third-party SDKs are present.

In the dashboard, disclose consistently with the above and the privacy page. The publisher must personally confirm the certifications that data is not sold, not transferred for unrelated purposes, and not used for creditworthiness/lending.

Privacy policy URL: https://github.com/Zorbix/Prima-Skip-Ad/blob/main/PRIVACY.md
Support URL / homepage: https://github.com/Zorbix (provided by the publisher).
Support email: petr.dvorak192@seznam.cz

## Reviewer test instructions

No extension account or payment is required.
1. Open an ordinary HTTP(S) page with a seekable HTML video in the main document. Start playback and pause well before the end.
2. Invoke Prima Skip Ad. The default interval on a fresh installation is 60 seconds.
3. Click „Posunout o 60 s“. The video should advance by about 60 seconds and the popup reports the result.
4. Use +60, close and reopen the popup; confirm the interval persists. Enter 15 manually and confirm a 15-second advance.
5. Set 0; the skip and minus buttons should be disabled. Restore 60.
6. Test near the end of a finite video; the seek is capped at duration.
7. On a page without an eligible video, the popup reports that no video was found. On restricted browser pages, it reports that it cannot run.

Player restrictions remain in force; no iframe support is claimed. A site-specific login may be required by the video provider, but not by the extension.

## Publisher steps still required

1. Register in https://chrome.google.com/webstore/devconsole, pay the registration fee and complete any account verification shown there. Enable the required account security settings.
2. Confirm publisher identity/contact and any trader-status questions based on your own situation.
3. Enter https://github.com/Zorbix/Prima-Skip-Ad/blob/main/PRIVACY.md as the privacy-policy URL. Use https://github.com/Zorbix as the support/homepage link.
4. Upload ZIP via Add new item. Enter listing, privacy, images and test instructions above.
5. Choose Public or Unlisted, eligible regions and free distribution as appropriate to your intended release. These choices have not been submitted.
6. Run the manual installed-extension test above on your intended video sites; automated harness tests do not replace this.
7. Review the dashboard's validation messages, certify declarations and submit for review. Google makes the approval decision.

CHROMEWEBSTORE.md is an internal preparation document, not a file required inside the extension package.

## Official references

- https://developer.chrome.com/docs/webstore/publish
- https://developer.chrome.com/docs/webstore/images
- https://developer.chrome.com/docs/webstore/cws-dashboard-privacy
- https://developer.chrome.com/docs/webstore/register
