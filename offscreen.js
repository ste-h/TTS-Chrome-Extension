chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "playAudio") {
    const { text } = message;

    fetch("http://localhost:5000/synthesize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const audioUrl = URL.createObjectURL(blob);
        const audioPlayer = new Audio();
        audioPlayer.src = audioUrl;
        audioPlayer.play();

        // Optionally, close the offscreen document when audio finishes
        audioPlayer.onended = () => {
          chrome.runtime.sendMessage({ action: "closeOffscreen" });
        };
      })
      .catch((error) => console.error("Error with API call:", error));
  }
});
