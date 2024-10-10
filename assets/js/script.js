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
let gameSpeed = 3000; // Start time for the player to choose (in milliseconds)
let playerScore = 0;
let computerScore = 0;
const maxComputerScore = 7; // The game ends when the computer reaches this score

// Get references to the audio files 
const buttonSound = document.getElementById('button-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const tieSound = document.getElementById('tie-sound');

// Function to play sound with error handling
function playSound(sound) {
    if (sound && sound.readyState >= 2) {
        try {
            sound.load(); // Make sure the sound is loaded
            sound.play();
        } catch (error) {
            console.error('Could not play sound');
        }
    } else {
        console.error('Sound file is missing or not loaded');
    }
}

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', (event) => {
        const userChoice = event.target.getAttribute('data-choice');

        playSound(buttonSound);

        playGame(userChoice);
    });
});

document.getElementById('next-level').addEventListener('click', () => {
    currentLevel++;
    gameSpeed = Math.max(1000, gameSpeed - 500); // Decrease the time per level
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
        
        // Debug logs to check the choices and results
        console.log(`User Choice: ${userChoice}`);
        console.log(`Computer Choice: ${computerChoice}`);
        console.log(`Result: ${result}`);

        if (result.includes("You won!")) {
            playerScore++;
            document.getElementById('next-level').style.display = 'block';
            
            // Play victory sound
            playSound(winSound);

            // Adjust the game's difficulty dynamically based on the player's score
            if (playerScore % 5 === 0) {
                currentLevel++;
                gameSpeed = Math.max(1000, gameSpeed - 500); // Decrease the game's speed
                document.getElementById('current-level').textContent = currentLevel;
            }
        } else if (result.includes("You lost!")) {
            computerScore++;
            
            // Play loss sound
            playSound(loseSound);
            
            if (computerScore >= maxComputerScore) {
                endGame("The computer has reached 7 points and wins the game!");
                return; // End the game here
            }
            
            } else {
                playSound(tieSound);
            }

        updateScoreAndResult(`You chose ${userChoice}. The computer chose ${computerChoice}. ${result}`);

        document.querySelectorAll('.choice').forEach(button => {
            button.disabled = false;
            button.classList.remove('disabled');
        });
    }, gameSpeed);
}

function endGame(message) {
    document.querySelectorAll('.choice').forEach(button => {
        button.disabled = true; // Disable all choices
        button.classList.add('disabled');
    });

    // Display the message that the game is over
    document.getElementById('result').textContent = message;
    document.getElementById('reset-game').style.display = 'block'; // Show the button to reset the game
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    currentLevel = 1;
    gameSpeed = 3000;

    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('current-level').textContent = currentLevel;
    document.getElementById('result').textContent = ''; // Clear the result message
    document.getElementById('next-level').style.display = 'none'; // Hide the next level button
    document.getElementById('reset-game').style.display = 'none'; // Hide the reset button

    // Aktiver knapparna igen och ta bort disabled-klassen
    document.querySelectorAll('.choice').forEach(button => {
        button.disabled = false; // Enable the buttons
        button.classList.remove('disabled'); // Remove the "disabled" class
    });
}

function getComputerChoice() {
    // Add a higher chance for the computer to win at higher levels
    if (currentLevel > 3) {
        const losingChoices = results[choices[Math.floor(Math.random() * choices.length)]];
        return losingChoices[Math.floor(Math.random() * losingChoices.length)];
    } else {
        return choices[Math.floor(Math.random() * choices.length)];
    }
}

function getResult(userChoice, computerChoice) {
    if (!choices.includes(userChoice) || !choices.includes(computerChoice)) {
        throw new Error('Invalid choice!'); // Error handling if the inputs are incorrect
    }

    if (userChoice === computerChoice) {
        return "It’s a tie!";
    }

    if (results[userChoice].includes(computerChoice)) {
        return "You won!";
    } else {
        return "You lost!";
    }
}

function updateScoreAndResult(resultText) {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('computer-score').textContent = computerScore;
    document.getElementById('result').textContent = resultText;

    // Show the reset button if the game is active
    document.getElementById('reset-game').style.display = 'block';
}