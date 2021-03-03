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

let noteChange = null
let metronome = null
let beatCount = 1
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

function metronomeBeat(beat){
    console.log("It's counting")
    let allBeats = document.querySelectorAll(".beat")
    switch (beat) {
        case 1: 
            allBeats.forEach(oneBeat => oneBeat.classList.remove("beat-elapsed"));
            first.classList.add("first-elapsed")
            firstClick.play()
            beatCount++
            break;
        case 2: 
            first.classList.remove("first-elapsed")
            second.classList.add("beat-elapsed")
            beatClick.play()
            beatCount++
            break;
        case 3: 
            allBeats.forEach(oneBeat => oneBeat.classList.remove("beat-elapsed"));
            third.classList.add("beat-elapsed")
            beatClick.play()
            beatCount++
            break;
        case 4:
            allBeats.forEach(oneBeat => oneBeat.classList.remove("beat-elapsed")); 
            fourth.classList.add("beat-elapsed")
            beatClick.play()
            beatCount = 1
            break;
    }
    
}

startBtn.addEventListener('click', () => {
    if (!countOn) {
        const bpm = document.getElementById("set-bpm").value
        countOn = true
        startBtn.innerHTML = "Stop"
        let noteSet = sharpCheck.checked ? naturals.concat(sharps) : naturals;
        noteSet = flatCheck.checked ? noteSet.concat(flats) : noteSet;
        noteChange = setInterval(() => stringNote(noteSet), 60000 / bpm * 4)
        metronome = setInterval(() => metronomeBeat(beatCount), 60000 / bpm)
        metronomeBeat(beatCount)
    } else {
        console.log("Please stop")
        countOn = false
        startBtn.innerHTML = "Start"
        clearInterval(noteChange);
        clearInterval(metronome);
    }
})

stringNote(naturals);