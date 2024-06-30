function srtToVtt(srt) {
  let vtt = "WEBVTT\n\n";
  vtt += srt
    .replace(/\r+/g, '')
    .split('\n')
    .map(line => {
      const match = line.match(/^(\d+:\d+:\d+),(\d+)\s-->\s(\d+:\d+:\d+),(\d+)$/);
      if (match) {
        return `${match[1]}.${match[2]} --> ${match[3]}.${match[4]}`;
      }
      return line;
    })
    .join('\n');
  return vtt;
}

document.getElementById('uploadButton').addEventListener('click', () => {
  const fileInput = document.getElementById('subtitleFile');
  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      let subtitleContent = reader.result;
      if (file.name.endsWith('.srt')) {
        subtitleContent = srtToVtt(subtitleContent);
      }
      chrome.storage.local.set({ subtitleContent }, () => {
        // Refresh the current tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
      });
    };
    reader.readAsText(file);
  } else {
    alert('请选择一个字幕文件');
  }
});

document.getElementById('closeSubtitleButton').addEventListener('click', () => {
  chrome.storage.local.remove('subtitleContent', () => {
    alert('Subtitle closed');
    // Refresh the current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.reload(tabs[0].id);
    });
  });
});

// Set initial state on load
chrome.storage.local.set({ subtitleVisible: false });
