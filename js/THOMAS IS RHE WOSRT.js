// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };
var score;
var player;
score = 0;
var labelScore;
var pipes = [];
var robots = [];
var splashDisplay;
var gapSize = 100;
var gapMargin = 200;
var blockHeight = 50;
var backgroungVelocity = 50
var height = 400;
var width = 790;

var pipeInterval;

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 */

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    //var timeInterval = ;
        $("#greeting").fadeOut(2500);




  //  event_details.preventDefault();
});


function preload() {
    game.load.image("playerImg", "../assets/ironman-flying.png");
    game.load.image("backgroundImg", "../assets/ironman-face.jpg");
    game.load.image("titlewriting", "../assets/Iron-Man-Poster.png");
    game.load.audio("booster", "../assets/iron man.mp3");
    game.load.image("pausescreen", "../assets/iron-man-hands.jpg");
    game.load.image("stark-tower", "../assets/Stark-Tower.jpg");
    game.load.image("pipe","../assets/block.png");
    game.load.audio("acdc", "../assets/acdc.mp3");
    game.load.image("robot", "../assets/robot.png");
    game.load.image("skyscraper", "../assets/skyscraper.jpg")
}

/*
 * Initialises the game. This function is only called once.
 */



function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#000000");
    splashDisplay = game.add.text(100,200, "Press SPACEBAR to start");



    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(start);


   /* var background = game.add.image(0, 0, "backgroundImg");
    background.width = 791;
    background.height = 401;
    game.add.sprite(30, 145, "titlewriting");*/





    var backgroungVelocity = gameSpeed / 10;
    var background1 = game.add.sprite(0, 0, "skyscraper");
    game.physics.arcade.enable(background1);
    background1.body.velocity.x = -50;

    var background2 = game.add.sprite(790,0, "skyscraper");
    game.physics.arcade.enable(background2);
    background2.body.velocity.x = -50;

    game.time.events.loop((790 / -50) * Phaser.Timer.SECOND, function(){
        var background = game.add.sprite(backgroundWidth, 0, "backgroundImg");
        game.physics.arcade.enable(background);
        background.body.velocity.x = -50;
    });


function start() {

    //game.paused = False
    var background = game.add.image(0, 0, "stark-tower");
    background.width = 791;
    background.height = 401;
    game.sound.play("booster");
    splashDisplay.destroy();


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

    game.input
        .keyboard.addKey(Phaser.Keyboard.P)
        .onDown.add(pauseON);


    player = game.add.sprite(100, 200, "playerImg");
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.gravity.y = 700;
    player.anchor.setTo(0.5, 0.5);

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
        generate);

}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 3);
    if(diceRoll==1) {
        generateRobots();
    } else {
        generatePipe();
    }
}

function spaceHandler() {
    game.sound.play("booster");
}
function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);
    console.log(gapStart);

    for(var y=gapStart; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    for(var y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    changeScore();
}

function generateRobots(){
    var y = game.rnd.integerInRange(50,300);
    var bonus = game.add.sprite(width, y, "robot");
    robots.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -400;
    bonus.body.velocity.y = 0
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -400;


}

function pauseON(event) {
    game.paused = !game.paused;
    $("#pausemessage").toggle();

}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());

}


function playerJump(){
    player.body.velocity.y = -300;

}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {




    if (player == undefined) {
        return;
    }


    game.physics.arcade.overlap(player,
        pipes,
        gameOver);
    //}

    if (player.y < 000 || player.y > 400) {
        gameOver();
    }

    player.rotation = Math.atan(player.body.velocity.y / 1000);


}



function gameOver() {

    $("#greeting").show();
    $("#score").val(score.toString());

    //game.state.restart();

    //gameOver();
    game.destroy();

    //location.reload();


}

$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 3; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});