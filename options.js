// Store the selected language in chrome.storage
document.getElementById("languageSelect").addEventListener("change", () => {
  const selectedLanguage = document.getElementById("languageSelect").value;

  // Save the language to chrome.storage
  chrome.storage.sync.set({ language: selectedLanguage }, function () {
    console.log("Language is set to " + selectedLanguage);
  });
});

// On page load, retrieve and set the current language selection
chrome.storage.sync.get(["language"], function (result) {
  if (result.language) {
    document.getElementById("languageSelect").value = result.language;
    console.log("Current stored language is " + result.language);
  }
});
