const naturals = ["A", "B", "C", "D", "E", "F", "G"]
const sharps = ["A\u266F", "C\u266F", "D\u266F", "F\u266F", "G\u266F"]
const flats = ["A\u266D", "B\u266D", "D\u266D", "E\u266D", "G\u266D"]

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

let string = null
let note = null
let fretOffset = null
let noteSound = null
let noteChange = null
let metronome = null
let beatCount = 1
let countOn = false

function myRandom(max, min) {
    return Math.floor(Math.random() * (max-min) + min)
}

function stringNote(noteArray) {
    string = myRandom(6, 1)
    note = noteArray[myRandom(noteArray.length, 0)]
    console.log(string + ", " + note)
    stringDiv.innerText = string
    noteDiv.innerText = note
    return [string, note]
}

function soundSelector(string, note) {
    const actualString = 7 - string
    const standardTuning = ['E', 'A', 'D', 'G', 'B', 'E']
    const allTones = note.includes('\u266D') ? naturals.concat(flats).sort() : naturals.concat(sharps).sort()
    let openString = standardTuning[actualString - 1]
    let notesBefore = actualString == 6 || actualString == 5 ? (actualString - 1) * 5 - 1 : (actualString - 1) * 5
    let startingPoint = allTones.indexOf(openString) + fretOffset
    let fretDistance = allTones.indexOf(note) >= startingPoint ? allTones.indexOf(note) - startingPoint : 12 - (startingPoint - allTones.indexOf(note))
    return  notesBefore + fretOffset + fretDistance + 1
}

function metronomeBeat(beat){
    let allBeats = document.querySelectorAll(".beat")
    let noteSet = sharpCheck.checked ? naturals.concat(sharps) : naturals;
    noteSet = flatCheck.checked ? noteSet.concat(flats) : noteSet;
    allBeats.forEach(oneBeat => oneBeat.classList.remove("beat-elapsed"));
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

startBtn.addEventListener('click', () => {
    if (!countOn) {
        const bpm = document.getElementById("set-bpm").value
        fretOffset = parseInt(document.getElementById("offset").value)
        countOn = true
        startBtn.innerHTML = "Stop"
        metronomeBeat(beatCount)
        metronome = setInterval(() => metronomeBeat(beatCount), 60000 / bpm)
    } else {
        console.log("Please stop")
        countOn = false
        startBtn.innerHTML = "Start"
        clearInterval(metronome);
    }
})