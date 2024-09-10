class CaboGame {
    constructor() {
        this.players = [];
        this.currentRound = 1;  // Tracks the current round
        this.maxRounds = 0;     // Set via user input
    }

    addPlayer(name) {
        this.players.push({ name, scores: [], total: 0 });
        this.renderPlayers();
    }

    removePlayer(name) {
        this.players = this.players.filter(player => player.name !== name);
        this.renderPlayers();
    }

    addScore(playerName, score) {
        if (this.maxRounds === 0) {
            alert("Please set the number of rounds before adding scores.");
            return;
        }

        let player = this.players.find(player => player.name === playerName);
        if (player) {
            // Ensure valid score and that the current round is being scored
            if (isNaN(score) || score === '') {
                alert(`Please enter a valid score for ${player.name}.`);
                return;
            }

            if (player.scores.length < this.currentRound) {
                player.scores.push(parseInt(score));
                player.total = player.scores.reduce((a, b) => a + b, 0);
                console.log(`${player.name} added a score for round ${this.currentRound}. Scores: ${player.scores}`);
            } else {
                alert(`You cannot add a score for a future round. Complete the current round for all players.`);
                return;
            }
        }

        // Check if all players have completed scores for the current round
        const allPlayersCompletedRound = this.players.every(
            player => player.scores.length === this.currentRound
        );

        // If all players have completed the round, move to the next one
        if (allPlayersCompletedRound) {
            this.currentRound++;
            console.log(`All players have completed round ${this.currentRound - 1}. Moving to round ${this.currentRound}.`);
        } else {
            console.log(`Not all players have completed round ${this.currentRound}.`);
        }

        this.renderPlayers();
    }

    getWinner() {
        // Ensure there are players and all rounds have been completed
        if (this.players.length === 0) {
            alert("No players in the game.");
            return null;
        }

        // Return the player with the lowest total score
        let winner = this.players.reduce((prev, curr) => (prev.total < curr.total ? prev : curr));
        console.log("Winner calculated: ", winner);
        return winner;
    }

    renderPlayers() {
        const playersList = document.getElementById('playersList');
        playersList.innerHTML = '';

        this.players.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            playerCard.id = `player-${player.name}`; // Unique ID for each player card

            playerCard.innerHTML = `
                <span>${player.name}</span>
                <span>Total: ${player.total}</span>
                <input type="number" class="round-score-input" placeholder="Round Score" />
                <button onclick="game.addScore('${player.name}', this.previousElementSibling.value)">Add Score</button>
                <button onclick="game.removePlayer('${player.name}')">Remove</button>
            `;

            playersList.appendChild(playerCard);
        });
    }

    highlightWinner(winner) {
        // Add the winner-card class to the winner's card
        const winnerCard = document.getElementById(`player-${winner.name}`);
        if (winnerCard) {
            winnerCard.classList.add('winner-card');  // Adds the green highlight only to the winner
        }
    }
}

// Initialize game
const game = new CaboGame();

// DOM Elements
document.getElementById('addPlayerBtn').addEventListener('click', () => {
    const playerName = document.getElementById('playerNameInput').value;
    if (playerName) {
        game.addPlayer(playerName);
        document.getElementById('playerNameInput').value = '';
    }
});

document.getElementById('roundsInput').addEventListener('change', () => {
    game.maxRounds = parseInt(document.getElementById('roundsInput').value);
    console.log(`Max rounds set to: ${game.maxRounds}`);
});

document.getElementById('findWinnerBtn').addEventListener('click', () => {
    if (game.maxRounds === 0) {
        alert("Please set the number of rounds before finding the winner.");
        return;
    }

    // Check if every player has completed the required number of rounds
    const allRoundsComplete = game.players.every(player => player.scores.length === game.maxRounds);
    console.log("All rounds complete: ", allRoundsComplete);

    if (allRoundsComplete) {
        const winner = game.getWinner();
        if (winner) {
            // Highlight the winner's card in green
            game.highlightWinner(winner);
            console.log(`Winner highlighted: ${winner.name}`);
        }
    } else {
        // Identify players who haven't completed all rounds
        let incompletePlayers = game.players.filter(player => player.scores.length < game.maxRounds);
        alert(`The following players haven't completed all rounds: ${incompletePlayers.map(p => p.name).join(', ')}`);
    }
});
