// Handle the button click in the popup
document.getElementById("downloadBtn").addEventListener("click", function() {
  // Send a message to the active tab to get the video URL
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "get_video_url" });
  });
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "send_video_url") {
    // Open the download website in a new tab with the video URL
    chrome.tabs.create({ url: "https://ytdl-node-test2.ollywallyy.repl.co/?url=" + encodeURIComponent(request.url) });
  }
});
