var timestampEl = document.getElementById('timestamp')
var buttonEl = document.getElementById('begin')
var audioAEl = document.getElementById('audio-a')
var audioBEl = document.getElementById('audio-b')
var numLoadedAudioFiles = 0

var initialCoords

audioAEl.addEventListener('loadedmetadata', audioFileLoaded)
audioBEl.addEventListener('loadedmetadata', audioFileLoaded)

function audioFileLoaded() {
  numLoadedAudioFiles++
  if (numLoadedAudioFiles === 2) {
    document.body.classList.add('ready')
  }
}

function init() {
  if (!("geolocation" in navigator)) {
    alert("Your browser doesn't support GPS :(")
    return
  }

  buttonEl.classList.add('hide')

  audioAEl.volume = 0.0
  audioBEl.volume = 0.1
  audioAEl.play()
  audioBEl.play()

  navigator.geolocation.watchPosition(
    update,
    reportError,
    {
      enableHighAccuracy: true
    }
  )
}

function update(position) {
  var coords = position.coords
  var distance = 0

  if (!initialCoords) {
    // set initialCoords
    initialCoords = coords
  } else {
    // update audio based on distance

    var delta = {
      latitude: initialCoords.latitude - coords.latitude,
      longitude: initialCoords.longitude - coords.longitude
    }
    var latLongDistance = Math.sqrt(delta.latitude * delta.latitude + delta.longitude * delta.longitude)
    distance = Math.min(1.0, latLongDistance / 0.0004)
  }

  audioAEl.volume = 1.0 - normalizedDistance
  audioBEl.volume = normalizedDistance

  timestampEl.innerHTML = 'Last updated at ' + moment(position.timestamp).format('LTS')
}

function reportError(error) {
  alert('Error #' + error.code + ' getting GPS: ' + error.message + ' :(')
}
