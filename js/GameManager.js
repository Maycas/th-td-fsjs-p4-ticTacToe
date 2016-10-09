/**
 * GameManager object
 * @namespace Module
 * @author: Marc Maycas <marc.maycas@gmail.com>
 *
 * @param {object} $        - jQuery library
 * @param {object} module   - Main global variable module
 * 
 * @property {object} player1       - Player 1 object
 * @property {object} player2       - Player 2 object
 * @property {object} currentPlayer - Current player that has to perform the next move
 * @property {object} board         - Board that's being played
 * @property {string} startScreen   - HTML template of the start screen
 * @property {string} gameScreen    - HTML template of the game screen
 * @property {string} endGameScreen - HTML template of the end game screen
 *  
 * @returns {object} module.GameManager
 */

var Module = (function ($, module) {

    'use strict';

    /**
     * Game Manager constructor
     * @constructor
     */
    function GameManager() {
        this.player1 = undefined;
        this.player2 = undefined;
        this.currentPlayer = undefined;
        this.board = undefined;

        this.startScreen = '<div class="screen screen-start" id="start"> <header> <h1>Tic Tac Toe</h1> <form> <div id="mode-select"> <a href="#" class="button player-select" id="single-player">Single player</a> <a href="#" class="button player-select" id="multiplayer">Multiplayer</a> </div> <div id="player-1"> <label for="player-input-1">Player 1</label> <input type="text" id="player-input-1" placeholder="Enter player name"> </div> <div id="player-2"> <label for="player-input-2">Player 2</label> <input type="text" id="player-input-2" placeholder="Enter player name"> </div> <div id="difficulty-selector"> <label for="level-selector">Level</label> <select id="level-selector"> <option value="easy">Easy</option> <option value="impossible">Impossible</option> </select> </div> </form> <a href="#" class="button" id="start-game">Start game</a> <a href="#" id="back">&lt;&lt; Back to Mode select</a> </header> </div>';

        this.gameScreen = '<div class="board" id="board"> <header> <h1>Tic Tac Toe</h1> <ul> <li class="players" id="player1"> <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-200.000000, -60.000000)" fill="#000000"><g transform="translate(200.000000, 60.000000)"><path d="M21 36.6L21 36.6C29.6 36.6 36.6 29.6 36.6 21 36.6 12.4 29.6 5.4 21 5.4 12.4 5.4 5.4 12.4 5.4 21 5.4 29.6 12.4 36.6 21 36.6L21 36.6ZM21 42L21 42C9.4 42 0 32.6 0 21 0 9.4 9.4 0 21 0 32.6 0 42 9.4 42 21 42 32.6 32.6 42 21 42L21 42Z"/></g></g></g></svg> <span></span> </li> <li class="players" id="player2"> <svg xmlns="http://www.w3.org/2000/svg" width="42" height="43" viewBox="0 0 42 43" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-718.000000, -60.000000)" fill="#000000"><g transform="translate(739.500000, 81.500000) rotate(-45.000000) translate(-739.500000, -81.500000) translate(712.000000, 54.000000)"><path d="M30 30.1L30 52.5C30 53.6 29.1 54.5 28 54.5L25.5 54.5C24.4 54.5 23.5 53.6 23.5 52.5L23.5 30.1 2 30.1C0.9 30.1 0 29.2 0 28.1L0 25.6C0 24.5 0.9 23.6 2 23.6L23.5 23.6 23.5 2.1C23.5 1 24.4 0.1 25.5 0.1L28 0.1C29.1 0.1 30 1 30 2.1L30 23.6 52.4 23.6C53.5 23.6 54.4 24.5 54.4 25.6L54.4 28.1C54.4 29.2 53.5 30.1 52.4 30.1L30 30.1Z"/></g></g></g></svg> <span></span> </li> </ul> </header> <ul class="boxes"> <li class="box"></li> <li class="box"></li> <li class="box"></li> <li class="box"></li> <li class="box"></li> <li class="box"></li> <li class="box"></li> <li class="box"></li> <li class="box"></li> </ul> </div>';

        this.endGameScreen = '<div class="screen screen-win" id="finish"><header><h1>Tic Tac Toe</h1><p class="message"></p><a href="#" class="button">New game</a></header></div>';
    }

    /**
     * Initializes the game by setting the start screen template and logic
     */
    GameManager.prototype.init = function () {
        // Load the game screen screen
        $("body").html(this.startScreen);

        // When page loads hide everything except the buttons to select the game mode
        $("#player-1, #player-2, #difficulty-selector, #start-game, #back").hide();

        // When clicking single player mode, allow user to put his name only because he/she is playing against the computer
        $("#single-player").on("click", function () {
            $("#mode-select").hide();
            $("#player-1, #difficulty-selector, #start-game, #back").show();
        });

        // When clicking multiplayer, both players can set their names
        $("#multiplayer").on("click", function () {
            $("#mode-select").hide();
            $("#player-1, #player-2, #start-game, #back").show();
        });

        // If the user wants to go back, hide everything and show only the game modes and reset the fields values in case they were half filled in
        $("#back").on("click", function () {
            $("#player-1, #player-2, #difficulty-selector, #start-game, #back").hide();
            $("#mode-select").show();

            $("#player-input-1").val("");
            $("#player-input-2").val("");
        });

        // Register the event handler for the start game button, which takes to the game screen
        $("#start-game").on("click", {
            gameManager: this
        }, function (event) {
            var gameManager = event.data.gameManager;

            // Get the info from the players in the init screen
            gameManager.setPlayerInfo(gameManager);

            // Load the game screen
            gameManager.gameSetup();
        });
    };

    /**
     * Sets the player information depending on the data introduced by the user in the start screen
     * 
     * @param {object} gameManager  - Reference to the existing game manager
     */
    GameManager.prototype.setPlayerInfo = function (gameManager) {
        // Get name for player 1
        var playerOneName = $("#player-input-1").val();
        if (playerOneName === "") {
            // Set a generic name if the value is blank
            playerOneName = "Player 1";
        }

        // Get name for player 2
        var playerTwoName = $("#player-input-2").val();
        var playerTwoIsComputer = false;

        // If the player 2 name is empty and the player has selected multiplayer (#player-2 is visible) 
        if (playerTwoName === "" && $("#player-2").is(":visible")) {
            // Set a generic name for playerTwo
            playerTwoName = "Player 2";
        } else if (playerTwoName === "" && !$("#player-2").is(":visible")) {
            // If player's 2 name is empty and the user has selected a single player mode (#player-2 is not visible)
            // Play against computer, give computer a generic name and inform that the computer will play the game
            playerTwoName = "Computer";
            playerTwoIsComputer = true;
        }

        // Get the difficulty level
        var level = $("#level-selector").val();

        // Create the players for the game
        gameManager.player1 = new module.Player("O", playerOneName, false);
        gameManager.player2 = new module.Player("X", playerTwoName, playerTwoIsComputer, level);
    };

    /**
     * Loads the game screen and sets the names of the players
     */
    GameManager.prototype.loadGameScreen = function () {
        // Load the game screen
        $("body").html(this.gameScreen);

        // Set the player names inside the placeholders
        $("#player1 span").html(this.player1.playerName);
        $("#player2 span").html(this.player2.playerName);
    };

    /**
     * Setups the game and creates the necessary objects and event listeners to start playing
     */
    GameManager.prototype.gameSetup = function () {
        // Load the game screen
        this.loadGameScreen();

        // Define the first player to start based on a random algorithm
        this.currentPlayer = this.setRandomInitPlayer();
        this.setActivePlayer(this.currentPlayer);

        // Create the board
        var $grid = $(".boxes");
        this.board = new module.Board($grid);
        this.board.registerClickCellHandlers();
        this.board.registerHoverCellHandlers(this.currentPlayer.symbol);

        // Register an event listener for the "cellSelect" event
        $(this.board.placeholder).on("cellClick", {
            gameManager: this
        }, this.cellClickHandler);

        // If the current start player is a computer, force to move first and take the center, which
        // is the most important cell of the game
        if (this.currentPlayer.isComputer) {
            this.currentPlayer.makeMove(this);
        }

    };

    /**
     * Handler to be executed when a cell is clickedCell
     * It sets and displays the specific symbol in the clicked cell, checks if there's a winner and in case there's a winner
     * loads the winner screen or switches the player so the game can continue
     * 
     * @param {object} event        - Event object 
     * @param {object} clickedCell  - Cell that has been clicked
     */
    GameManager.prototype.cellClickHandler = function (event, clickedCell) {
        // Get the reference of the Game Manager
        var gameManager = event.data.gameManager;

        // Get the reference to the board
        var board = gameManager.board;

        // Get the reference of the current player;
        var currentPlayer = gameManager.currentPlayer;

        // Get the clicked cell position
        var move = clickedCell.position;

        // Set current player's symbol in the cell and show it
        board.cells[move[0]][move[1]].setSymbol(currentPlayer.symbol);
        board.cells[move[0]][move[1]].displaySymbolInCell();

        // Check if there's a winner
        if (board.checkWinner(move) || board.getEmptyCells().length === 0) {
            // Load the winner screen in case there's a winner
            var winner = board.checkWinner(move);
            gameManager.loadWinnerScreen(gameManager, winner);
        } else {
            // If there's no winner toggle the player
            gameManager.togglePlayer(gameManager);
            // If the new player is a computer, calculate the new move and apply it
            if (gameManager.currentPlayer.isComputer) {
                gameManager.currentPlayer.makeMove(gameManager, move);
            }
        }
    };

    /**
     * Returns a player randomly
     * 
     * @returns {object}    - The selected player based on a random selection
     */
    GameManager.prototype.setRandomInitPlayer = function () {
        if (Math.random() < 0.5) {
            return this.player1;
        }
        return this.player2;
    };

    /**
     * Shows what's the current player's turn
     * 
     * @param {object} currentPlayer    - The player that holds the game turn 
     */
    GameManager.prototype.setActivePlayer = function (currentPlayer) {
        $(".active").removeClass("active");
        if (currentPlayer.symbol === "O") {
            $("#player1").addClass("active");
        } else {
            $("#player2").addClass("active");
        }
    };

    /**
     * Switches the player turn and shows that info in the screen 
     * 
     * @param {object} gameManager  - Instance of the game manager that's controlling the game
     */
    GameManager.prototype.togglePlayer = function (gameManager)  {
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

    /**
     * Loads the winner screen (HTML and event listeners) and sets the specific messages
     * 
     * @param {object} gameManager  - Instance of the game manager that's controlling the game
     * @param {string} winnerSymbol - String representing the winner. It can be "X", "O" or " " (tie)
     */
    GameManager.prototype.loadWinnerScreen = function (gameManager, winnerSymbol) {
        // Load win screen
        $("body").html(gameManager.endGameScreen);

        var className;
        var message;

        if (winnerSymbol) {
            // If the board returns a winner, show the winner and get the correct class for the <div>
            message = gameManager.currentPlayer.playerName + " wins!";
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
        $(".button").click(function () {
            gameManager.gameSetup();
        });
    };

    module.GameManager = GameManager;

    return module;

})(jQuery, Module || {});