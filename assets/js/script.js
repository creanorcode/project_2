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

const buttonSound = document.getElementById('button-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const tieSound = document.getElementById('tie-sound');

// FUnktion för att spela ljud med felhantering
function playSound(sound) {
    if (sound && sound.readyState >= 2) {
        try {
            sound.play();
        } catch (error) {
            console.error('Kunde inte spela ljud');
        }
    } else {
        console.error('Ljudfil saknas eller är inte laddad');
    }
}

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', (event) => {
        const userChoice = event.target.getAttribute('data-choice');

        if (buttonSound) {
            playSound(buttonSound);
        }
        //playSound(buttonSound);
        //buttonSound.play();

        playGame(userChoice);
    });
});

document.getElementById('next-level').addEventListener('click', () => {
    currentLevel++;
    gameSpeed = Math.max(1000, gameSpeed - 500); //Minska tiden per nivå
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('next-level').style.display = 'none';
});

document.getElementById('reset-game').addEventListener('click', () => {
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
        
        //Debug-loggar för att kontrollera valen och resultaten
        console.log(`User Choice: ${userChoice}`);
        console.log(`Computer Choice: ${computerChoice}`);
        console.log(`Result: ${result}`);

        if (result.includes("Du vann!")) {
            playerScore++;
            document.getElementById('next-level').style.display = 'block';

            if (winSound) {
                playSound(winSound);
            }
            //playSound(winSound);
            //winSound.play();

            //Justera spelets svårighetsgrad dynamiskt baserat på spelarens poäng
            if (playerScore % 5 === 0) {
                currentLevel++;
                gameSpeed = Math.max(1000, gameSpeed - 500); //Minska spelets hastighet
                document.getElementById('current-level').textContent = currentLevel;
            }
        } else if (result.includes("Du förlorade!")) {
            computerScore++;

            if (loseSound) {
                playSound(loseSound);
            } else {
                playSound(tieSound);
            }
            //playSound(loseSound);
            //loseSound.play();
        //} else {
            //playSound(tieSound)
            //tieSound.play();
        }

        updateScoreAndResult(`Du valde ${userChoice}. Datorn valde ${computerChoice}. ${result}`);

        document.querySelectorAll('.choice').forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
    }, gameSpeed);
}

function getComputerChoice() {
    // Lägg till högre chans för datorn att vinna på högre nivåer
    if (currentLevel > 3) {
        const losingChoices = results[choices[Math.floor(Math.random() * choices.length)]];
        return losingChoices[Math.floor(Math.random() * losingChoices.length)];
    } else {
        return choices[Math.floor(Math.random() * choices.length)];
    }
}

function getResult(userChoice, computerChoice) {
    if (!choices.includes(userChoice) || !choices.includes(computerChoice)) {
        throw new Error('Ogiltigt val!'); //Felhantering om inmatningarna är felaktiga
    }

    if (userChoice === computerChoice) {
        return "Det är oavgjort!";
    }

    if (results[userChoice].includes(computerChoice)) {
        return "Du vann!";
    } else {
        return "Du förlorade!";
    }
}

function updateScoreAndResult(resultText) {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('result').textContent = resultText;

    //Visa återställningsknappen om spelet är igång
    document.getElementById('reset-game').style.display = 'block';
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    currentLevel = 1;
    gameSpeed = 3000;

    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('result').textContent = '';
    document.getElementById('next-level').style.display = 'none';
    document.getElementById('reset-game').style.display = 'none';
}