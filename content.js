// content.js

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "extractArticle") {
    try {
      // Copy the doc and extract it with readability
      const docClone = document.cloneNode(true);

      const reader = new Readability(docClone);
      const article = reader.parse();

      if (article && article.textContent) {
        chrome.runtime.sendMessage({
          action: "articleExtracted",
          content: article,
        });
        sendResponse({ status: "Article extracted" });
      } else {
        sendResponse({ status: "Extraction failed: No content found." });
      }
    } catch (error) {
      console.error("Error during article extraction:", error);
      sendResponse({ status: "Extraction failed: An error occurred." });
    }
  }
});
