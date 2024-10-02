document.getElementById("translateButton").addEventListener("click", () => {
  const selectedLanguage = document.getElementById("languageSelector").value;
  // Save the language to chrome.storage
  chrome.storage.sync.set({ language: selectedLanguage }, function () {
    console.log("Language is set to " + selectedLanguage);
  });
  // Send the selected language to the background script
  chrome.runtime.sendMessage({
    action: "translateAllMessages",
    targetLang:selectedLanguage
  });
});

document
  .getElementById("sendLanguageSelector")
  .addEventListener("change", () => {
    const sendLanguage = document.getElementById("sendLanguageSelector").value;
    chrome.storage.sync.set({ sendLanguage: sendLanguage }, function () {
      console.log("Language is set to " + sendLanguage);
    });
  });

chrome.storage.sync.get(["language", "sendLanguage"], function (result) {
  console.log(result);
  if (result.language) {
    document.getElementById("languageSelector").value = result.language;
    document.getElementById("sendLanguageSelector").value = result.sendLanguage;
    console.log("Current stored language is " + result.language);
    console.log("Current stored send language is " + result.sendLanguage);
  }
});
