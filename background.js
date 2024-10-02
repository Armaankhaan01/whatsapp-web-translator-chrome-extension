console.log("Background script loaded");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "translateAllMessages") {
    const targetLang = message.targetLang;

    // Execute a script on the current WhatsApp Web tab to translate messages
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: translateAllMessages,
        args: [targetLang],
      });
    });
  }
});

// Function to be injected into WhatsApp Web page
function translateAllMessages(targetLang) {
  const messageElements = document.querySelectorAll(
    ".selectable-text.copyable-text"
  );

  messageElements.forEach((messageElement) => {
    const originalText = messageElement.innerText;

    // Call the Google Translate API
    const url = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyB_XBtcp7IOZJ0tnOKCSYtFoMsRSgjj4Yg&q=${encodeURIComponent(
      originalText
    )}&target=${targetLang}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.translations.length > 0) {
          const translatedText = data.data.translations[0].translatedText;

          // Replace the original text with the translated text
          messageElement.innerText = translatedText;
        }
      })
      .catch((error) => console.error("Translation error:", error));
  });
}

let selectedLanguage;

chrome.storage.sync.get(["language"], function (result) {
  if (result.language) {
    selectedLanguage = result.language;
    console.log("Current stored language is " + result.language);
  }
});

chrome.runtime.sendMessage({
  action: "translateAllMessages",
  targetLang: selectedLanguage,
});
