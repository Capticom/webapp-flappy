// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};
var score;
var player
score = 0;
var labelScore;
var pipes = [];
var robots = [];
var splashDisplay;
var gapSize = 250;
var gapMargin = 200;
var blockHeight = 50;
var bullets = [];
var backgroundWidth = 790;
var gameSpeed = 10;

var background1, background2;

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

jQuery("#greeting-form").on("submit", function (event_details) {
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
    game.load.image("pipe", "../assets/block.png");
    game.load.audio("acdc", "../assets/acdc.mp3");
    game.load.image("robot", "../assets/robot.png");
    game.load.image("skyscrapers", "../assets/skyscrapers.png");
    game.load.image("balls", "../assets/balls.png");
}

/*
 * Initialises the game. This function is only called once.
 */


function create() {
    // set the background colour of the scene
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(start);


    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 791;
    background.height = 401;
    game.add.sprite(30, 145, "titlewriting");

    splashDisplay = game.add.text(33, 250, "Press SPACEBAR to start", {fill: "#CC9900"});
    splashDisplay = game.add.text(33, 300, "Press P to pause", {fill: "#CC9900"});

}

function start() {

    score = 0
    $("#die").hide();
    game.sound.play("booster");
    splashDisplay.destroy();

    addBackground();

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.removeAll();

    labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#FFFFFF"});


    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    game.input
        .keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(balls);

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

    //generatePipe();
    pipeInterval = 1.50;
    if(game.paused == false) {game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generate);}

}

function balls() {
    var oneBullet = game.add.sprite(player.x, player.y, "balls");
    bullets.push(oneBullet);
    game.physics.arcade.enable(oneBullet);
    oneBullet.body.velocity.x = 300;
    oneBullet.body.velocity.y = 0;
}

function addBackground() {
    background1 = game.add.sprite(0, 0, "skyscrapers");
    background1.width = game.width;
    background1.height = game.height;

    background2 = game.add.sprite(game.width, 0, "skyscrapers");
    background2.width = game.width;
    background2.height = game.height;

    game.physics.arcade.enable(background1);
    game.physics.arcade.enable(background2);

    background1.body.velocity.x = -20;
    background2.body.velocity.x = background1.body.velocity.x;
}

function checkBackground(background) {
    if (background.x <= -background.width) {
        background.x = game.width;
    }
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 3);
    if (diceRoll == 1) {
        generateRobots();
    } else {
        generatePipe();
    }
}

function generatePipe() {
    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for (var y = gapStart; y > 0; y -= blockHeight) {
        addPipeBlock(width, y - blockHeight);
    }
    for (var y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }
    changeScore();
}

function generateRobots() {
    var y = game.rnd.integerInRange(50, 300);
    var bonus = game.add.sprite(width, y, "robot");
    robots.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -400;
    bonus.body.velocity.y = 0
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
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


function playerJump() {
    player.body.velocity.y = -300;
    game.sound.play("booster");

}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {


    if (background1 != undefined) {
        checkBackground(background1);
        checkBackground(background2);
    }


    if (player == undefined) {
        return;
    }


    if (player.y < 000 || player.y > 400) {
        gameOver();
    }





    player.rotation = Math.atan(player.body.velocity.y / 1000);

    game.physics.arcade.overlap(player, pipes, gameOver);
    game.physics.arcade.overlap(player,  robots, gameOver);


    for (var i = 0; i < pipes.length; i++) {
        for (var j = 0; j < bullets.length; j++) {
            game.physics.arcade.overlap(pipes[i], bullets[j],function () {
                bullets[j].kill();
                changeScore ()

            });
        }
    }
    for (var i = 0; i < bullets.length; i++) {
        for (var j = 0; j < robots.length; j++) {
            game.physics.arcade.overlap(bullets[i], robots[j],function () {
                bullets[j].kill();
                robots[j].kill();
                console.log("Robot down")
                changeScore()
            });
        }
    }




}

function restart() {

    pipes.splice(0,pipes.length);
    robots.splice(0,robots.length);
    bullets.splice(0,bullets.length);

    start();
    game.paused = false;

}


function gameOver() {

    $("#die").show();
    $("#score").val(score.toString());


    game.paused = true;

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(restart);




}

$.get("/score", function (scores) {
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 3; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }




})
/**
 * Created by Thomas on 23/07/15.
 */
