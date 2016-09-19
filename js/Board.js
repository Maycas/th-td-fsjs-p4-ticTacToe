/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var Board = (function($) {

    'use strict';

    function Board(placeholder) {
        this.dimension = 3;
        this.placeholder = placeholder;
        this.cells = [];
    }

    Board.prototype.buildGrid = function(test, testGrid) {
        var i = 0; // Counter to go through the array of list items inside of the grid
        var cell;
        var rowTemp;

        while (i < Math.pow(this.dimension, 2)) {
            for (var row = 0; row < this.dimension; row++) {
                rowTemp = []; // Temporary array to store the cells in a row
                for (var col = 0; col < this.dimension; col++) {
                    if (!test) {
                        // Create empty cells to be included in the temporary row
                        cell = new Cell($(this.placeholder).children()[i], " ", [row, col]);
                    } else {
                        // If the data comes from a test a array, get the proper symbol
                        cell = new Cell($(this.placeholder).children()[i], testGrid[row][col], [row, col]);
                    }
                    rowTemp.push(cell);

                    // Increment counter to select the next element of the grid list
                    i++;
                }
                this.cells.push(rowTemp);
            }
        }
    };

    Board.prototype.getEmptyCells = function() {
        var emptyCells = [];

        for (var row = 0; row < this.cells.length; row++) {
            for (var col = 0; col < this.cells[row].length; col++) {
                if (this.cells[row][col].symbol !== "X" && this.cells[row][col].symbol !== "O") {
                    emptyCells.push([row, col]);
                }
            }
        }
        return emptyCells;
    };

    Board.prototype.registerClickCellHandlers = function() {
        var currentCell;
        for (var row = 0; row < this.cells.length; row++) {
            for (var col = 0; col < this.cells[row].length; col++) {
                currentCell = this.cells[row][col];
                // Click Handler
                currentCell.clickHandler();
            }
        }
    };

    // Decided to split cell handlers registering to ensure that when the player changes,
    // only the hover handler is affected, not the click one
    Board.prototype.registerHoverCellHandlers = function(playerSymbol) {
        var currentCell;
        for (var row = 0; row < this.cells.length; row++) {
            for (var col = 0; col < this.cells[row].length; col++) {
                currentCell = this.cells[row][col];
                // Hover Handler
                currentCell.hoverHandler(playerSymbol);
            }
        }
    };

    Board.prototype.checkWinner = function(lastMove) {
        var cellSymbol = this.cells[lastMove[0]][lastMove[1]].symbol;
        if (this.checkRow(lastMove, cellSymbol)) {
            // Check the row
            console.log("check row");
            return cellSymbol;
        } else if (this.checkCol(lastMove, cellSymbol)) {
            // Check the column
            console.log("check col");
            return cellSymbol;
        } else if (lastMove[0] === lastMove[1] && this.checkFirstDiag(lastMove, cellSymbol)) {
            // Check 1st diagonal
            console.log("check 1st diagonal");
            return cellSymbol;
        } else if (lastMove[0] + lastMove[1] === this.dimension - 1 && this.checkSecondDiag(lastMove, cellSymbol)) {
            // Check 2nd diagonal
            console.log("check 2nd diagonal");
            return cellSymbol;
        } else {
            return false;
        }
    };

    Board.prototype.checkRow = function(lastMove, cellSymbol) {
        for (var col = 0; col < this.dimension; col++) {
            if (this.cells[lastMove[0]][col].isEmpty() || this.cells[lastMove[0]][col].symbol !== cellSymbol) {
                return false;
            }
        }
        return true;
    };

    Board.prototype.checkCol = function(lastMove, cellSymbol) {
        for (var row = 0; row < this.dimension; row++) {
            if (this.cells[row][lastMove[1]].isEmpty() || this.cells[row][lastMove[1]].symbol !== cellSymbol) {
                return false;
            }
        }
        return true;
    };

    Board.prototype.checkFirstDiag = function(lastMove, cellSymbol) {
        for (var pos = 0; pos < this.dimension; pos++) {
            if (this.cells[pos][pos].isEmpty() || this.cells[pos][pos].symbol !== cellSymbol) {
                return false;
            }
        }
        return true;
    };

    Board.prototype.checkSecondDiag = function(lastMove, cellSymbol) {
        for (var row = 0, col = this.dimension - row - 1; row < this.dimension; row++, col = this.dimension - row - 1) {
            if (this.cells[row][col].isEmpty() || this.cells[row][col].symbol !== cellSymbol) {
                return false;
            }
        }
        return true;
    };

    Board.prototype.logBoardStatus = function() {
        var message = " --- --- ---";
        message += "\n";
        for (var row = 0; row < this.dimension; row++) {
            message += "| ";
            for (var col = 0; col < this.dimension; col++) {
                message += this.cells[row][col].symbol;
                message += " | ";
            }
            message += "\n";
            message += " --- --- ---";
            message += "\n";
        }

        return message;
    };

    return Board;

})(jQuery);