/**
 * Player object
 * @namespace Module
 * @author: Marc Maycas <marc.maycas@gmail.com>
 *
 * @param {object} $        - jQuery library
 * @param {object} module   - Main global variable module
 * 
 * @property {string} symbol        - Represents the symbol the player is playing with. It can be either "X" or "O"
 * @property {string} playerName    - Represents the name of the player
 * @property {boolean} isComputer   - Specifies if the player is an AI (true) or a human (false)
 * @property {string} difficulty    - Specifies how intelligent is the AI. It can have the values "easy" and "impossible"
 * @property {array} nextMove       - Pair of [row, col] values that define the next move the player is going to execute
 *  
 * @returns {object} module.Player
 */

var Module = (function ($, module) {

    'use strict';

    /**
     * Player constructor
     * @constructor
     * 
     * @param {string} symbol       - Symbol the player is playing with. It can be either "X" or "O"
     * @param {string} playerName   - Name of the player
     * @param {boolean} isComputer  - Specifies if the player is an AI (true) or a human (false)
     * @param {string} difficulty   - Specifies how intelligent is the AI. It can have the values "easy" and "impossible" 
     */
    function Player(symbol, playerName, isComputer, difficulty) {
        this.symbol = symbol;
        this.playerName = playerName;
        this.isComputer = isComputer;

        if (this.isComputer) {
            this.difficulty = difficulty;
        }

        this.nextMove = undefined;
    }

    /**
     * Switches the current player symbol for the other one
     * 
     * @param {string} currentSymbol    - Current symbol of the player
     * @returns {string}                - The opposite player's symbol
     */
    Player.prototype.toggleSymbol = function (currentSymbol) {
        if (currentSymbol === "X") {
            return "O";
        } else if (currentSymbol === "O") {
            return "X";
        }
    };

    /**
     * Calculates the player move and then simulates a click on the calculated cell
     * 
     * @param {object} gameManager  - Object that manages the game and contains the information of the game state
     * @param {array} lastMove      - [row, column] of the last move that has been performed in the board
     */
    Player.prototype.makeMove = function (gameManager, lastMove) {
        if (lastMove) {
            this.calculateMove(gameManager, lastMove);
        } else {
            // If the lastMove has not been defined, then it's the first move of the game and the player will get the center,
            // which, heuristically, is the most important cell in the board
            this.nextMove = [1, 1];
        }

        // Set the symbol into the board by clicking on the selected position
        $(gameManager.board.cells[this.nextMove[0]][this.nextMove[1]].placeholder).click();
    };

    /**
     * Calculates a move depending on the difficulty level of the player's AI
     * 
     * @param {object} gameManager  - Object that manages the game and contains the information of the game state
     * @param {array} lastMove      - [row, column] of the last move that has been performed in the board
     */
    Player.prototype.calculateMove = function (gameManager, lastMove) {
        if (this.difficulty === "easy") {
            // If the difficulty is easy then the next move is determined by a complete random move
            this.setRandomMove(gameManager.board);
        } else if (this.difficulty === "impossible") {
            // If the difficulty is set to impossible, then the computer gets its choice by the minimax algorithm
            this.setMinimaxMove(gameManager.board, gameManager.currentPlayer.symbol, lastMove);
        }
    };

    /**
     * Calculates a random nextMove based on the available empty cells in a board
     * 
     * @param {object} board    - Current board object 
     */
    Player.prototype.setRandomMove = function (board) {
        var availableMoves = board.getEmptyCells();
        this.nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    };

    /**
     * Calculates the next move of the player based on the minimax algorithm
     * 
     * @param {object} board                - Current board object 
     * @param {string} currentPlayerSymbol  - Current symbol of the player
     * @param {array} lastMove              - [row, column] of the last move that has been performed in the board
     * 
     * @returns {integer}   - Minimax algorithm's move score                   
     */
    Player.prototype.setMinimaxMove = function (board, currentPlayerSymbol, lastMove) {
        // Base case
        // Detect if the game is effectively over, so there's a winner
        if (board.checkWinner(lastMove) === "X" || board.checkWinner(lastMove) === "O") {
            return board.scoreBoard(lastMove);
        }

        // Local variables definition
        var scores = []; // Array of scores to store the different scores from the move tree
        var moves = []; // Array of moves to store the moves applied in the decision making tree
        var currentMove; // The currently selected move to evaluate

        var max_score, min_score; // Max and min score values
        var max_score_index, min_score_index; // Index where the min and max scores are in the array
        var clonedBoard; // Cloned board to evaluate in the decision making tree
        var minimaxScore; // Score obtained from applying the minimax algorithm

        // Recursive cases
        // Populate the scores array, using recursion on minimax
        var availableMoves = board.getEmptyCells();
        for (var i = 0; i < availableMoves.length; i++) {
            if (!board.solved) {
                // If the board is not solved, apply minimax for every each available move
                currentMove = availableMoves[i];
                clonedBoard = board.cloneBoard();

                clonedBoard.cells[currentMove[0]][currentMove[1]].setSymbol(currentPlayerSymbol);

                minimaxScore = this.setMinimaxMove(clonedBoard, this.toggleSymbol(currentPlayerSymbol), currentMove);

                // If the score is undefined is because there's no winner, so, it's necessary to change its value to 0 (tie)
                if (minimaxScore === undefined) {
                    minimaxScore = 0;
                }

                // Push both the score and the moves to their respective arrays
                scores.push(minimaxScore);
                moves.push(currentMove);
            } else {
                // If the board is already solved, there's no need to keep evaluating the remaining moves, so the loop should be broken
                break;
            }
        }

        // Do min and max calculation
        if (currentPlayerSymbol === "O") {
            // Max calculation - Player
            max_score = Math.max.apply(Math, scores);
            max_score_index = scores.indexOf(max_score);

            return scores[max_score_index];
        } else {
            // Min calculation - Computer
            min_score = Math.min.apply(Math, scores);
            min_score_index = scores.indexOf(min_score);

            // Set the nextMove for the AI player
            this.nextMove = moves[min_score_index];

            return scores[min_score_index];
        }
    };

    module.Player = Player;

    return module;

})(jQuery, Module || {});