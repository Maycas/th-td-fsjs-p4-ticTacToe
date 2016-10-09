/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var Module = (function ($, module) {

    'use strict';

    function Board(placeholder, test, testGrid) {
        this.dimension = 3;
        this.placeholder = placeholder;
        this.cells = [];
        this.solved = false;

        this.buildGrid(test, testGrid);
    }

    Board.prototype.buildGrid = function (test, testGrid) {
        var i = 0; // Counter to go through the array of list items inside of the grid
        var cell;
        var rowTemp;

        while (i < Math.pow(this.dimension, 2)) {
            for (var row = 0; row < this.dimension; row++) {
                rowTemp = []; // Temporary array to store the cells in a row
                for (var col = 0; col < this.dimension; col++) {
                    if (!test) {
                        // Create empty cells to be included in the temporary row
                        cell = new module.Cell($(this.placeholder).children()[i], " ", [row, col]);
                    } else {
                        // If the data comes from a test a array, get the proper symbol
                        cell = new module.Cell($(this.placeholder).children()[i], testGrid[row][col], [row, col]);
                    }
                    rowTemp.push(cell);

                    // Increment counter to select the next element of the grid list
                    i++;
                }
                this.cells.push(rowTemp);
            }
        }
    };

    Board.prototype.getEmptyCells = function () {
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

    Board.prototype.registerClickCellHandlers = function () {
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
    Board.prototype.registerHoverCellHandlers = function (playerSymbol) {
        var currentCell;
        for (var row = 0; row < this.cells.length; row++) {
            for (var col = 0; col < this.cells[row].length; col++) {
                currentCell = this.cells[row][col];
                // Hover Handler
                currentCell.hoverHandler(playerSymbol);
            }
        }
    };

    Board.prototype.checkWinner = function (lastMove) {
        var cellSymbol = this.cells[lastMove[0]][lastMove[1]].symbol;
        if (this.checkSection(lastMove, cellSymbol, "row") ||
            this.checkSection(lastMove, cellSymbol, "col") ||
            (lastMove[0] == lastMove[1] && this.checkSection(lastMove, cellSymbol, "mainDiag")) ||
            (lastMove[0] + lastMove[1] === this.dimension - 1 && this.checkSection(lastMove, cellSymbol, "secondDiag"))) {
            return cellSymbol;
        }
        return false;
    };

    Board.prototype.checkSection = function (lastMove, cellSymbol, toCheck) {
        var row, col;
        for (var i = 0; i < this.dimension; i++) {
            switch (toCheck) {
                case "row":
                    row = lastMove[0];
                    col = i;
                    break;
                case "col":
                    row = i;
                    col = lastMove[1];
                    break;
                case "mainDiag":
                    row = i;
                    col = i;
                    break;
                case "secondDiag":
                    row = i;
                    col = this.dimension - row - 1;
                    break;
            }
            // There's no winner if the checked cell is empty or it has a different symbol than the current executed move
            if (this.cells[row][col].isEmpty() || this.cells[row][col].symbol !== cellSymbol) {
                return false;
            }
        }
        this.solved = true;
        return true;
    };

    Board.prototype.exportCellsValues = function () {
        var cells = [];
        var rowTemp;
        for (var row = 0; row < this.dimension; row++) {
            rowTemp = [];
            for (var col = 0; col < this.dimension; col++) {
                rowTemp.push(this.cells[row][col].symbol);
            }
            cells.push(rowTemp);
        }

        return cells;
    };

    Board.prototype.cloneBoard = function () {
        return new module.Board(undefined, true, this.exportCellsValues());
    };

    // Score the board depending on if the player wins or the computer wins
    Board.prototype.scoreBoard = function (lastMove) {
        var winner = this.checkWinner(lastMove);
        if (winner === "O") {
            //Player wins
            return 10;
        } else if (winner === "X") {
            // Computer wins
            return -10;
        }
    };

    Board.prototype.logBoardStatus = function () {
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

    module.Board = Board;

    return module;

})(jQuery, Module || {});