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

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "extractArticle" });
  });

  const playButton = document.querySelector("img");
  playButton.addEventListener("click", function () {
    const contentText = document.getElementById("content").innerText;

    if (contentText) {
      chrome.runtime.sendMessage({ action: "playAudio", text: contentText });
    }
  });
});
