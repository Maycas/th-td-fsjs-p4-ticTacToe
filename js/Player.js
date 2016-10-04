/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var Player = (function ($) {

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
            // If the lastMove has not been defined, then it's the first move of the game and the player will get the center
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
        if (board.checkWinner(lastMove) !== " " && board.getEmptyCells().length === 0) {
            return board.scoreBoard(lastMove);
        }

        var scores = [];
        var moves = [];
        var currentMove;

        var max_score, min_score;
        var max_score_index, min_score_index;
        var clonedBoard;

        // Populate the scores array, using recursion
        var availableMoves = board.getEmptyCells();
        for (var i = 0; i < availableMoves.length; i++) {
            currentMove = availableMoves[i];
            clonedBoard = board.cloneBoard();

            clonedBoard.cells[currentMove[0]][currentMove[1]].setSymbol(currentPlayerSymbol);

            console.log(clonedBoard.logBoardStatus());

            currentPlayerSymbol = this.toggleSymbol(currentPlayerSymbol);
            scores.push(this.setMinimaxMove(clonedBoard, currentPlayerSymbol, currentMove));
            moves.push(currentMove);
        }

        // Do min and max calculation
        // Player
        if (currentPlayerSymbol === "O") {
            // Max calculation - Player
            max_score = Math.max.apply(Math, scores);
            max_score_index = scores.indexOf(max_score);
            this.nextMove = moves[max_score_index];

            return scores[max_score_index];
        } else {
            // Min calculation - Computer
            min_score = Math.min.apply(Math, scores);
            min_score_index = scores.indexOf(min_score);
            this.nextMove = moves[min_score_index];

            console.log("computer choice", this.nextMove);
            console.log("moves", moves);
            console.log("scores", scores);

            return scores[min_score_index];
        }

    };

    return Player;

})(jQuery);