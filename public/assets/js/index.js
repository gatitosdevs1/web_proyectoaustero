$(document).ready(function () {
  fetchTopTracks();
});

function fetchTopTracks() {
  $.ajax({
    url: "../../get_tracks.php", // Path to your PHP script
    method: "GET",
    dataType: "json", // Expect JSON response, so jQuery automatically parses it
    success: function (response) {
      if (response.tracks) {
        displayTopTracks(response.tracks);
      } else {
        console.error("No tracks found in the response");
      }
    },
    error: function (err) {
      console.log("AJAX request failed:", err);
    },
  });
}

function displayTopTracks(tracks) {
  tracks.forEach((track, index) => {
    if (index < 8) {
      // Limiting to 8 tracks
      const trackName = track.name;
      const albumImage = track.album.images[0].url; // Use the first image
      const previewUrl = track.preview_url;
      const spotifyUrl = track.external_urls.spotify;
      const youtubeUrl = "https://www.youtube.com/@proyectoaustero"; // Band's YouTube link

      const card = `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="player" style="position: relative;">
          <!-- Album Image -->
          <img src="${albumImage}" alt="${trackName}" class="album-image" />
          <!-- Song Information -->
          <div class="info">
            <h1>${trackName}</h1>
          </div>
          <!-- Track Time Progress Bar -->
          <div class="track-time">
            <div class="track">
              <div class="progress-fill" id="progress-bar-${index}"></div>
            </div>
          </div>
          <!-- Action buttons (Spotify, Play, YouTube) -->
          <div class="action-buttons">
            <a href="${spotifyUrl}" target="_blank" class="spotify-button">
              <i class="fab fa-spotify"></i>
            </a>
            <div class="play-button" id="play-pause-button-${index}" onclick="playPreview('${previewUrl}', ${index})">
              <i class="fa-solid fa-play"></i>
            </div>
            <a href="${youtubeUrl}" target="_blank" class="youtube-button">
              <i class="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    `;

      $("#track-cards-container").append(card);
    }
  });
}

let currentAudio = null;
let progressInterval = null;
let isPlaying = false;
let currentTrackIndex = null;

function playPreview(previewUrl, index) {
  const playButton = document.getElementById(`play-pause-button-${index}`);
  const progressBar = document.getElementById(`progress-bar-${index}`);

  // If this track is already playing, pause it
  if (currentTrackIndex === index && currentAudio && isPlaying) {
    currentAudio.pause(); // Pause the track
    isPlaying = false;
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>'; // Change to play icon
    clearInterval(progressInterval); // Stop progress bar update
    return;
  }

  // If this track is paused, resume it
  if (currentTrackIndex === index && currentAudio && !isPlaying) {
    currentAudio.play(); // Resume the track
    isPlaying = true;
    playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Change to pause icon
    startProgressBar(progressBar); // Resume progress bar
    return;
  }

  // If switching to a new track, reset the previous one
  if (currentAudio) {
    currentAudio.pause(); // Pause the current audio
    clearInterval(progressInterval); // Clear the previous progress interval
    const previousButton = document.getElementById(
      `play-pause-button-${currentTrackIndex}`
    );
    const previousProgressBar = document.getElementById(
      `progress-bar-${currentTrackIndex}`
    );
    if (previousButton)
      previousButton.innerHTML = '<i class="fa-solid fa-play"></i>'; // Reset previous button icon
    if (previousProgressBar) previousProgressBar.style.width = "0%"; // Reset previous progress bar
  }

  // Start playing a new track
  currentAudio = new Audio(previewUrl);
  currentAudio.play();
  isPlaying = true;
  currentTrackIndex = index; // Update current track index

  playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'; // Change to pause icon

  startProgressBar(progressBar); // Start the progress bar

  // Automatically stop the audio after 20 seconds
  const duration = 20; // Define the duration as 20 seconds
  currentAudio.currentTime = 0; // Ensure it starts from the beginning
  const stopPlayback = setTimeout(() => {
    if (currentAudio) {
      currentAudio.pause(); // Stop the audio after 20 seconds
      currentAudio.currentTime = 0; // Reset the track to the beginning
      clearInterval(progressInterval); // Stop the progress bar updates
      progressBar.style.width = "0%"; // Reset progress bar after song ends
      playButton.innerHTML = '<i class="fa-solid fa-play"></i>'; // Reset to play icon
      isPlaying = false; // Set playing status to false
    }
  }, duration * 1000); // Stop the audio after 20 seconds (20 * 1000ms)

  currentAudio.addEventListener("ended", () => {
    clearTimeout(stopPlayback); // Clear timeout in case the song ends earlier
    clearInterval(progressInterval); // Stop progress bar updates
    progressBar.style.width = "0%"; // Reset progress bar
    playButton.innerHTML = '<i class="fa-solid fa-play"></i>'; // Reset play icon
    isPlaying = false;
  });
}

