init();

function init() {
    let difficulty = 1;
    console.log("index.html");

    let easyButton = document.getElementById("easy-button");
    let mediumButton = document.getElementById("medium-button");
    let hardButton = document.getElementById("hard-button");
    let backButton = document.getElementById("back-button");
    let rulesButton = document.getElementById("rules-button");
    let startButton = document.getElementById("start-button");

    /**
     * INITIAL
     */
    easyButton.onclick = () => {
        easyButton.style.transform = "scale(1.2)";
        mediumButton.style.transform = "scale(1)";
        hardButton.style.transform = "scale(1)";

        easyButton.style.setProperty("--easy-underline-width", "100%");
        mediumButton.style.setProperty("--medium-underline-width", "0%");
        hardButton.style.setProperty("--hard-underline-width", "0%");

        difficulty = 1;
    };
    mediumButton.onclick = () => {
        easyButton.style.transform = "scale(1)";
        mediumButton.style.transform = "scale(1.2)";
        hardButton.style.transform = "scale(1)";

        easyButton.style.setProperty("--easy-underline-width", "0%");
        mediumButton.style.setProperty("--medium-underline-width", "100%");
        hardButton.style.setProperty("--hard-underline-width", "0%");

        difficulty = 2;
    };
    hardButton.onclick = () => {
        hardButton.style.transform = "scale(1.2)";
        easyButton.style.transform = "scale(1)";
        mediumButton.style.transform = "scale(1)";

        hardButton.style.setProperty("--hard-underline-width", "100%");
        easyButton.style.setProperty("--easy-underline-width", "0%");
        mediumButton.style.setProperty("--medium-underline-width", "0%");

        difficulty = 3;
    };

    backButton.onclick = () => {
        document.getElementById("rules").style.left = "100vw";
    };
    rulesButton.onclick = () => {
        document.getElementById("rules").style.left = "0";
    };
    startButton.onclick = () => {
        window.location.href = `game.html?diff=${difficulty}`;
    };
}
