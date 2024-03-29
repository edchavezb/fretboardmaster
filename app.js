const naturals = ["A", "B", "C", "D", "E", "F", "G"]
const sharps = ["A\u266F", "C\u266F", "D\u266F", "F\u266F", "G\u266F"]
const natsAndflats = ["A\u266D", "A", "B\u266D", "B", "C", "D\u266D", "D", "E\u266D", "E", "F", "G\u266D", "G"]
const guitarStrings = ['E', 'A', 'D', 'G', 'B', 'E']

const firstClick = new Audio('sounds/start.mp3')
const beatClick = new Audio('sounds/ticker.mp3')

const stringDiv = document.getElementById("string-number")
const noteDiv = document.getElementById("note-name")
const startBtn = document.getElementById("start")
const sharpCheck = document.getElementById("check-sharps")
const flatCheck = document.getElementById("check-flats")
const first = document.getElementById("first-beat")
const second = document.getElementById("second-beat")
const third = document.getElementById("third-beat")
const fourth = document.getElementById("fourth-beat")
const toggleSettings = document.getElementById("toggle-button")
const settingsPanel = document.getElementById("settings-form")
const extBrowserBtn = document.getElementById("external-button")

let bpm = null
let fretOffset = null
let selectedStrings = []

let string = null
let note = null
let noteSound = null

let metronome = null
let beatCount = 1
let countOn = false
let wakeLock = null;

function myRandom(max, min) {
  return Math.floor(Math.random() * (max - min) + min)
}

function stringNote(noteArray) {
  string = selectedStrings[myRandom(selectedStrings.length, 0)]
  note = noteArray[myRandom(noteArray.length, 0)]
  stringDiv.innerText = string
  noteDiv.innerText = note
}

function soundSelector(string, note) {
  const allTones = note.includes('\u266D') ? natsAndflats : naturals.concat(sharps).sort()
  const actualString = 7 - string
  let openString = guitarStrings[actualString - 1]
  let notesBefore = actualString == 6 || actualString == 5 ? (actualString - 1) * 5 - 1 : (actualString - 1) * 5
  let startingPoint = allTones.indexOf(openString) + fretOffset
  let fretDistance = allTones.indexOf(note) >= startingPoint ?
    allTones.indexOf(note) - startingPoint
    : 12 - (startingPoint - allTones.indexOf(note))
  return notesBefore + fretOffset + fretDistance + 1
}

function metronomeBeat(beat) {
  let noteSet = flatCheck.checked ? natsAndflats : naturals;
  noteSet = sharpCheck.checked ? noteSet.concat(sharps) : noteSet;
  document.querySelectorAll(".beat").forEach(oneBeat => oneBeat.classList.remove("beat-elapsed"));
  switch (beat) {
    case 1:
      if (!noteSound) firstClick.play()
      else noteSound.play()
      stringNote(noteSet)
      noteSound = new Audio(`sounds/guitar-sounds/${soundSelector(string, note)}.mp3`)
      first.classList.add("first-elapsed")
      beatCount++
      break;
    case 2:
      first.classList.remove("first-elapsed")
      second.classList.add("beat-elapsed")
      beatClick.play()
      beatCount++
      break;
    case 3:
      third.classList.add("beat-elapsed")
      beatClick.play()
      beatCount++
      break;
    case 4:
      fourth.classList.add("beat-elapsed")
      beatClick.play()
      beatCount = 1
      break;
  }
}

// Function that attempts to request a screen wake lock.
const requestWakeLock = async () => {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    /*     wakeLock.addEventListener('release', () => {
          console.log('Screen Wake Lock released:', wakeLock.released);
        });
        console.log('Screen Wake Lock released:', wakeLock.released); */
  } catch (err) {
    console.error(`${err.name}: ${err.message}`);
  }
};

function copyToClipboard(text) {
  var input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
}

startBtn.addEventListener('click', async () => {
  if (!countOn) {
    selectedStrings = [...document.querySelectorAll(".string-check:checked")].map(e => e.value)
    bpm = document.getElementById("set-bpm").value
    fretOffset = parseInt(document.getElementById("offset").value)
    countOn = true
    startBtn.innerHTML = "Stop"

    await requestWakeLock();
    metronomeBeat(beatCount)
    metronome = setInterval(() => metronomeBeat(beatCount), 60000 / bpm)

  } else {
    countOn = false
    startBtn.innerHTML = "Start"
    if (wakeLock) {
      wakeLock.release();
      wakeLock = null;
    }
    clearInterval(metronome);
  }
})

toggleSettings.addEventListener('click', () => {
  if (window.getComputedStyle(settingsPanel).getPropertyValue('max-height') == "0px") {
    settingsPanel.style.maxHeight = "200px";
    toggleSettings.innerHTML = "Collapse"
  } else {
    settingsPanel.style.maxHeight = "0px";
    toggleSettings.innerHTML = "Expand"
  }
})

extBrowserBtn.addEventListener('click', () => {
  copyToClipboard("https://edchavezb.github.io/fretboardmaster");
  extBrowserBtn.innerHTML = "Copied!"
})

if(navigator.userAgent.includes("Instagram")){
  document.getElementById("webview-modal").style.display = "Flex"
} 