const naturals = ["A", "B", "C", "D", "E", "F", "G"]
const sharps = ["A\u266F", "C\u266F", "D\u266F", "F\u266F", "G\u266F"]
const flats = ["A\u266D", "B\u266D", "D\u266D", "E\u266D", "G\u266D"]

const stringDiv = document.getElementById("string-number")
const noteDiv = document.getElementById("note-name")
const startBtn = document.getElementById("start")
const sharpCheck = document.getElementById("check-sharps")
const flatCheck = document.getElementById("check-flats")
const bpm = document.getElementById("set-bpm").value

let metronome = null
let countOn = false

function myRandom(max, min) {
    return Math.floor(Math.random() * (max-min) + min)
}

function stringNote(noteArray) {
    let string = myRandom(6, 1)
    let note = noteArray[myRandom(noteArray.length, 0)]
    console.log(string + ", " + note)
    stringDiv.innerText = string
    noteDiv.innerText = note
}

startBtn.addEventListener('click', () => {
    if (!countOn) {
        countOn = true
        startBtn.innerHTML = "Stop"
        let noteSet = sharpCheck.checked ? naturals.concat(sharps) : naturals;
        noteSet = flatCheck.checked ? noteSet.concat(flats) : noteSet;
        metronome = setInterval(() => stringNote(noteSet), 60000 / bpm * 4)
    } else {
        console.log("Please stop")
        countOn = false
        startBtn.innerHTML = "Start"
        clearInterval(metronome);
    }
})

stringNote(naturals);