// Function to handle progress bar updates
function startProgressBar(progressBar) {
  const duration = 20; // Preview duration is 20 seconds
  const step = 100 / (duration * 10); // Calculate the percentage step per 100ms
  let progress = (currentAudio.currentTime / duration) * 100; // Calculate initial progress

  progressInterval = setInterval(() => {
    if (isPlaying) {
      progress = (currentAudio.currentTime / duration) * 100;
      if (progress <= 100) {
        progressBar.style.width = `${progress}%`;
      } else {
        clearInterval(progressInterval); // Stop when 100% is reached
      }
    }
  }, 100); // Update progress every 100ms
}

// Contact-form

//Para mostrar el mensaje en el modal
function formResponse(head, body, loader) {
  const messageHead = document.querySelector("#form-response h6");
  const messageBody = document.querySelector("#form-response p");
  const resMessage = document.getElementById("form-response");
  loader.classList.add("d-none");
  resMessage.classList.remove("d-none");
  messageHead.innerHTML = head;
  messageBody.innerHTML = body;
}
//salir del modal
const resButton = document.querySelector("#form-response button");
resButton.addEventListener("click", () => {
  const resView = document.getElementById("form-loader");
  resView.classList.add("d-none");
});

//Enviar el mensaje
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const resView = document.getElementById("form-loader");
  const loader = document.getElementById("img-form-loader");
  resView.classList.remove("d-none");
  loader.classList.remove("d-none");

  const formData = new FormData(contactForm);
  //cambiar ruta para deploy
  fetch("../../send_mail.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        formResponse("Hubo un error", "Por favor inténtelo más tarde", loader);
        console.log("ma");
        console.log(response);
        // alert("Hubo un error!");
      } else {
        return response.json();
      }
    })
    .then((data) => {
      if (data.message) {
        formResponse(
          data.message,
          "Nos contactaremos contigo lo antes posible.",
          loader
        );
        contactForm.reset();

        // alert(data.message);
      }
    })
    .catch((error) => {
      formResponse("Hubo un error", "Por favor inténtelo más tarde", loader);
      console.error("Error:", error);
    });
});
// Contact-form end

// Back top
const biography = document.getElementById("biografia");
const arrow = document.getElementById("back-top");
window.addEventListener("scroll", function () {
  if (biography.offsetTop <= this.scrollY) {
    arrow.classList.remove("fade");
    arrow.classList.add("show");
  } else {
    arrow.classList.remove("show");
    arrow.classList.add("fade");
  }
});

arrow.addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//ModalDev
const btnDev = document.getElementById("btn-dev");
const modalDev = document.getElementById("modal-gatitos");
const btnClose = document.getElementById("closeM");
btnDev.addEventListener("click", function () {
  // modalDev.classList.remove("d-none");

  // modalDev.classList.remove("fade");
  modalDev.style.zIndex = "100";
  modalDev.classList.add("show");
});
btnClose.addEventListener("click", function () {
  // modalDev.classList.remove("d-none");

  // modalDev.classList.remove("fade");
  modalDev.classList.remove("show");
  modalDev.style.zIndex = "-1";
});
