document.getElementById('translateButton').addEventListener('click', () => {
    const selectedLanguage = document.getElementById('languageSelector').value;

    // Send the selected language to the background script
    chrome.runtime.sendMessage({ action: 'translateAllMessages', targetLang: selectedLanguage });
});