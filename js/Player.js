/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var Module = (function ($, module) {

    'use strict';

    function Player(symbol, playerName, isComputer, difficulty) {
        this.symbol = symbol;
        this.playerName = playerName;
        this.isComputer = isComputer;

        if (this.isComputer) {
            this.difficulty = difficulty;
        }

        this.nextMove = undefined;
    }

    Player.prototype.toggleSymbol = function (currentSymbol) {
        if (currentSymbol === "X") {
            return "O";
        } else if (currentSymbol === "O") {
            return "X";
        }
    };

    Player.prototype.makeMove = function (gameManager, lastMove) {
        if (lastMove) {
            this.calculateMove(gameManager, lastMove);
        } else {
            // If the lastMove has not been defined, then it's the first move of the game and the player will get the center (which is the most important cell)
            this.nextMove = [1, 1];
        }

        // Set the symbol into the board by clicking on the selected position
        $(gameManager.board.cells[this.nextMove[0]][this.nextMove[1]].placeholder).click();
    };

    Player.prototype.calculateMove = function (gameManager, lastMove) {
        if (this.difficulty === "easy") {
            // If the difficulty is easy then the next move is determined by a complete random move
            this.setRandomMove(gameManager.board);
        } else if (this.difficulty === "impossible") {
            // If the difficulty is set to impossible, then the computer gets its choice by the minimax algorithm
            this.setMinimaxMove(gameManager.board, gameManager.currentPlayer.symbol, lastMove);
        }
    };

    Player.prototype.setRandomMove = function (board) {
        var availableMoves = board.getEmptyCells();
        this.nextMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    };

    Player.prototype.setMinimaxMove = function (board, currentPlayerSymbol, lastMove) {
        // If the game is still ongoing
        if (board.checkWinner(lastMove) === "X" || board.checkWinner(lastMove) === "O") {
            return board.scoreBoard(lastMove);
        }

        var scores = [];
        var moves = [];
        var currentMove;

        var max_score, min_score;
        var max_score_index, min_score_index;
        var clonedBoard;
        var minimaxScore;

        // Populate the scores array, using recursion
        var availableMoves = board.getEmptyCells();
        for (var i = 0; i < availableMoves.length; i++) {
            if (!board.solved) {
                currentMove = availableMoves[i];
                clonedBoard = board.cloneBoard();

                clonedBoard.cells[currentMove[0]][currentMove[1]].setSymbol(currentPlayerSymbol);

                minimaxScore = this.setMinimaxMove(clonedBoard, this.toggleSymbol(currentPlayerSymbol), currentMove)
                if (minimaxScore === undefined) {
                    minimaxScore = 0;
                }

                scores.push(minimaxScore);
                moves.push(currentMove);
            } else {
                break;
            }
        }

        // Do min and max calculation
        // Player
        if (currentPlayerSymbol === "O") {
            // Max calculation - Player
            max_score = Math.max.apply(Math, scores);
            max_score_index = scores.indexOf(max_score);

            return scores[max_score_index];
        } else {
            // Min calculation - Computer
            min_score = Math.min.apply(Math, scores);
            min_score_index = scores.indexOf(min_score);
            this.nextMove = moves[min_score_index];

            return scores[min_score_index];
        }

    };

    module.Player = Player;

    return module;

})(jQuery, Module || {});