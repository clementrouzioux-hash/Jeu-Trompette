document.addEventListener('keydown', (e) => {

    // touches 1 2 3
    if (["1","2","3"].includes(e.key)) {
        press(parseInt(e.key));
        return;
    }

    // Enter → rejouer depuis écran score
    if (e.key === "Enter") {
        const scoresScreen = document.getElementById("scoresScreen");

        if (scoresScreen.style.display === "block") {
            replayGame();
        }
    }
});

document.addEventListener('keyup', (e)=>{
   if(["1","2","3"].includes(e.key)) {
       release(parseInt(e.key));
   }
});