console.log("Background script loaded");

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "translateAllMessages") {
    const targetLang = message.targetLang;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: translateAllMessages,
        args: [targetLang],
      });
    });
    return true;
  }

  if (message.action === "translateSendMessage") {
    const targetLang = message.targetLang;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: translateSendMessage,
        args: [targetLang],
      });
    });
  }
});

// Function to be injected into WhatsApp Web page
function translateAllMessages(targetLang) {
  const messageElements = document.querySelectorAll("._ao3e.selectable-text.copyable-text");
  const buttonDiv = document.querySelectorAll(".x123j3cw.xs9asl8.x9f619.x78zum5.x6s0dn4.xl56j7k.x1ofbdpd.x100vrsf.x1fns5xo");

  buttonDiv.forEach((div) => {
    const existingButton = div.querySelector('img[alt="Translate"]');

    if (!existingButton) {
      const newButton = document.createElement("button");
      newButton.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Translate" name="Translate Message" width="24" height="24">`;
      newButton.style = "padding-left: 8px;";

      newButton.onclick = () => {
        chrome.storage.sync.get(["sendLanguage"], function (result) {
          const targetLang = result.sendLanguage || "en"; 
          chrome.runtime.sendMessage({
            action: "translateSendMessage",
            targetLang: targetLang,
          });
        });
      };

      div.appendChild(newButton);
    }
  });

  messageElements.forEach((messageElement) => {
    const originalText = messageElement.innerText;
    const url = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyB_XBtcp7IOZJ0tnOKCSYtFoMsRSgjj4Yg&q=${encodeURIComponent(originalText)}&target=${targetLang}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.translations.length > 0) {
          const translatedText = data.data.translations[0].translatedText;
          messageElement.innerText = translatedText;
        }
      })
      .catch((error) => console.error("Translation error:", error));
  });
}

function translateSendMessage(targetLang) {
  const messageTextForTranslation = document.querySelectorAll('div[aria-placeholder="Type a message"] p span');

  messageTextForTranslation.forEach((messageElement) => {
    const originalText = messageElement.innerText;
    messageElement.innerText = "";
    
    const url = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyB_XBtcp7IOZJ0tnOKCSYtFoMsRSgjj4Yg&q=${encodeURIComponent(originalText)}&target=${targetLang}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.data && data.data.translations.length > 0) {
          const translatedText = data.data.translations[0].translatedText;
          
          const range = document.createRange();
          range.selectNodeContents(messageElement);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);

          document.execCommand("delete");
          document.execCommand("insertText", false, translatedText);

          const inputEvent = new Event("input", { bubbles: true });
          messageElement.dispatchEvent(inputEvent);
        }
      })
      .catch((error) => console.error("Translation error:", error));
  });
}

function getSelectedSendLanguage() {
  chrome.storage.sync.get(["sendLanguage"], function (result) {
    return result.sendLanguage;
  });
}
