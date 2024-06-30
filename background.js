chrome.runtime.onInstalled.addListener(() => {
    console.log('Simple Alert Extension installed.');
  });
  
  // Listen for messages from the content script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'reloadTab') {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.reload(tabs[0].id);
      });
    }
  });
  