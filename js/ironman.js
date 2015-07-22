// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score;
var player;
score = 0;
var labelScore;
var pipes = [];
var pipeTimer;

/*var count = 0;*/

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("playerImg", "../assets/ironman-flying.png");
    game.load.image("backgroundImg", "../assets/ironman-face.jpg");
    game.load.image("titlewriting", "../assets/Iron-Man-Poster.png");
    game.load.audio("booster", "../assets/iron man.mp3");
    game.load.image("pausescreen", "../assets/iron-man-hands.jpg");
    game.load.image("stark-tower", "../assets/Stark-Tower.jpg");
    game.load.image("pipe","../assets/block.png");
    game.load.audio("acdc", "../assets/acdc.mp3");
}

/*
 * Initialises the game. This function is only called once.
 */



function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#000000");

    game.sound.play("acdc");

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(start);


    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 791;
    background.height = 401;
    game.add.sprite(30, 145, "titlewriting");


    game.input
        .onDown
        .add(clickHandler);

}

function start() {



    var background = game.add.image(0, 0, "stark-tower");
    background.width = 791;
    background.height = 401;
    game.sound.play("booster");




    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.removeAll();

    labelScore = game.add.text(20, 20, "0",{font: "30px Arial", fill: "#FFFFFF"});



    /*game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
*/
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);



    player = game.add.sprite(100, 200, "playerImg");
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.gravity.y = 600;

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);

    //generatePipe();
    pipeInterval = 1.50;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
    generatePipe);

}

function spaceHandler() {
    game.sound.play("booster");
}
function generatePipe() {
    var gap = game.rnd.integerInRange(1 ,5);
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap+1) {
            addPipeBlock(750, count * 50);
        }
    }
    changeScore();
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -260;


}

function clickHandler(event) {
    /* count ++;
     if (Math)*/
    var background = game.add.image(0, 0, "pausescreen");
    background.width = 791;
    background.height = 401;

    pause();

}


function pause() {

    for(var i = 0; i < pipes.length; i++){
        pipes[i].body.velocity.x = 0;

    }
    player.body.velocity.y = 0;
    player.body.gravity.y = 0;




}

function resume() {
    //TODO
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());

}
function moveLeft() {
    player.x++
}

function moveRight() {
    player.x--

}

function moveUp() {
    player.y--

}

function moveDown() {
    player.y++

}



function playerJump(){
    player.body.velocity.y = -250;

}


/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    //for(var index=0; index<pipes.length; index++){
        game.physics.arcade.overlap(player,
        pipes,
        gameOver);
    //}
}

function gameOver() {
    location.reload();
}