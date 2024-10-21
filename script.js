const time = document.querySelector("#clock");
setInterval(function() {
    let date = new Date();
    time.innerHTML = date.toLocaleString();
}, 1000);

////////////////////////////////////////////////////////////////////////////

// Load YouTube Iframe API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var videoId;  // Updated video ID will be stored here

// Hide the player initially
document.getElementById('player').style.display = 'none';

// This function creates the YouTube player iframe when API is ready
function onYouTubeIframeAPIReady() {
  if (videoId) {
    createPlayer();
  }
}

// Create player function
function createPlayer() {
  player = new YT.Player('player', {
    height: '500',
    width: '1000',
    videoId: videoId,
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
  document.getElementById('player').style.display = 'block';  // Show the player once it's created
}

// Function called when the video player is ready
function onPlayerReady(event) {
  event.target.playVideo();
}

// Function to handle player state changes
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    done = true;
    setInterval(getVideoDetails, 1000);
  }
}

// Function to stop the video
function stopVideo() {
  player.stopVideo();
}

// Function to get video details and display them
function getVideoDetails() {
    if (player) {
      var duration = player.getDuration();
      var currentTime = player.getCurrentTime();
      var playbackRate = player.getPlaybackRate();
  
      // Convert duration to hours, minutes, and seconds
      var durationHours = Math.floor(duration / 3600);
      var durationMinutes = Math.floor((duration % 3600) / 60);
      var durationSeconds = Math.floor(duration % 60);
  
      // Convert current time to hours, minutes, and seconds
      var currentTimeHours = Math.floor(currentTime / 3600);
      var currentTimeMinutes = Math.floor((currentTime % 3600) / 60);
      var currentTimeSeconds = Math.floor(currentTime % 60);
  
      // Display the details in hours, minutes, and seconds
      document.getElementById('vd').innerText = 
         durationHours + " Hour " + durationMinutes + " Min " + durationSeconds + " Sec";
  
      document.getElementById('ct').innerText = 
        currentTimeHours + " Hour " + currentTimeMinutes + " Min " + currentTimeSeconds + " Sec";
  
      document.getElementById('ps').innerText = 
        playbackRate + "x";
  
      // Calculate remaining time (adjusted for playback rate)
      var remainingTime = (duration - currentTime) / playbackRate; // remaining duration in seconds adjusted for playback rate
  
      // Get current system time
      var currentTimeSystem = new Date();
      
      // Add the adjusted remaining video time (in seconds) to the current system time
      var videoEndTime = new Date(currentTimeSystem.getTime() + remainingTime * 1000);
  
      // Format video end time to 12-hour format
      var endHours = videoEndTime.getHours();
      var endMinutes = videoEndTime.getMinutes();
      var endSeconds = videoEndTime.getSeconds();
      var ampm = endHours >= 12 ? 'PM' : 'AM';
  
      // Convert to 12-hour format
      endHours = endHours % 12;
      endHours = endHours ? endHours : 12; // the hour '0' should be '12'
  
      // Ensure two digits for minutes and seconds
      endMinutes = endMinutes < 10 ? '0' + endMinutes : endMinutes;
      endSeconds = endSeconds < 10 ? '0' + endSeconds : endSeconds;
  
      // Display the time the video will end in 12-hour format with AM/PM
      document.querySelector('.video-ends-at').innerHTML = 
        `<u>Your Video Ends At<u><br>${endHours}:${endMinutes}:${endSeconds} ${ampm}`;
    }
  }
  

// Play button functionality
const play = document.querySelector("#play");
play.addEventListener('click', () => {
  var url = document.getElementById('videoUrl').value;

  // Convert URL to video ID
  var embedUrl = convertToEmbedUrl(url);

  if (embedUrl) {
    videoId = embedUrl;

    if (player) {
      // Load a new video if the player already exists
      player.loadVideoById(videoId);
    } else {
      // Create a new player if it doesn't exist
      createPlayer();
    }
  } else {
    alert('Please enter a valid YouTube video link.');
  }
});

// Function to convert YouTube URL to video ID
function convertToEmbedUrl(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  } else {
    return null;
  }
}
