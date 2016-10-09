/**
 * Board object
 * @namespace Module
 * @author: Marc Maycas <marc.maycas@gmail.com>
 *
 * @param {object} $        - jQuery library
 * @param {object} module   - Main global variable module
 * 
 * @property {object} placeholder   - jQuery object identifying the location of the grid inside of the DOM
 * @property {integrer} dimension   - Board's dimension. This app fixes its dimension is 3, generating a 3x3 board
 * @property {array} cells          - Array containing all the cell objects. Each cell can be accessed as cells[row][column] 
 * @property {boolean} solved       - true if the board already has a winner
 * 
 * @returns {object} module.Board
 */

var Module = (function ($, module) {

    'use strict';

    /**
     * Board constructor
     * @constructor
     * 
     * @param {object} placeholder  - jQuery object identifying the location of the grid inside of the DOM
     * @param {boolean} test        - Specifies if the board is virtual (with dummy data) or if it is the real one that is being played
     * @param {array} testGrid      - Array of cell symbols to set in a board with dummy data. For example: [["X"," ", "O"],["O", "O", " "],[" ", "X", " "]]
     */
    function Board(placeholder, test, testGrid) {
        this.placeholder = placeholder;
        this.dimension = 3;
        this.cells = [];
        this.solved = false;

        this.buildGrid(test, testGrid);
    }

    /**
     * Builds a board of cell objects, either real or with dummy data
     * 
     * @param {boolean} test    - Specifies if the board is virtual (with dummy data) or if it is the real one that is being played
     * @param {array} testGrid  - Array of cell symbols to set in a board with dummy data. @example: [["X"," ", "O"],["O", "O", " "],[" ", "X", " "]]
     */
    Board.prototype.buildGrid = function (test, testGrid) {
        var i = 0; // Counter to go through the array of list items inside of the grid
        var cell; // Variable to store the newly created cells
        var rowTemp; // Temporary variable to store the row of cells

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

    /**
     * Gets all the empty cells available in the board
     * 
     * @returns {array} - Array of the locations of the empty cells in the form of [row][column]
     */
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

    /**
     * Register the cell click handlers in all cells in board
     */
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

    /**
     * Register the cells hover handler
     *     
     * @param {string} playerSymbol - Symbol that needs to be displayed when hovering the empty cell
     */
    Board.prototype.registerHoverCellHandlers = function (playerSymbol) {
        // Decided to split cell handlers registering to ensure that when the player changes, only the hover handler is affected, not the click one
        var currentCell;
        for (var row = 0; row < this.cells.length; row++) {
            for (var col = 0; col < this.cells[row].length; col++) {
                currentCell = this.cells[row][col];
                // Hover Handler
                currentCell.hoverHandler(playerSymbol);
            }
        }
    };

    /**
     * Checks if there's winner of the board and, in case there is, its identity
     * 
     * @param {array} lastMove      - [row, column] of the last move that has been performed in the board
     * @returns {boolean, array}    - If there's a winner, the symbol of the winner is returned. In case there's not a winner, a false value is returned
     */
    Board.prototype.checkWinner = function (lastMove) {
        // The strategy used to check the winner is by checking the surroundings of the cell that has been selected the last. 
        // If there's no winner for that last selected cell, there will be no winner in any other cell
        // The algorithm checks the row and the column of that cell and, in case the cell is in any of the diagonals, checks that diagonal
        var cellSymbol = this.cells[lastMove[0]][lastMove[1]].symbol;
        if (this.checkSection(lastMove, cellSymbol, "row") ||
            this.checkSection(lastMove, cellSymbol, "col") ||
            (lastMove[0] == lastMove[1] && this.checkSection(lastMove, cellSymbol, "mainDiag")) ||
            (lastMove[0] + lastMove[1] === this.dimension - 1 && this.checkSection(lastMove, cellSymbol, "secondDiag"))) {
            return cellSymbol;
        }
        return false;
    };

    /**
     * Checks a specific section of the board if there's a winner.
     * 
     * @param {array} lastMove      - [row, column] of the last move that has been performed in the board
     * @param {string} cellSymbol   - String containing the player symbol to check. It can be "X" or "O"
     * @param {string} toCheck      - Section to review. It can have the values "row", "col" (for column), "mainDiag" (from [0,0] to [lastRow, lastCol]) 
     * and "secondDiag" (from [firstRow, lastCol] to [lastRow, firstCol])
     * @returns {boolean}           - true if there's a winner, false if there's not
     */
    Board.prototype.checkSection = function (lastMove, cellSymbol, toCheck) {
        var row, col;
        for (var i = 0; i < this.dimension; i++) {
            // Depending on the section to check, the row and the column will vary differently for every iteration of the loop
            switch (toCheck) {
                case "row":
                    // On each row, the row is always static and the column is the only that we iterate over
                    row = lastMove[0];
                    col = i;
                    break;
                case "col":
                    // On each column, the column is always static and the row is the only that we iterate over
                    row = i;
                    col = lastMove[1];
                    break;
                case "mainDiag":
                    // In the main diagonal, row and column are equal and the iteration goes through all the positions where row = col
                    row = i;
                    col = row;
                    break;
                case "secondDiag":
                    // In the secondary diagonal, row + col = this.dimension - 1, so for each iteration, this equation needs to be maintained
                    row = i;
                    col = this.dimension - 1 - row;
                    break;
            }
            // There's no winner if the checked cell is empty or if it has a different symbol than the current executed move
            if (this.cells[row][col].isEmpty() || this.cells[row][col].symbol !== cellSymbol) {
                return false;
            }
        }
        // In case there's a winner, it sets the solved property to true
        this.solved = true;
        return true;
    };

    /**
     * Exports the current state of all the cells in the board
     * 
     * @returns {array} - Array of strings with all the cell values, accessible as [row][column]. 
     * For example: [["X"," ", "O"],["O", "O", " "],[" ", "X", " "]]
     */
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

    /**
     * Creates a new dummy board (with no access to the DOM elements), that is a copy of the current board. 
     * This is used for computer move computations
     * 
     * @returns {object}    - Dummy data board
     */
    Board.prototype.cloneBoard = function () {
        return new module.Board(undefined, true, this.exportCellsValues());
    };

    /**
     * Scores the board depending on if player "O" wins or the player "X" wins
     * 
     * @param {array} lastMove  - [row, column] of the last move that has been performed in the board
     * @returns {integer}       - The boards score. 10 if "O" wins or -10 if the "X" wins 
     */
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

    /**
     * Logs the board status into the console in a friendly format that imitates a board structure.
     * Used for debugging purposes
     */
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

        console.log(message);
    };

    module.Board = Board;

    return module;

})(jQuery, Module || {});