async function ensureOffscreenDocument() {
  const offscreenUrl = "offscreen.html";

  const matchedClients = await clients.matchAll();
  for (const client of matchedClients) {
    if (client.url.includes(offscreenUrl)) {
      return;
    }
  }

  await chrome.offscreen.createDocument({
    url: offscreenUrl,
    reasons: ["AUDIO_PLAYBACK"],
    justification: "Play audio without a visible window",
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "playAudio") {
    ensureOffscreenDocument().then(() => {
      chrome.runtime.sendMessage(message);
    });
  } else if (message.action === "closeOffscreen") {
    chrome.offscreen.closeDocument();
  }
});
