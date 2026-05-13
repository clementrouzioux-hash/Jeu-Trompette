// ----------------- CONFIG SUPABASE -----------------
const SUPABASE_URL = "https://muqshtdvzbcfyywjmynu.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11cXNodGR2emJjZnl5d2pteW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTY2ODcsImV4cCI6MjA5MDEzMjY4N30.fOg2UTbf18UvTg0xTu2wAA2XZ0MJ6P-nMo9hyaHOGQE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);


// ----------------- SAUVEGARDE LOCALE -----------------
function saveScoreLocal(modeType, scoreValue) {
    const scores = JSON.parse(localStorage.getItem('trumpetScores')) || [];

    scores.push({
        mode: modeType,
        score: scoreValue,
        date: new Date().toLocaleString('fr-FR')
    });

    localStorage.setItem('trumpetScores', JSON.stringify(scores));
}


async function saveScore(modeType, scoreValue) {

    saveScoreLocal(modeType, scoreValue);

    let inserted = null;

    try {
        const { data, error } = await supabaseClient
            .from('trumpet_scores')
            .insert([{ mode: modeType, score: scoreValue }])
            .select();

        if (error) {
            console.error("❌ Supabase error:", error);
        } else {
            inserted = data?.[0] || null;
            console.log("✅ Score envoyé à Supabase");
        }

    } catch (err) {
        console.error("❌ Erreur réseau:", err);
    }

    return {
    mode: modeType,
    score: scoreValue,
    created_at: inserted?.created_at || new Date().toISOString()
};
}


// ----------------- GET SCORES -----------------
async function getTopScores(modeType) {

    if (!supabaseClient) return [];

    const isTimeMode = modeType === "fixed";

    const { data, error } = await supabaseClient
        .from("trumpet_scores")
        .select("mode, score, created_at")
        .eq("mode", modeType)
        .order("score", { ascending: isTimeMode }) // fixed = meilleur temps
        .limit(10);

    if (error) {
        console.error(error);
        return [];
    }

    return data || [];
}


// ----------------- ÉCRAN FIN -----------------
async function showEndScreen(currentScore, currentScoreEntry = null) {
    stopCurrentNote();

    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("scoresScreen").style.display = "block";

    const topScores = await getTopScores(mode);
    const myCreatedAt = currentScoreEntry?.created_at;

    document.getElementById("scoreTitle").innerText =
        mode === "fixed"
            ? "Meilleurs temps pour 20 notes"
            : mode === "chrono"
            ? "Meilleur nombre de notes en 1 min"
            : mode === "mode2"
            ? "Meilleur score (lecture 30s)"
            : "Scores";

    document.getElementById("currentScoreValue").innerText =
        mode === "fixed"
            ? `${currentScore} sec`
            : mode === "chrono"
            ? `${currentScore} notes`
            : mode === "mode2"
            ? `${currentScore} notes`
            : `${currentScore}`;

    let html = "";
    let playerRank = -1;

    const myScore = currentScore;

    if (!topScores.length) {
        html = "<p>Aucun score enregistré</p>";
    } else {

        topScores.forEach((s, i) => {

    const scoreText =
        mode === "fixed" ? `${s.score} sec` : `${s.score} notes`;

    const date =
        s.created_at
            ? new Date(s.created_at).toLocaleString("fr-FR")
            : "";

    const isMe =
    myCreatedAt &&
    s.created_at &&
    new Date(s.created_at).getTime() === new Date(myCreatedAt).getTime();

    if (isMe) {
        playerRank = i + 1;
    }

    html += `
        <div class="score-item ${isMe ? "new-score" : ""}">
            <div class="score-line">
                <span>#${i + 1}</span>
                <span>${scoreText}</span>
            </div>
            <div class="score-date">${date}</div>
        </div>
    `;
});
    }

    document.getElementById("scoresList").innerHTML = html;

const rankElement = document.getElementById("currentScoreRank");

if (playerRank !== -1) {
    rankElement.innerHTML = `#${playerRank}`;
} else {
    rankElement.innerHTML = "";
}
}