console.log('This is the background page.');
console.log('Put the background scripts here.');

chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: togglePopup,
    });
  });
  
  function togglePopup() {
    chrome.runtime.sendMessage({ action: "togglePopup" });
  }