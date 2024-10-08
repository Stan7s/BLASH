import { printLine } from './modules/print';
import { highlightText, removeHighlights } from './modules/highlight'

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
  //Hy-highlighting
  if (message.action === "highlight") {
    // Check if the text to highlight is provided
    // if (message.text) {
    highlightText(message.text, message.color);
    sendResponse({ status: 'success' });
    return true;
  }
  if (message.action === 'removehighlight') {
    // alert("remove highlight");
    console.log("index.js: remove highlight");
    // Query all highlighted elements and remove them
    const highlightedSpans = document.querySelectorAll('.highlight');
    highlightedSpans.forEach(span => {
      const parent = span.parentNode;
      // Replace the span with its text content
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize(); // Normalize to merge text nodes
    });
    sendResponse({ status: 'All highlights removed' });
    return true;
  }
  // Lingbo: Paste Draft
  if (message.action === "pasteDraft") {
    console.log("Pasting Draft:", message.text);
    printLine("pasteDfrat listener");
    const commentButton = document.querySelector('button[data-testid="trigger-button"]');
    console.log("commentButton");
    if (commentButton) {
      console.log("Found comment button");
      commentButton.click();
      console.log("Clicked comment button");
    }
    else{
      console.log("No comment button found");
    }
    sendResponse({ status: commentButton });
    return true;
  }
});