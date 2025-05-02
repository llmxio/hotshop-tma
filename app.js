import { soundManager } from "soundmanager2";
let request = require("superagent");
let noUiSlider = require("nouislider");
let _ = require("lodash");

let play = document.getElementById("radioheart-player-play");
let pause = document.getElementById("radioheart-player-pause");
let mute = document.getElementById("radioheart-player-mute");
let player = document.getElementById("radioheart-player");
let logo_place = document.getElementById("radioheart-player-logo");
let currentSongDiv = document.getElementById("radioheart-player-current-song");

let stream = player.getAttribute("data-stream");
let autostart = player.getAttribute("data-autostart") === "true";
let volume = parseFloat(player.getAttribute("data-volume"));
let logo = player.getAttribute("data-logo");
let getMetadataInterval = null;
let startText = player.getAttribute("data-playtext");
let globalMount = player.getAttribute("data-global-mount");
if (!startText) {
  startText = "Нажмите play для начала воспроизведения";
}
let sound = null;
let currentTitle = null;
let isMobile = window.matchMedia("only screen and (max-width: 760px)");
let listener = function () {
  playHandler();
};
if (isMobile.matches) {
  volume = 1;
}
setLogo(logo);
play.addEventListener("click", playHandler);
pause.addEventListener("click", pauseHandler);
if (mute) {
  mute.addEventListener("click", muteHandler);
}
if (currentSongDiv) {
  currentSongDiv.setAttribute("data-marquee", startText);
}
if (autostart) {
  window.addEventListener("click", listener);
}

function playHandler() {
  window.removeEventListener("click", listener);
  soundManager.onready(function () {
    sound = soundManager.createSound({
      url: stream,
      volume: volume * 100,
      onplay: playFromPlayer,
    });
    sound.play({
      onstop: stopFromPlayer,
    });
  });
}

function pauseHandler() {
  sound.stop();
  sound.unload();
}

function muteHandler() {
  sound.toggleMute();
  muteFromPlayer();
}

function playFromPlayer() {
  play.classList.add("hidden");
  pause.classList.remove("hidden");
  if (currentSongDiv) {
    getCurrentSong();
    getMetadataInterval = setInterval(getCurrentSong, 5000);
  }
}

function stopFromPlayer() {
  pause.classList.add("hidden");
  play.classList.remove("hidden");
  currentTitle = null;
  if (getMetadataInterval) {
    clearInterval(getMetadataInterval);
    if (currentSongDiv) {
      currentSongDiv.setAttribute("data-marquee", startText);
    }
  }
}

function muteFromPlayer() {
  mute.classList.toggle("active");
}

let rangeSlider = document.getElementById("radioheart-player-volume");

noUiSlider.create(rangeSlider, {
  start: [volume],
  connect: [true, false],
  range: {
    min: [0.0],
    max: [1.0],
  },
});
rangeSlider.noUiSlider.on("update", function (values) {
  volume = values[0];
  if (sound) {
    sound.setVolume(volume * 100);
  }
});

function getCurrentSong() {
  let streamPath = getLocation(stream);
  let jsonPath;
  if (streamPath.host === "listen.myrh.ru") {
    jsonPath = stream + "/json.xsl";
  } else {
    jsonPath = streamPath.protocol + "//" + streamPath.host + "/json.xsl";
  }
  let radioMounts = ["/studio", "/relay", "/nonstop"];
  request.get(jsonPath).end(function (err, res) {
    if (res.ok) {
      let response = JSON.parse(res.text);
      let mounts = response.mounts;
      let directMount = _.find(mounts, function (item) {
        return !radioMounts.includes(item.mount);
      });
      if (directMount) {
        radioMounts.unshift(directMount.mount);
      }
      if (globalMount) {
        radioMounts.unshift(globalMount);
      }
      for (let i = 0; i < radioMounts.length; i++) {
        let radioMount = radioMounts[i];
        let icecastMount = _.find(mounts, function (item) {
          return item.mount === radioMount && item.title.length > 0;
        });
        if (icecastMount) {
          if (currentTitle !== icecastMount.title) {
            currentTitle = icecastMount.title;
            currentSongDiv.setAttribute("data-marquee", icecastMount.title);
            if (logo) {
              getArtistImage(icecastMount.title);
            }
            if (rhTrackChange) {
              rhTrackChange();
            }
          }
          break;
        }
      }
    }
  });
}

function getLocation(href) {
  let match = href.match(
    /^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/
  );
  return (
    match && {
      protocol: match[1],
      host: match[2],
      hostname: match[3],
      port: match[4],
      pathname: match[5],
      search: match[6],
      hash: match[7],
    }
  );
}

function setLogo(logoUrl) {
  if (logoUrl && logo_place) {
    logo_place.style.backgroundImage = "url('" + logoUrl + "')";
  }
}

function getArtistImage(songTitle) {
  request
    .get("https://image-fetcher.radioheart.ru/api/get-image")
    .query({
      artist: getArtistFromTitle(songTitle),
      title: getSongFromTitle(songTitle),
    })
    .end(function (err, res) {
      if (err) {
        console.error(err);
        setLogo(logo);
        return false;
      }
      if (res.body.image) {
        setLogo(res.body.image);
      } else {
        setLogo(logo);
      }
    });
}

function getArtistFromTitle(songTitle) {
  let split = songTitle.split(" - ");
  if (split.length > 1) {
    return split[0].trim();
  }
  split = songTitle.split("–");
  if (split.length > 1) {
    return split[0].trim();
  }
  return songTitle;
}

function getSongFromTitle(songTitle) {
  let split = songTitle.split(" - ");
  if (split.length > 1) {
    return split[1].trim();
  }
  split = songTitle.split("–");
  if (split.length > 1) {
    return split[1].trim();
  }
  return songTitle;
}

// WEBPACK FOOTER //
// assets/js/app.js
