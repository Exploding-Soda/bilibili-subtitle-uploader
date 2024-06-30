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