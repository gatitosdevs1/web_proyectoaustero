// Fetch and display top tracks on page load
$.ajax({
  url: "../get_tracks.php",
  method: "GET",
  dataType: "json",
  success: (response) => {
    console.log("AJAX Success Response:", response);
    response.tracks ? displayTopTracks(response.tracks) : console.error("No tracks found in the response");
  },
  error: (err) => console.log("AJAX request failed:", err),
});

function displayTopTracks(tracks) {
  tracks.slice(0, 8).forEach((track, index) => {
    const { name, album, preview_url, external_urls } = track;
    const card = `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="player" style="position: relative;">
          <img src="${album.images[0].url}" alt="${name}" class="album-image" />
          <div class="info"><h1>${name}</h1></div>
          <div class="track-time"><div class="track"><div class="progress-fill" id="progress-bar-${index}"></div></div></div>
          <div class="action-buttons">
            <a href="${external_urls.spotify}" target="_blank" class="spotify-button"><i class="fab fa-spotify"></i></a>
            <div class="play-button" id="play-pause-button-${index}" onclick="playPreview('${preview_url}', ${index})"><i class="fa-solid fa-play"></i></div>
            <a href="https://www.youtube.com/@proyectoaustero" target="_blank" class="youtube-button"><i class="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>`;
    $("#track-cards-container").append(card);
  });
}

// Track playback controls
let currentAudio = null, progressInterval = null, isPlaying = false, currentTrackIndex = null;

function playPreview(previewUrl, index) {
  const playButton = $(`#play-pause-button-${index}`);
  const progressBar = $(`#progress-bar-${index}`);

  if (currentTrackIndex === index && currentAudio) {
    isPlaying ? pauseAudio(playButton) : resumeAudio(playButton, progressBar);
  } else {
    if (currentAudio) resetPreviousAudio();
    startNewAudio(previewUrl, index, playButton, progressBar);
  }
}

function pauseAudio(playButton) {
  currentAudio.pause();
  isPlaying = false;
  playButton.html('<i class="fa-solid fa-play"></i>');
  clearInterval(progressInterval);
}

function resumeAudio(playButton, progressBar) {
  currentAudio.play();
  isPlaying = true;
  playButton.html('<i class="fa-solid fa-pause"></i>');
  startProgressBar(progressBar);
}

function resetPreviousAudio() {
  currentAudio.pause();
  clearInterval(progressInterval);
  $(`#play-pause-button-${currentTrackIndex}`).html('<i class="fa-solid fa-play"></i>');
  $(`#progress-bar-${currentTrackIndex}`).css("width", "0%");
}

function startNewAudio(previewUrl, index, playButton, progressBar) {
  currentAudio = new Audio(previewUrl);
  currentAudio.play();
  isPlaying = true;
  currentTrackIndex = index;
  playButton.html('<i class="fa-solid fa-pause"></i>');
  startProgressBar(progressBar);
  currentAudio.addEventListener("ended", resetTrack);
}

function resetTrack() {
  clearInterval(progressInterval);
  isPlaying = false;
  currentAudio = null;
  $(`#progress-bar-${currentTrackIndex}`).css("width", "0%");
  $(`#play-pause-button-${currentTrackIndex}`).html('<i class="fa-solid fa-play"></i>');
}

function startProgressBar(progressBar) {
  const duration = 20;
  progressInterval = setInterval(() => {
    const progress = (currentAudio.currentTime / duration) * 100;
    if (progress <= 100) progressBar.css("width", `${progress}%`);
    else clearInterval(progressInterval);
  }, 100);
}

// Back to Top Button
const biography = $("#discografia"), arrow = $("#back-top");
$(window).on("scroll", () => {
  biography.offset().top - 100 <= $(window).scrollTop()
    ? arrow.removeClass("fade").addClass("show")
    : arrow.removeClass("show").addClass("fade");
});

arrow.on("click", () => $("html, body").animate({ scrollTop: 0 }, "smooth"));

// Modal Toggle
const modalDev = $("#modal-gatitos");
$("#btn-dev").on("click", () => modalDev.css("zIndex", "100").addClass("show"));
$("#closeM").on("click", () => modalDev.removeClass("show").css("zIndex", "-1"));

// Scroll animations for specific elements
function handleScrollAnimations() {
  const elementsToAnimate = [
    { selector: ".player", offset: 300 },
    { selector: ".section-discografia", offset: 300 },
    { selector: "#biografia .titulo", offset: 300 },
    { selector: "#biografia #imagen-bio", offset: 300 },
    { selector: "#biografia #texto-bio", offset: 300 }
  ];

  $(window).on("scroll", () => {
    elementsToAnimate.forEach(({ selector, offset }) => {
      $(selector).each(function () {
        if (isElementInViewport(this, offset)) $(this).addClass("show");
      });
    });
  }).trigger("scroll");
}

function isElementInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  return rect.top >= -offset && rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}

// Initialize scroll animations on document ready
$(document).ready(() => {
  if ($(window).width() > 768) handleScrollAnimations();
});
