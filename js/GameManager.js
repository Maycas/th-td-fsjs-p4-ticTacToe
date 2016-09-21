/**
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

var GameManager = (function($) {

    'use strict';

    function GameManager() {
        this.player1;
        this.player2;
        this.currentPlayer;
        this.board;

        this.startScreen = '<div class="screen screen-start" id="start"><header><h1>Tic Tac Toe</h1><a href="#" class="button">Start game</a></header></div>';

        this.gameScreen = '<div class="board" id="board"><header><h1>Tic Tac Toe</h1><ul><li class="players" id="player1"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg></li><li class="players" id="player2"><svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg></li></ul></header><ul class="boxes"><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li><li class="box"></li></ul></div>';

        this.endGameScreen = '<div class="screen screen-win" id="finish"><header><h1>Tic Tac Toe</h1><p class="message"></p><a href="#" class="button">New game</a></header></div>';
    }

    GameManager.prototype.init = function() {
        // Load the game screen screen
        $("body").html(this.startScreen);

        // Register the event handler for the button, which takes to the game screen
        $(".button").on("click", {
            gameManager: this
        }, function(event) {
            var gameManager = event.data.gameManager;
            gameManager.gameSetup();
        });
    };

    GameManager.prototype.loadGameScreen = function() {
        // Load the game screen screen
        $("body").html(this.gameScreen);
    };

    GameManager.prototype.gameSetup = function() {
        // Get the info from the players in the init screen
        this.player1 = new Player("O", "player1", false);
        this.player2 = new Player("X", "player2", false);

        // Load the game screen
        this.loadGameScreen();

        // Define the first player to start
        this.currentPlayer = this.player1;
        this.setActivePlayer(this.currentPlayer);

        // Create the board
        var $grid = $(".boxes");
        this.board = new Board($grid);
        this.board.registerClickCellHandlers();
        this.board.registerHoverCellHandlers(this.currentPlayer.symbol);

        // Register an event listener for the "cellSelect" event
        $(this.board.placeholder).on("cellClick", {
            gameManager: this
        }, this.cellClickHandler);
    };

    GameManager.prototype.cellClickHandler = function(event, clickedCell) {
        // Get the reference of the Game Manager
        var gameManager = event.data.gameManager;

        // Get the reference to the board
        var board = gameManager.board;

        // Get the reference of the current player;
        var currentPlayer = gameManager.currentPlayer;

        // Get the clicked cell position
        var pos = clickedCell.position;

        // Set current player's symbol in the cell and show it
        board.cells[pos[0]][pos[1]].setSymbol(currentPlayer.symbol);
        board.cells[pos[0]][pos[1]].displaySymbolInCell();

        // Check if there's a winner
        if (board.checkWinner(pos) || board.getEmptyCells().length === 0) {
            var winner = board.checkWinner(pos);
            gameManager.loadWinnerScreen(gameManager, winner);
        } else {
            gameManager.togglePlayer(gameManager);
        }
    };

    GameManager.prototype.setActivePlayer = function(currentPlayer) {
        $(".active").removeClass("active");
        if (currentPlayer.symbol === "O") {
            $("#player1").addClass("active");
        } else {
            $("#player2").addClass("active");
        }
    };

    GameManager.prototype.togglePlayer = function(gameManager)  {
        // Set the new active player
        if (gameManager.currentPlayer === gameManager.player2) {
            gameManager.currentPlayer = gameManager.player1;
        } else {
            gameManager.currentPlayer = gameManager.player2;
        }

        // Change the active player color icon
        gameManager.setActivePlayer(gameManager.currentPlayer);

        // Switch the hover symbol
        gameManager.board.registerHoverCellHandlers(gameManager.currentPlayer.symbol);
    };

    GameManager.prototype.loadWinnerScreen = function(gameManager, winnerSymbol) {
        $("body").html(gameManager.endGameScreen);

        var className;
        var message;

        if (winnerSymbol) {
            // If the board returns a winner, show the winner and get the correct class for the <div>
            message = "Winner";
            if (winnerSymbol === "O") {
                className = "screen-win-one";
            } else {
                className = "screen-win-two";
            }
        } else {
            // If the board has no winner, then it's a tie
            message = "It's a Tie!";
            className = "screen-win-tie";
        }

        // Set the message and the className
        $(".message").text(message);
        $("#finish").addClass(className);

        // Set the event listener for the new game button
        $(".button").click(function() {
            gameManager.gameSetup();
        });
    };

    return GameManager;

})(jQuery);