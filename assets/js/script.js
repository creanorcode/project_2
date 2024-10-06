// List with choices
const choices = ["rock", "paper", "scissors", "lizard", "spock"];
const results = {
    rock: ["scissors", "lizard"],
    paper: ["rock", "spock"],
    scissors: ["paper", "lizard"],
    lizard: ["spock", "paper"],
    spock: ["scissors", "rock"],
};

let currentLevel = 1;
let gameSpeed = 3000; //Startid för spelaren att välja (i millisekunder)
let playerScore = 0;
let computerScore = 0;

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', (event) => {
        const userChoice = event.target.getAttribute('data-choice');
        playGame(userChoice);
    });
});

document.getElementById('next-level').addEventListener('click', () => {
    currentLevel++;
    gameSpeed = Math.max(1000, gameSpeed - 500); //Minska tiden per nivå
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('next-level').style.display = 'none';
});

document.getElementById('reset-game').addEventListener('click', => {
    resetGame();
});

function playGame(userChoice) {
    document.querySelectorAll('.choice').forEach(button => {
        button.disabled = true;
        button.classList.add('disabled');
    });

    setTimeout(() => {
        const computerChoice = getComputerChoice();
        const result = getResult(userChoice, computerChoice);

        if (result.includes("Du vann")) {
            playerScore++;
            document.getElementById('next-level').style.display = 'block';

            //Justera spelets svårighetsgrad dynamiskt baserat på spelarens poäng
            if (playerScore % 5 === 0) {
                currentLevel++;
                gameSpeed = Math.max(1000, gameSpeed - 500); //Minska spelets hastighet
                document.getElementById('current-level').textContent = currentLevel;
            }
        } else if (result.includes("Du förlorade")) {
            computerScore++;
        }

        updateScoreAndResult('Du valde ${userChoice}. Datorn valde ${computerChoice}. ${result}');

        document.querySelectorAll('.choice').forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
    }, gameSpeed);
}