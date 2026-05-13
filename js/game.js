// ----------------- Variables globales -----------------
let current = "";
let pressed = [];
let mode = "";

let notesDone = 0;
let score = 0;
let timeLeft = 60;

let timerInterval;
let startTime;
let totalNotes = 20;

let soundEnabled = true;
// mémorisation (optionnel mais recommandé)
soundEnabled = localStorage.getItem("soundEnabled");
soundEnabled = soundEnabled === null ? true : soundEnabled === "true";
let currentAudio = null;


// ----------------- Lancement du mode -----------------
function startMode(selectedMode){
    stopCurrentNote();
    document.getElementById("gameContainer").classList.remove("mode2");
    document.getElementById("modeSelection").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    mode = selectedMode;

    if(selectedMode === "fixed" || selectedMode === "chrono"){
        resetButtons();
        mode1.start(selectedMode);
    }

    if(selectedMode === "mode2"){
        mode2.start(); // ✅ AJOUT IMPORTANT
    }
}


// ----------------- Timer (commun à tous les modes) -----------------
function startTimer(){
    clearInterval(timerInterval);

    timerInterval = setInterval(()=>{
        timeLeft--;
        document.getElementById("timer").innerText = `Temps: ${timeLeft}s`;

        if(timeLeft <= 0){
            stopCurrentNote();
            clearInterval(timerInterval);

            saveScore(mode, score).then(saved => {
                showEndScreen(score, saved);
            });
        }
    }, 1000);
}


// ----------------- Gestion des pistons -----------------
function toggle(n){
    if(pressed.includes(n)){
        pressed = pressed.filter(x => x !== n);
    } else {
        pressed.push(n);
    }

    updateButtons();

    if(mode === "fixed" || mode === "chrono"){
        if(typeof checkAnswer === "function"){
            checkAnswer();
        }
    }
}


// ----------------- Mise à jour visuelle des boutons -----------------
function updateButtons(){
    document.querySelectorAll(".buttons button").forEach(btn=>{
        if(["1","2","3"].includes(btn.innerText)){
            const num = parseInt(btn.innerText);
            btn.classList.toggle("active", pressed.includes(num));
        }
    });
}

function press(n){

    if(mode !== "fixed" && mode !== "chrono") return;

    if(!pressed.includes(n)){
        pressed.push(n);
    }

    updateButtons();

    // ✅ AJOUT ICI
    if(typeof checkAnswer === "function"){
        checkAnswer();
    }
}

function release(n){

    // 👉 sécurité mode 1 uniquement
    if(mode !== "fixed" && mode !== "chrono") return;

    pressed = pressed.filter(x => x !== n);
    updateButtons();

    if(pressed.length === 0){
        if(typeof checkAnswer === "function"){
            checkAnswer();
        }
    }
}


function replayGame(){
    if(timerInterval) clearInterval(timerInterval);

    document.getElementById("scoresScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";

    if(mode === "fixed" || mode === "chrono"){
        mode1.start(mode);
    }

    if(mode === "mode2" && typeof mode2 !== "undefined"){
        mode2.start();
    }
}

window.backToMenu = function(){
    document.getElementById("scoresScreen").style.display = "none";
    document.getElementById("modeSelection").style.display = "block";
}

function resetButtons(){
    const container = document.querySelector(".buttons");

    container.innerHTML = `
        <button 
            onmousedown="press(1)" 
            onmouseup="release(1)" 
            ontouchstart="press(1)" 
            ontouchend="release(1)">
            1
        </button>

        <button 
            onmousedown="press(2)" 
            onmouseup="release(2)" 
            ontouchstart="press(2)" 
            ontouchend="release(2)">
            2
        </button>

        <button 
            onmousedown="press(3)" 
            onmouseup="release(3)" 
            ontouchstart="press(3)" 
            ontouchend="release(3)">
            3
        </button>
    `;
}

function playCurrentNote(note){

    if(!soundEnabled) return;

    if(!window.noteSounds){
        console.warn("noteSounds pas chargé");
        return;
    }

    if(currentAudio){
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = window.noteSounds[note];

    if(!currentAudio) return;

    currentAudio.loop = true;
    currentAudio.currentTime = 0;

    currentAudio.play().catch(err => {
        console.log("Lecture bloquée :", err);
    });
}

function stopCurrentNote(){

    if(currentAudio){
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;

    localStorage.setItem("soundEnabled", soundEnabled);

    const btn = document.getElementById("soundToggle");

    if (soundEnabled) {
        btn.classList.remove("off");
        btn.innerText = "🔊";
    } else {
        btn.classList.add("off");
        btn.innerText = "🔇";

        stopCurrentNote();
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("soundToggle");

    if (!soundEnabled) {
        btn.classList.add("off");
        btn.innerText = "🔇";
    }
});