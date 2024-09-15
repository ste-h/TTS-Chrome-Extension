document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.action === "articleExtracted") {
      const contentDiv = document.getElementById("content");
      if (request.content && request.content.textContent) {
        contentDiv.innerText = request.content.textContent;
      } else {
        contentDiv.innerText = "Unable to extract article content.";
      }
    }
  });

  // Trigger content script from popup
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractArticle" });
  });

  // Play button interaction to call the local API server
  const playButton = document.querySelector("img");
  playButton.addEventListener("click", function () {
    const contentText = document.getElementById("content").innerText;

    if (contentText) {
      fetch("http://localhost:5000/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: contentText }),
      })
        .then((response) => response.blob())
        .then((blob) => {
          const audioUrl = URL.createObjectURL(blob);
          audioPlayer.src = audioUrl;
          audioPlayer.play();    
        })
        .catch((error) => console.error("Error with API call:", error));
    }
  });
});
