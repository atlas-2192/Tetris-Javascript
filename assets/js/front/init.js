/**
 * A JavaScript Tetris experiment
 *
 * Coded from scratch just for fun
 *
 * Available at https://github.com/levacic/js-tetris
 *
 * @author Miloš Levačić
 */

( function( $ ) {

	"use strict";

	var Tetris = ( function() {

			/**
			 * A variable that stores the ID of the scheduled interval for our
			 * `tick()` function - we need it so as to be able to pause and
			 * continue the game at will.
			 *
			 * @type {Number}
			 */
		var tickTimer = null,

			/**
			 * Configurable game speed settings
			 */

			MIN_GAME_SPEED = 1,
			MAX_GAME_SPEED = 10,

			/**
			 * The string length of the score to be displayed (the score will
			 * always be left-padded with 0s to this length).
			 *
			 * @type {Number}
			 */
			SCORE_LENGTH = 10,

			/**
			 * Some constants for handling the direction of movement.
			 *
			 * @type {Object}
			 */
			DIRECTION = {
				left: 0,
				up: 1,
				right: 2,
				down: 3
			},

			/**
			 * Keyboard key definitions (useful for comparing with e.keyCode in
			 * keyboard events).
			 *
			 * @type {Object}
			 */
			KEYS = {
				arrow: {
					left: 37,
					up: 38,
					right: 39,
					down: 40
				}
			},

			/**
			 * The current game speed.
			 *
			 * @type {Number}
			 */
			currentSpeed = 1,

			/**
			 * The current interval between consecutive `tick()` functions.
			 *
			 * @type {Number}
			 */
			currentInterval = 200,

			/**
			 * Dimensions for our game matrix
			 */

			GAME_ROWS = 20,
			GAME_COLUMNS = 10,

			/**
			 * The current state of our game. After initialization, this will
			 * be a matrix of `GAME_ROWS × GAME_COLS`, each being an object
			 * containing various data about the current state of that cell.
			 *
			 * @type {Array}
			 */
			gameMatrix = [],

			/**
			 * Definitions of all available game blocks. Each block is defined
			 * by its default color, as well as a boolean matrix representing
			 * the shape of the object. The shape matrix is always 16×16, to
			 * make it easier to deal with rotations (and all the blocks always
			 * fit into this matrix, regardless of their rotation).
			 *
			 * @type {Object}
			 */
			gameBlocks = {
				i: {
					color: "#0f0",
					states: [
						[
							[ 1, 1, 1, 1 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 0, 0, 0 ],
							[ 1, 0, 0, 0 ],
							[ 1, 0, 0, 0 ],
							[ 1, 0, 0, 0 ]
						]
					]
				},

				j: {
					color: "#f00",
					states: [
						[
							[ 1, 1, 1, 0 ],
							[ 0, 0, 1, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 0, 1, 0, 0 ],
							[ 0, 1, 0, 0 ],
							[ 1, 1, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 0, 0, 0 ],
							[ 1, 1, 1, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 1, 0, 0 ],
							[ 1, 0, 0, 0 ],
							[ 1, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						]
					]
				},

				l: {
					color: "#00f",
					states: [
						[
							[ 0, 0, 1, 0 ],
							[ 1, 1, 1, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 0, 0, 0 ],
							[ 1, 0, 0, 0 ],
							[ 1, 1, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 1, 1, 0 ],
							[ 1, 0, 0, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 1, 0, 0 ],
							[ 0, 1, 0, 0 ],
							[ 0, 1, 0, 0 ],
							[ 0, 0, 0, 0 ]
						]
					]
				},

				t: {
					color: "#00f",
					states: [
						[
							[ 0, 1, 0, 0 ],
							[ 1, 1, 1, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 0, 0, 0 ],
							[ 1, 1, 0, 0 ],
							[ 1, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 1, 1, 0 ],
							[ 0, 1, 0, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 0, 1, 0, 0 ],
							[ 1, 1, 0, 0 ],
							[ 0, 1, 0, 0 ],
							[ 0, 0, 0, 0 ]
						]
					]
				},

				s: {
					color: "#00f",
					states: [
						[
							[ 0, 1, 1, 0 ],
							[ 1, 1, 0, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 1, 0, 0, 0 ],
							[ 1, 1, 0, 0 ],
							[ 0, 1, 0, 0 ],
							[ 0, 0, 0, 0 ]
						]
					]
				},

				z: {
					color: "#00f",
					states: [
						[
							[ 1, 1, 0, 0 ],
							[ 0, 1, 1, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						],
						[
							[ 0, 1, 0, 0 ],
							[ 1, 1, 0, 0 ],
							[ 1, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						]
					]
				},

				o: {
					color: "#00f",
					states: [
						[
							[ 1, 1, 0, 0 ],
							[ 1, 1, 0, 0 ],
							[ 0, 0, 0, 0 ],
							[ 0, 0, 0, 0 ]
						]
					]
				}
			},

			/**
			 * The current game block. Includes properties such as the position
			 * of the block, the rotation, the color, as well as the actual
			 * matrix of the current block. The matrix could be deduced by
			 * referencing the `gameBlocks` variable and calculating the
			 * rotation, but it's easier to just cache that result here.
			 *
			 * @type {Object}
			 */
			currentBlock = null,

			/**
			 * The next game block. Used for displaying the next block in the
			 * game sidebar; the current block will be taken from here when
			 * needed.
			 *
			 * @type {Object}
			 */
			nextBlock = null,

			/**
			 * The current score.
			 *
			 * @type {Number}
			 */
			currentScore = 0,

			/**
			 * Returns a random block from the `gameBlocks` definitions.
			 *
			 * @return {Object}
			 */
			getRandomBlock = function() {
				var block, result, count = 0;

				for ( block in gameBlocks ) {
					if ( Math.random() < 1/++count ) {
						result = block;
					}
				}

				return result;
			},

			/**
			 * Gets a new random block, and defines some basic manipulative
			 * methods for it.
			 *
			 * @return {Object}
			 */
			getNewBlock = function() {
				var randomBlock = getRandomBlock(), block = {};

				block.type = randomBlock;

				block.position = {};
				block.position.x = 3;
				block.position.y = 0;

				block.rotation = 0;

				block.shape = gameBlocks[block.type].states[block.rotation];

				block.move = function( direction ) {
					switch ( direction ) {
						case DIRECTION.left:
							--this.position.x;
							break;

						case DIRECTION.up:
							--this.position.y;
							break;

						case DIRECTION.right:
							++this.position.x;
							break;

						case DIRECTION.down:
							++this.position.y;
							break;
					}
				}

				block.rotate = function() {
					++this.rotation;

					if ( this.rotation >= gameBlocks[this.type].states.length ) {
						this.rotation = 0;
					}

					this.shape = gameBlocks[this.type].states[this.rotation];
				}

				return block;
			},

			/**
			 * Checks whether a block overlaps something already in the game
			 * matrix.
			 *
			 * @param  {Object}  block
			 * @param  {Array}   gameMatrix
			 * @return {Boolean}
			 */
			blockOverlapsGameMatrix = function( block, gameMatrix ) {
				var i, j, currentRow, currentColumn;

				for ( i = 0; i < 4; i++ ) {
					for ( j = 0; j < 4; j++ ) {
						currentRow = block.position.y + i;
						currentColumn = block.position.x + j;

						if ( block.shape[i][j]
							&& gameMatrix[currentRow][currentColumn].blocked
						) {
							//console.log( "overlap: ", i, j, currentRow, currentColumn );
							return true;
						}
					}
				}

				return false;
			},

			/**
			 * Checks whether a block is in the game matrix our not (so we can
			 * detect when it tries to go out of it).
			 *
			 * @param  {Object}  block
			 * @param  {Array}   gameMatrix
			 * @return {Boolean}
			 */
			blockIsInGameMatrix = function( block, gameMatrix ) {
				var i, j, currentRow, currentColumn;

				for ( i = 0; i < 4; i++ ) {
					for ( j = 0; j < 4; j++ ) {
						currentRow = block.position.y + i;
						currentColumn = block.position.x + j;

						if ( block.shape[i][j]
							&& ( (currentRow > GAME_ROWS - 1)
								|| (currentColumn > GAME_COLUMNS - 1)
								|| (currentColumn < 0 )
							)
						) {
							//console.log( "out of bounds: ", i, j, currentRow, currentColumn );
							return false;
						}
					}
				}

				return true;
			},

			/**
			 * Checks whether a block can move down in the game matrix.
			 *
			 * @param  {Number}  direction
			 * @param  {Object}  block
			 * @param  {Array}   gameMatrix
			 * @return {Boolean}
			 */
			blockCanMove = function( direction, block, gameMatrix ) {
				var tmpBlock = $.extend( true, {}, block );

				tmpBlock.move( direction );

				if ( !blockIsInGameMatrix( tmpBlock, gameMatrix )
					|| blockOverlapsGameMatrix( tmpBlock, gameMatrix )
				) {
					return false;
				} else {
					return true;
				}
			},

			/**
			 * Checks whether a block can rotate in the game matrix.
			 *
			 * @param  {Object}  block
			 * @param  {Array}   gameMatrix
			 * @return {Boolean}
			 */
			blockCanRotate = function( block, gameMatrix ) {
				var tmpBlock = $.extend( true, {}, block );

				tmpBlock.rotate();

				if ( !blockIsInGameMatrix( tmpBlock, gameMatrix )
					|| blockOverlapsGameMatrix( tmpBlock, gameMatrix )
				) {
					return false;
				} else {
					return true;
				}
			},

			/**
			 * Checks if any rows in the game matrix are completed.
			 *
			 * @return {Boolean}
			 */
			gameMatrixHasCompletedRows = function() {
				var i, j, rowCompleted;

				for ( i = 0; i < GAME_ROWS; i++ ) {
					rowCompleted = true;

					for ( j = 0; j < GAME_COLUMNS; j++ ) {
						if ( !gameMatrix[i][j].blocked ) {
							rowCompleted = false;
						}
					}

					if ( rowCompleted ) {
						return true;
					}
				}

				return false;
			},

			/**
			 * Cleans the completed rows from the game matrix
			 *
			 * @return {void}
			 */
			gameMatrixCleanCompletedRows = function() {
				var i, j, rowCompleted,
					completedRows = 0;

				i = GAME_ROWS - 1;

				while ( i >= 0 ) {
					rowCompleted = true;

					for ( j = 0; j < GAME_COLUMNS; j++ ) {
						if ( !gameMatrix[i][j].blocked ) {
							rowCompleted = false;
						}
					}

					if ( rowCompleted ) {
						gameMatrixCleanRow( i );
						++completedRows;
					} else {
						--i;
					}
				}

				updateScore( completedRows );
			},

			/**
			 * Cleans a row in the game matrix by copying all the rows above it,
			 * and reseting the top-most row to default (empty) cells.
			 *
			 * @param  {Number} row
			 * @return {void}
			 */
			gameMatrixCleanRow = function( row ) {
				var i, j;

				for ( i = row; i > 0; i-- ) {
					gameMatrix[i] = $.extend( true, [], gameMatrix[i-1] );
				}

				for ( j = 0; j < GAME_COLUMNS; j++ ) {
					gameMatrix[0][j] = createDefaultCell();
				}
			},

			/**
			 * Calculates the current interval between calling the `tick()`
			 * functions.
			 *
			 * @param  {Number} speed
			 * @return {Number}
			 */
			calculateInterval = function( speed ) {
				return 1000 / speed;
			},

			/**
			 * Sets the current game speed to the passed speed.
			 *
			 * @param {Number} speed
			 */
			setSpeed = function( speed ) {
				if ( typeof speed !== "number" ) {
					throw new TypeError( "setSpeed expects a Number argument!" );
				}

				if ( speed < MIN_GAME_SPEED || speed > MAX_GAME_SPEED ) {
					throw new RangeError( "setSpeed only accepts speeds [1-10]!" );
				}

				currentSpeed = speed;
				currentInterval = calculateInterval( speed );

				restartTickTimer();
			},

			/**
			 * Returns a jQuery object containing the HTML element that
			 * represents the desired row/cell in the main tetris area.
			 *
			 * @param  {Number} row
			 * @param  {Number} column
			 * @return {Object}
			 */
			getHtmlCell = function( row, column ) {
				return $( 'div#tetris-container div.tetris-cell[data-row="' + row + '"][data-column="' + column + '"]' );
			},

			/**
			 * Returns a jQuery object containing the HTML element that
			 * represents the desired row/cell in the next block display area.
			 *
			 * @param  {Number} row
			 * @param  {Number} column
			 * @return {Object}
			 */
			getNextBlockHtmlCell = function( row, column ) {
				return $( 'div#tetris-next-block-container div.tetris-cell[data-row="' + row + '"][data-column="' + column + '"]' );
			},

			/**
			 * Renders the game matrix by manipulating the relevant HTML
			 * elements.
			 *
			 * @return {void}
			 */
			renderGameMatrix = function() {
				var i, j, currentCell, currentHtmlCell;

				for ( i = 0; i < GAME_ROWS; i++ ) {
					for ( j = 0; j < GAME_COLUMNS; j++ ) {
						currentCell = gameMatrix[i][j];
						currentHtmlCell = getHtmlCell( i, j );

						if ( currentCell.blocked ) {
							currentHtmlCell.attr( "data-blocked", "true" );
							currentHtmlCell.attr( "data-block-type", currentCell.type );
						} else {
							currentHtmlCell.removeAttr( "data-blocked" );
							currentHtmlCell.removeAttr( "data-block-type" );
						}
					}
				}
			},

			/**
			 * Renders the current block by manipulating the relevant HTML.
			 *
			 * @return {void}
			 */
			renderCurrentBlock = function() {
				var i, j, currentX, currentY, currentHtmlCell;

				/**
				 * If there is no current block, we'll just return. This is
				 * useful in the case of game over, since `currentBlock` will be
				 * set to `null` so we wouldn't render the failing block over
				 * blocks that are already rendered.
				 *
				 * We should later rewrite the code so new blocks start from
				 * above the game matrix, instead of at the top of it, enabling
				 * us to handle game over situations more gracefully.
				 */
				if ( currentBlock === null ) {
					return;
				}

				for ( i = 0; i < 4; i++ ) {
					for ( j = 0; j < 4; j++ ) {
						currentX = currentBlock.position.x + j;
						currentY = currentBlock.position.y + i;
						currentHtmlCell = getHtmlCell( currentY, currentX );

						if ( currentBlock.shape[i][j] ) {
							currentHtmlCell.attr( "data-blocked", "true" );
							currentHtmlCell.attr( "data-block-type", currentBlock.type );
						}
					}
				}
			},

			/**
			 * Renders the next block in the designated area in the sidebar.
			 *
			 * @return {void}
			 */
			renderNextBlock = function() {
				var i, j, currentHtmlCell;

				if ( nextBlock === null ) {
					return;
				}

				for ( i = 0; i < 4; i++ ) {
					for ( j = 0; j < 4; j++ ) {
						currentHtmlCell = getNextBlockHtmlCell( i, j );

						if ( nextBlock.shape[i][j] ) {
							currentHtmlCell.attr( "data-blocked", "true" );
							currentHtmlCell.attr( "data-block-type", nextBlock.type );
						} else {
							currentHtmlCell.removeAttr( "data-blocked" );
							currentHtmlCell.removeAttr( "data-block-type" );
						}
					}
				}
			},

			/**
			 * Renders the current game state depending on the `gameMatrix` and
			 * the `currentBlock`.
			 *
			 * @return {void}
			 */
			renderCurrentState = function() {
				renderGameMatrix();
				renderCurrentBlock();
				renderNextBlock();
			},

			/**
			 * Updates the gameMatrix by copying the current block into the
			 * matrix itself - also copies the block type, so we would have the
			 * correct colors in the built matrix.
			 *
			 * @return {void}
			 */
			updateGameMatrix = function() {
				var i, j, currentRow, currentColumn;

				for ( i = 0; i < 4; i++ ) {
					for ( j = 0; j < 4; j++ ) {
						currentRow = currentBlock.position.y + i;
						currentColumn = currentBlock.position.x + j;

						if ( gameMatrix[currentRow]
							&& gameMatrix[currentRow][currentColumn]
							&& !gameMatrix[currentRow][currentColumn].blocked
							&& currentBlock.shape[i][j]
						) {
							gameMatrix[currentRow][currentColumn].blocked = true;
							gameMatrix[currentRow][currentColumn].type = currentBlock.type;
						}
					}
				}
			},

			/**
			 * Updates the current score and displays it, based on the number of
			 * rows cleaned.
			 *
			 * At the moment the score is updated by adding *row thousand*
			 * points to it, but it will be updated in the future to add more
			 * points for more rows cleaned at once.
			 *
			 * @param  {Number} rows
			 * @return {void}
			 */
			updateScore = function( rows ) {
				currentScore += rows * 1000;
				showScore();
			},

			/**
			 * Displays the overlay HTML element.
			 *
			 * @return {void}
			 */
			showOverlay = function() {
				$( "#tetris-overlay" ).show();
			},

			/**
			 * Hides the overlay HTML element.
			 *
			 * @return {void}
			 */
			hideOverlay = function() {
				$( "#tetris-overlay" ).hide();
			},

			/**
			 * Sets a custom message to the relevant HTML element, and shows the
			 * overlay HTML element (thus, display the message contained within
			 * it as well).
			 *
			 * @param  {String} message
			 * @return {void}
			 */
			showMessage = function( message ) {
				$( "#tetris-message" ).text( message );
				showOverlay();
			},

			/**
			 * Formats a score by left-padding it with 0s to the desired length,
			 * configurable by `SCORE_LENGTH`.
			 *
			 * @param  {Number} score
			 * @return {String}
			 */
			formatScore = function( score ) {
				var scoreString = score.toString();

				while ( scoreString.length < SCORE_LENGTH ) {
					scoreString = "0" + scoreString;
				}

				return scoreString;
			},

			/**
			 * Shows the formatted current score in the HTML element designated
			 * for that.
			 *
			 * @return {void}
			 */
			showScore = function() {
				$( "#tetris-current-score" ).text( formatScore( currentScore ) );
			},

			/**
			 * Performs all the work for each "tick" of the game - calculates
			 * collisions, moves pieces, checks for completed lines, etc.
			 *
			 * @return {void}
			 */
			tick = function() {
				if ( blockCanMove( DIRECTION.down, currentBlock, gameMatrix ) ) {
					currentBlock.move( DIRECTION.down );
				} else {
					updateGameMatrix();

					if ( gameMatrixHasCompletedRows() ) {
						gameMatrixCleanCompletedRows();
					}

					currentBlock = nextBlock;
					nextBlock = getNewBlock();

					if ( blockOverlapsGameMatrix( currentBlock, gameMatrix ) ) {
						triggerGameOver();
						currentBlock = null;
					}
				}

				renderCurrentState();
			},

			/**
			 * A wrapper for the `tick()` function, so we can easily catch all
			 * exceptions thrown on each tick.
			 *
			 * @return {void}
			 */
			doTick = function() {
				try {
					tick();
				} catch( exception ) {
					pauseGame();
					console.log( exception, exception.message );
				}
			},

			/**
			 * This is called when the game is lost - at the moment, it just
			 * stops the game from updating on each tick, but it will be updated
			 * later, along with the interface, to display a game over message
			 * to the user.
			 *
			 * @return {void}
			 */
			triggerGameOver = function() {
				stopTickTimer();
				showMessage( "GAME OVER" );
			},

			/**
			 * Stops the tick timer currently running.
			 *
			 * @return {void}
			 */
			stopTickTimer = function() {
				clearInterval( tickTimer );
			},

			/**
			 * Starts the tick timer by setting an interval (uses the current
			 * value of the currentInterval variable).
			 *
			 * @return {void}
			 */
			startTickTimer = function() {
				tickTimer = setInterval( doTick, currentInterval );
			},

			/**
			 * Restarts the tick timer currently running. Useful for when
			 * something happens that should result in the current interval
			 * seemingly being paused for a moment.
			 *
			 * @return {void}
			 */
			restartTickTimer = function() {
				stopTickTimer();
				startTickTimer();
			},

			/**
			 * Pauses the game.
			 *
			 * @return {void}
			 */
			pauseGame = function() {
				stopTickTimer();
				showMessage( "PAUSED" );
			},

			/**
			 * Starts, or continues, the game, by scheduling the `tick()`
			 * function to run at a regular interval.
			 *
			 * @return {void}
			 */
			startGame = function() {
				startTickTimer();
				hideOverlay();
			},

			/**
			 * Returns an object representing a single cell in the game matrix,
			 * with each of the pertinent properties set to a sane default
			 * value.
			 *
			 * @return {Object}
			 */
			createDefaultCell = function() {
				return {
					blocked: false,
					type: null
				};
			},

			/**
			 * Initializes the main game matrix by iterating through all the
			 * cells and initializing them to a default state.
			 *
			 * @return {void}
			 */
			initializeGameMatrix = function() {
				var i, j;

				for ( i = 0; i < GAME_ROWS; i++ ) {
					gameMatrix[i] = [];

					for ( j = 0; j < GAME_COLUMNS; j++ ) {
						gameMatrix[i][j] = createDefaultCell();
					}
				}
			},

			/**
			 * Initializes the current block, so we wouldn't have to check for
			 * its existance on each `tick()` call.
			 *
			 * @return {void}
			 */
			initializeCurrentBlock = function() {
				currentBlock = getNewBlock();
			},

			/**
			 * Initializes the next block - should be called at the start of the
			 * game.
			 *
			 * @return {void}
			 */
			initializeNextBlock = function() {
				nextBlock = getNewBlock();
			},

			handleKeyboardMovement = function( keyCode ) {
				switch ( keyCode ) {
					case KEYS.arrow.left:
						if ( blockCanMove( DIRECTION.left, currentBlock, gameMatrix ) ) {
							currentBlock.move( DIRECTION.left );
							renderCurrentState();
							restartTickTimer();
						}
						break;

					case KEYS.arrow.right:
						if ( blockCanMove( DIRECTION.right, currentBlock, gameMatrix ) ) {
							currentBlock.move( DIRECTION.right );
							renderCurrentState();
							restartTickTimer();
						}
						break;

					case KEYS.arrow.up:
						if ( blockCanRotate( currentBlock, gameMatrix ) ) {
							currentBlock.rotate();
							renderCurrentState();
							restartTickTimer();
						}
						break;

					case KEYS.arrow.down:
						while ( blockCanMove( DIRECTION.down, currentBlock, gameMatrix ) ) {
							currentBlock.move( DIRECTION.down );
						}

						renderCurrentState();
						restartTickTimer();
						break;
				}
			},

			/**
			 * Initializes arrow key bindings for controlling the game.
			 *
			 * @return {void}
			 */
			initializeKeyboardControls = function() {
				$( document ).on( "keydown", function( e ) {
					var keyCode = e.keyCode || e.which;

					switch ( keyCode ) {
						case KEYS.arrow.left:
						case KEYS.arrow.up:
						case KEYS.arrow.right:
						case KEYS.arrow.down:
							e.preventDefault();
							handleKeyboardMovement( keyCode );
							break;
					}
				} );
			},

			/**
			 * Prepares all the data to start running the game.
			 *
			 * @return {void}
			 */
			initializeGame = function() {
				initializeGameMatrix();
				initializeCurrentBlock();
				initializeNextBlock();
				initializeKeyboardControls();

				console.log( "initialized" );
			};

		return {
			/**
			 * The public interface only has one initialization function, since
			 * it doesn't really need anything else.
			 *
			 * @return {void}
			 */
			init: function() {
				$( "#tetris-pause" ).on( "click", function( e ) {
					e.preventDefault();

					pauseGame();
				});

				$( "#tetris-continue" ).on( "click", function( e ) {
					e.preventDefault();

					startGame();
				});

				initializeGame();
				startGame();
			}
		}

	}() );

	$( document ).on( "ready", function() {
		Tetris.init();
	});

} )( jQuery );

