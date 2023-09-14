document.addEventListener('DOMContentLoaded', function() {
  var downloadButton = document.getElementById('downloadButton');
  downloadButton.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var youtubeUrl = tabs[0].url;
      var downloaderUrl = 'https://ytdl-node-test2.ollywallyy.repl.co/download?url=' + encodeURIComponent(youtubeUrl);
      chrome.tabs.create({ url: downloaderUrl });
    });
  });
});
