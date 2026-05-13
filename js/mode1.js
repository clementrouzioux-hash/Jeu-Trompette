let canAnswer = true;


// ----------------- MODE 1 -----------------
const mode1 = {
    start(selectedMode) {

        resetButtons();

        mode = selectedMode;
        notesDone = 0;
        score = 0;
        timeLeft = 60;
        startTime = Date.now();

        canAnswer = true;
        

        document.getElementById("remaining").innerText = "";
        document.getElementById("timer").innerText = "";
        document.getElementById("result").innerText = "";

        if (mode.includes("fixed")) startMode1Fixed();
        if (mode.includes("chrono")) startMode1Chrono();
    }
};


// ----------------- LANCEMENT -----------------
function startMode1Fixed() {
    newNoteMode1();
}

function startMode1Chrono() {
    startTimer();
    newNoteMode1();
}


// ----------------- NOUVELLE NOTE -----------------
async function newNoteMode1() {

    canAnswer = true;
    document.getElementById("result").innerText = "";

    if (mode.includes("fixed") && notesDone >= totalNotes) {
        let elapsedTime = Math.round((Date.now() - startTime) / 1000);
        const saved = await saveScore('fixed', elapsedTime);
        await showEndScreen(elapsedTime, saved);
        return;
    }

    if (mode.includes("fixed")) {
        notesDone++;
        document.getElementById("remaining").innerText =
            `Note ${notesDone} / ${totalNotes}`;
    }

    const keys = Object.keys(notes);
current = keys[Math.floor(Math.random() * keys.length)];
playCurrentNote(current);

pressed = []; // ✅ reset les boutons

document.getElementById("noteImage").src = notesImages[current];
document.getElementById("noteImage").alt = current;

document.getElementById("noteText").innerText = "";

updateButtons();

    // 👉 CAS NOTE VIDE (auto-validation après 1s si silence)
    if (notes[current].length === 0) {
        setTimeout(() => {
            if (canAnswer && pressed.length === 0) {
                canAnswer = false;

                score++;
                document.getElementById("result").innerText = "✅ Correct !";

                setTimeout(newNoteMode1, 200);
            }
        }, 600);
    }
}


// ----------------- VALIDATION NORMALE -----------------
function checkAnswer() {

    if (!canAnswer) return;

    let correct = notes[current].slice().sort();
    let currentPressed = pressed.slice().sort();

    if (JSON.stringify(correct) === JSON.stringify(currentPressed)) {

        canAnswer = false;
        stopCurrentNote();

        score++;
        document.getElementById("result").innerText = "✅ Correct !";

        setTimeout(() => {
            newNoteMode1();
        }, 200);
    }
}


// ----------------- (optionnel sécurité) -----------------
function checkEmptyAnswer() {
    // gardé pour compatibilité si tu veux l’utiliser plus tard
    if (!canAnswer) return;

    if (notes[current].length === 0 && pressed.length === 0) {
        canAnswer = false;

        score++;
        document.getElementById("result").innerText = "✅ Silence correct !";

        setTimeout(() => {
            newNoteMode1();
        }, 400);
    }
}

window.mode1 = mode1;