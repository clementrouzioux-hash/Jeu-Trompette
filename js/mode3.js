function shuffle(arr){
    return arr
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

window.mode3 = {

    armures: ["1B", "2B", "3B", "4B", "5B", "1D", "2D", "3D", "4D", "5D", "6D"],

    currentArmure: null,
    correctNotes: [],
    selected: [],

    score: 0,
    timeLeft: 30,
    timerInterval: null,

    start() {

        const game = document.getElementById("gameContainer");
        game.classList.remove("mode2");
        game.classList.add("mode2");

        this.score = 0;
        this.timeLeft = 30;
        this.selected = [];

        document.getElementById("noteText").innerText = "";
        document.getElementById("result").innerText = "";
        document.getElementById("remaining").innerText = "";

        this.setupButtons();
        this.newRound();
        this.startTimer();
    },

    setupButtons() {

    const notes = ["DO","RE","MI","FA","SOL","LA","SI"];
    const shuffled = shuffle([...notes]);

    const container = document.querySelector(".buttons");

    container.innerHTML = `
        <div class="mode2-row">
            ${shuffled.slice(0,3).map(n =>
                `<button onclick="mode3.toggle('${n}', this)">${n}</button>`
            ).join("")}
        </div>

        <div class="mode2-row">
            ${shuffled.slice(3).map(n =>
                `<button onclick="mode3.toggle('${n}', this)">${n}</button>`
            ).join("")}
        </div>
    `;
},

    newRound() {

        this.currentArmure =
            this.armures[Math.floor(Math.random() * this.armures.length)];

        this.correctNotes =
            keySignatures[this.currentArmure] || [];

        this.selected = [];

        // texte
        document.getElementById("noteText").innerText = "";

        // image armure
        const img = document.getElementById("noteImage");
        img.src = `Images/armures/${this.currentArmure}.png`;

        // reset boutons
        document.querySelectorAll(".buttons button")
            .forEach(btn => btn.classList.remove("active"));

        document.getElementById("result").innerText = "";
    },

    toggle(note, btn) {

        const idx = this.selected.indexOf(note);

        if (idx >= 0) {

            this.selected.splice(idx, 1);
            btn.classList.remove("active");

        } else {

            this.selected.push(note);
            btn.classList.add("active");
        }

        this.check();
    },

    check() {

        const sortedA = [...this.selected].sort();
        const sortedB = [...this.correctNotes].sort();

        if (JSON.stringify(sortedA) === JSON.stringify(sortedB)) {

            this.score++;

            document.getElementById("result").innerText = "✅";

            setTimeout(() => {
                this.newRound();
            }, 300);
        }
    },

    startTimer() {

        clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {

            this.timeLeft--;

            document.getElementById("timer").innerText =
                `Temps: ${this.timeLeft}s`;

            if (this.timeLeft <= 0) {

                clearInterval(this.timerInterval);

                saveScore("mode3", this.score).then(saved => {
                    showEndScreen(this.score, saved);
                });
            }

        }, 1000);
    }
};