// Content script
const buttonDiv = document.querySelectorAll(
  ".x123j3cw.xs9asl8.x9f619.x78zum5.x6s0dn4.xl56j7k.x1ofbdpd.x100vrsf.x1fns5xo"
);

// Loop through each selected element
buttonDiv.forEach((div) => {
  const existingButton = div.querySelector('img[alt="Translate"]');

  if (!existingButton) {
    const newButton = document.createElement("button");

    newButton.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Google_Translate_logo.svg" alt="Translate" width="24" height="24">`;
    newButton.style = "padding-left: 8px;";

    // Set up an event handler for translating on button click
    newButton.onclick = () => {
    //   const targetLang = "es"; // Example: Translate to Spanish, you can modify this
      chrome.runtime.sendMessage({
        action: "translateSendMessage",
        targetLang: targetLang,
      });
    };

    div.appendChild(newButton);
  }
});
