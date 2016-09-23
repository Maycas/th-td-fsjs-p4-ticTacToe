/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var Player = (function($) {

    'use strict';

    function Player(symbol, playerName, isComputer, difficulty) {
        this.symbol = symbol;
        this.playerName = playerName;
        this.isComputer = isComputer;

        if (this.isComputer) {
            this.difficulty = difficulty;
        }
    }

    Player.prototype.makeMove = function(board) {
        var move = this.decideBestMove(board);

        console.log(move);
        $(board.cells[move[0]][move[1]].placeholder).click();
    };

    Player.prototype.decideBestMove = function(board) {
        var move;
        if (this.difficulty === "easy") {
            move = this.getRandomMove(board);
        } else if (this.difficulty === "impossible") {
            move = this.getMinimaxMove(board);
        }
        return move;
    };

    Player.prototype.getRandomMove = function(board) {
        var availableMoves = board.getEmptyCells();
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    };

    Player.prototype.getMinimaxMove = function(board) {
        //TODO
    };


    return Player;

})(jQuery);