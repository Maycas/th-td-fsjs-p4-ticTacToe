/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var Player = (function($) {

    'use strict';

    function Player(symbol, playerName, isComputer) {
        this.symbol = symbol;
        this.playerName = playerName;
        this.isComputer = isComputer;
    }

    Player.prototype.makeMove = function (board) {
        var move = this.decideBestMove(board);

        console.log(move);
        $(board.cells[move[0]][move[1]].placeholder).click();
    };

    Player.prototype.decideBestMove = function (board) {
        // TODO: Implement easy level and difficult level
        return board.getEmptyCells()[0];
    };

    return Player;

})(jQuery);