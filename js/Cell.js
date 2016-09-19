/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var Cell = (function($) {

    'use strict';

    function Cell(placeholder, symbol, position) {
        this.placeholder = placeholder;
        this.position = position;
        this.boxClass = undefined;

        this.setSymbol(symbol);
    }

    Cell.prototype.setSymbol = function(playerSymbol) {
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

    Cell.prototype.isEmpty = function() {
        //return !($(this.placeholder).hasClass("box-filled-1") || $(this.placeholder).hasClass("box-filled-2"));
        return this.symbol !== "X" && this.symbol !== "O";
    };

    Cell.prototype.isDisplayed = function() {
        return ($(this.placeholder).hasClass("box-filled-1") || $(this.placeholder).hasClass("box-filled-2"));
    };

    Cell.prototype.displaySymbolInCell = function() {
        // Set the specific class for the selected box
        $(this.placeholder).addClass(this.boxClass);
        // Remove any selected background image due to hovering
        $(this.placeholder).attr('style', '');
    };

    Cell.prototype.clickHandler = function() {
        // Get a reference to the current cell that has been clicked
        var cellReference = this;

        $(this.placeholder).click(function() {
            // If the cell is empty or not clicked before
            if (!cellReference.isDisplayed()) {
                // Display the symbol in the cell
                cellReference.displaySymbolInCell();
                // Trigger an event that the board can listen when a cell is clicked
                $(cellReference.placeholder).trigger("cellClick", [cellReference]);
            }
        });
    };

    Cell.prototype.hoverHandler = function(playerSymbol) {
        // Get a reference to the current cell that has been clicked
        var cellReference = this;
        var symbol = playerSymbol;

        // Unbind any previous hover handler existing with a the previous player
        $(this.placeholder).off('mouseenter mouseleave');

        // Set the new hover handler event
        $(this.placeholder).hover(
            // When hovering, set the correct symbol in the empty cell
            function() {
                // Only act when the cell is empty
                if (cellReference.isEmpty()) {
                    if (symbol === "X") {
                        $(cellReference.placeholder).css('background-image', 'url("img/x.svg")');
                    } else if (symbol === "O") {
                        $(cellReference.placeholder).css('background-image', 'url("img/o.svg")');
                    }
                }
            },
            // When un-hovering, remove the symbol (reset to initial)
            function() {
                if (cellReference.isEmpty()) {
                    $(cellReference.placeholder).css('background-image', 'initial');
                }
            });
    };

    return Cell;

})(jQuery);