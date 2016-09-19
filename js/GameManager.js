/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var GameManager = (function($) {

    'use strict';

    function GameManager() {

    }

    GameManager.prototype.startGame = function() {
        var $grid = $(".boxes");
        var $cells = $grid.children();

        //console.log($cells);

        /*
          var cell = new Cell($cells[0], " ");

          console.log(cell);

          cell.setSymbol("X");

          cell.hoverHandler("O");

          console.log(cell);
        */


        var board = new Board($grid);

        board.buildGrid(true, [
            [" ", " ", "X"],
            [" ", "X", " "],
            ["X", " ", " "]
        ]);

        console.log(board.logBoardStatus());

        board.registerClickCellHandlers();
        board.registerHoverCellHandlers("O");
        console.log(board.checkWinner([2, 1]));

        //board.scoreBoard([0, 0], [-1, 1]);
    };


    return GameManager;

})(jQuery);