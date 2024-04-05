import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "togglePopup") {
      if (document.getElementById("my-extension-popup")) {
        document.body.removeChild(document.getElementById("my-extension-popup"));
      } else {
        const popup = document.createElement("div");
        popup.id = "my-extension-popup";
        popup.style.position = "fixed";
        popup.style.bottom = "20px";
        popup.style.right = "20px";
        popup.style.width = "300px";
        popup.style.height = "200px";
        popup.style.backgroundColor = "white";
        popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
        popup.style.zIndex = "1000";
        popup.innerHTML = "<h1>Hello, World!</h1>"; // You can render your React component here
        document.body.appendChild(popup);
      }
    }
  });