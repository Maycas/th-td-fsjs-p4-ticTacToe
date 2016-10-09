/**
 * Main autoexecutable function for Tic-Tac-Toe
 * Declares the Game Manager from the main module and starts it
 * @author: Marc Maycas <marc.maycas@gmail.com>
 */

! function ($, Module) {

  'use strict';

  // Instantiate the game manager and initialize it
  var gm = new Module.GameManager();
  gm.init();


}(jQuery, Module);