// Listen for the button click on the browser action
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the content script in the active tab
  chrome.tabs.sendMessage(tab.id, { action: "download_video" });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "video_url") {
    // Open the download website in a new tab with the video URL
    chrome.tabs.create({ url: "https://example.com/?url=" + encodeURIComponent(request.url) });
  }
});
