// Runs in Firefox's MAIN world. The popup calls it through JSON-only DOM events.
const requestEvent = "__primovySkipAdRequestV1";
const responseEvent = "__primovySkipAdResponseV1";
window.addEventListener(requestEvent, event => {
  let request;
  try { request = JSON.parse(event.detail); } catch { return; }
  if (!request?.requestId) return;
  Promise.resolve(manageAdSkipping(request.action)).then(
    result => window.dispatchEvent(new CustomEvent(responseEvent, {
      detail: JSON.stringify({ requestId: request.requestId, result })
    })),
    () => window.dispatchEvent(new CustomEvent(responseEvent, {
      detail: JSON.stringify({ requestId: request.requestId, result: { enabled: false, message: "Automatický režim se nepodařilo spustit." } })
    }))
  );
});
