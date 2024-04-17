// In your content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Message received", message);
    if (message.action === "highlight") {
        // Assuming you have a function to handle the highlighting
        highlightText(message.text);
        sendResponse({ status: 'success', message: 'Text highlighted successfully!' });
    }
    return true; // Return true to indicate that you will respond asynchronously (optional)
});
