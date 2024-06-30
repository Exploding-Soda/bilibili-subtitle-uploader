chrome.storage.local.get('subtitleContent', ({ subtitleContent }) => {
  if (subtitleContent) {
    const videoPlayer = document.querySelector('video');
    if (videoPlayer) {
      const track = document.createElement('track');
      track.kind = 'subtitles';
      track.label = 'Custom Subtitles';
      track.srclang = 'en';
      track.src = URL.createObjectURL(new Blob([subtitleContent], { type: 'text/vtt' }));
      track.default = true;

      videoPlayer.appendChild(track);

      // Force reload to ensure the subtitle track is recognized
      const currentTime = videoPlayer.currentTime;
      videoPlayer.currentTime = 0;
      videoPlayer.currentTime = currentTime;

      videoPlayer.addEventListener('loadedmetadata', () => {
        const tracks = videoPlayer.textTracks;
        console.log('Subtitle tracks in video player:', tracks);
      });
    } else {
      console.error('Video player not found');
    }
  } else {
    console.error('Subtitle content not found');
  }
});

// Function to monitor URL changes
function monitorURLChange() {
  let currentURL = window.location.href;
  setInterval(() => {
    if (currentURL !== window.location.href) {
      currentURL = window.location.href;
      chrome.storage.local.remove('subtitleContent', () => {
        // Refresh the current tab
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
      });
    }
  }, 2000); // Check every second
}

// Start monitoring URL changes
monitorURLChange();
