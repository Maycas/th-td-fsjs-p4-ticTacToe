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

    return Player;

})(jQuery);