window.mode2 = {

    notes: [
        "DO","DOA","DOAA",
        "FA","FAA",
        "LA","LAG","LAA",
        "MI","MIA",
        "RE","REA",
        "SI","SIA","SIG",
        "SOL","SOLA","SOLG"
    ],

    current: null,
    score: 0,
    timeLeft: 30,
    timerInterval: null,

    start(){

    this.score = 0;
    this.timeLeft = 30;

    document.getElementById("noteText").innerText = "";
    document.getElementById("result").innerText = "";
    document.getElementById("remaining").innerText = "";
    document.getElementById("timer").innerText = "";

    this.setupButtons();

    // ⚡ PRELOAD AVANT TOUT
    Object.values(notesImages).forEach(src => {
        const img = new Image();
        img.src = src;
    });

    this.startTimer();
    this.newNote();
},

    setupButtons(){
    const container = document.querySelector(".buttons");

    container.innerHTML = `
        <button onclick="mode2.answer('DO', this)">Do</button>
        <button onclick="mode2.answer('RE', this)">Ré</button>
        <button onclick="mode2.answer('MI', this)">Mi</button>
        <button onclick="mode2.answer('FA', this)">Fa</button>
        <button onclick="mode2.answer('SOL', this)">Sol</button>
        <button onclick="mode2.answer('LA', this)">La</button>
        <button onclick="mode2.answer('SI', this)">Si</button>
    `;
    },

newNote(){
    const note = this.notes[Math.floor(Math.random() * this.notes.length)];
    this.current = note;

    this.locked = false; // reset immédiat

    document.getElementById("noteText").innerText = "";
    document.getElementById("result").innerText = "";

    const img = document.getElementById("noteImage");

const newSrc = notesImages[note];

if (img.dataset.src !== newSrc) {
    img.src = newSrc;
    img.dataset.src = newSrc;
}},

    answer(ans, btn){
    if(this.locked) return;
    this.locked = true;

    const base = this.getBase(this.current);

    document.querySelectorAll(".buttons button")
        .forEach(b => b.classList.remove("active"));

    btn.classList.add("active");

    if(ans === base){
        this.score++;
        document.getElementById("result").innerText = "✅";

        // 🔥 ultra rapide transition
        requestAnimationFrame(() => {
            this.newNote();
            this.locked = false;
        });

    } else {
        // optionnel: petit feedback erreur
        document.getElementById("result").innerText = "❌";
        setTimeout(() => this.locked = false, 100);
    }
},


    getBase(note){
        if(note.startsWith("DO")) return "DO";
        if(note.startsWith("RE")) return "RE";
        if(note.startsWith("MI")) return "MI";
        if(note.startsWith("FA")) return "FA";
        if(note.startsWith("SOL")) return "SOL";
        if(note.startsWith("LA")) return "LA";
        if(note.startsWith("SI")) return "SI";
        return note;
    },

    startTimer(){
        clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            document.getElementById("timer").innerText = `Temps: ${this.timeLeft}s`;

            if(this.timeLeft <= 0){
                clearInterval(this.timerInterval);

                saveScore('mode2', this.score).then(saved => {
                     showEndScreen(this.score, saved);
                });
            }
        }, 1000);
    }
};