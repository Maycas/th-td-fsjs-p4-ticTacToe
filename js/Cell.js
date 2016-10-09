/**
 * Cell object
 * @namespace Module
 * @author: Marc Maycas <marc.maycas@gmail.com>
 *
 * @param {object} $        - jQuery library
 * @param {object} module   - Main global variable module
 * 
 * @property {object} placeholder   - jQuery object identifying the location of the cell inside of the DOM
 * @property {array}  position      - 2-dimesion array in the format of [row, col] inside of a board
 * @property {string} symbol        - Represents the symbol inside of the cell either "X", "O" or " " (in blank)
 * @property {string} boxClass      - Class used to style the inside of the cell depending on the symbol inside of it 
 * 
 * @returns {object} module.Cell
 */

var Module = (function ($, module) {

    'use strict';

    /**
     * Cell object constructor
     * @constructor
     * @param {object} placeholder   - jQuery object identifying the location in the DOM of the cell
     * @param {string} symbol        - Represents the symbol inside of the cell either "X", "O" or " " (in blank)
     * @param {array}  position      - 2-dimesion array in the format of [row, col] inside of a board
     */
    function Cell(placeholder, symbol, position) {
        this.placeholder = placeholder;
        this.position = position;
        this.boxClass = undefined;

        this.setSymbol(symbol);
    }

    /**
     * Sets a new player symbol inside of a cell and assigns the class used to style it
     * @param {string} playerSymbol - Symbol "X", "O" or " "
     */
    Cell.prototype.setSymbol = function (playerSymbol) {
        // Depending on the playerSymbol selected, update the symbol and the box style class
        switch (playerSymbol) {
            case "X":
                this.symbol = "X";
                this.boxClass = "box-filled-2";
                break;
            case "O":
                this.symbol = "O";
                this.boxClass = "box-filled-1";
                break;
            default:
                this.symbol = " ";
                break;
        }
    };

    /**
     * Detects if a cell is empty or not by looking at the symbol inside of it
     * 
     * @returns {boolean} - true if a cell is empty
     */
    Cell.prototype.isEmpty = function () {
        return this.symbol !== "X" && this.symbol !== "O";
    };

    /**
     * Detects if the cell symbol has been displayed in the application by detecting 
     * if it has the specific CSS class
     * 
     * @returns {boolean} - true if a cell is already showing its symbol
     */
    Cell.prototype.isDisplayed = function () {
        return ($(this.placeholder).hasClass("box-filled-1") || $(this.placeholder).hasClass("box-filled-2"));
    };

    /**
     * Displays the cell symbol in the cell placeholder
     */
    Cell.prototype.displaySymbolInCell = function () {
        // Set the specific class for the selected box
        $(this.placeholder).addClass(this.boxClass);
        // Remove any selected background image due to hovering
        $(this.placeholder).attr('style', '');
    };

    /**
     * Cell click handler. 
     * When clicked, in case the cell is not displaying its symbol, it displays it.
     * If the cell is already showing a symbol, then it doesn't do anything.
     * 
     * @fires cellClick event
     */
    Cell.prototype.clickHandler = function () {
        // Get a reference to the current cell that has been clicked
        var cellReference = this;

        $(this.placeholder).click(function () {
            // If the cell is empty or not clicked before
            if (!cellReference.isDisplayed()) {
                // Display the symbol in the cell
                cellReference.displaySymbolInCell();
                // Trigger an event that the board can listen when a cell is clicked
                $(cellReference.placeholder).trigger("cellClick", [cellReference]);
            }
        });
    };

    /**
     * Cell hover handler. 
     * Displays the player Symbol on the cell when hovering the cell
     * 
     * @param {string} playerSymbol - Player symbol to show when hovering
     */
    Cell.prototype.hoverHandler = function (playerSymbol) {
        // Get a reference to the current cell that has been clicked
        var cellReference = this;

        // Unbind any previous hover handler existing with a the previous player
        $(this.placeholder).off('mouseenter mouseleave');

        // Set the new hover handler event
        $(this.placeholder).hover(
            // When hovering, set the correct symbol in the empty cell
            function () {
                // Only act when the cell is empty
                if (cellReference.isEmpty()) {
                    if (playerSymbol === "X") {
                        $(cellReference.placeholder).css('background-image', 'url("img/x.svg")');
                    } else if (playerSymbol === "O") {
                        $(cellReference.placeholder).css('background-image', 'url("img/o.svg")');
                    }
                }
            },
            // When un-hovering, remove the symbol (reset to initial)
            function () {
                if (cellReference.isEmpty()) {
                    $(cellReference.placeholder).css('background-image', 'initial');
                }
            });
    };

    module.Cell = Cell;

    return module;

})(jQuery, Module || {});