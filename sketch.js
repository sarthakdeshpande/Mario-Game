//Declaring variables for every object
var mario, mario_running, mario_collided;
var bg, bgImg, ground;
var brickGroup, brickImg, coinsAnim, coinsGroup;
var jumpSound, coinSound, dieSound;
var mushAnim, turtleAnim, obstaclesGroup;
var score = 0;
var gameState = "PLAY";
var restart,restartImg;

//funcion preload to all assects
function preload() {
    //loading animation fot mario
    mario_running = loadAnimation("images/mar1.png",
        "images/mar2.png",
        "images/mar3.png",
        "images/mar4.png",
        "images/mar5.png",
        "images/mar6.png",
        "images/mar7.png")
    mario_collided=loadAnimation("images/dead.png")    
    //loading image for brick and background    
    bgImg = loadImage("./images/bgnew.jpg")
    brickImg = loadImage("images/brick.png");

    restartImg = loadImage("images/restart.png")

    //animation for coins
    coinsAnim = loadAnimation(
        "images/con1.png",
        "images/con2.png",
        "images/con3.png",
        "images/con4.png",
        "images/con5.png",
        "images/con6.png");

    //loading sounds fro different events
    jumpSound = loadSound("sounds/jump.mp3")
    coinSound = loadSound("sounds/coinSound.mp3")
    dieSound = loadSound("sounds/dieSound.mp3")

    //animations for the obstacles
    mushAnim = loadAnimation("images/mush1.png", "images/mush2.png", "images/mush3.png", "images/mush4.png", "images/mush5.png", "images/mush6.png")
    turtleAnim = loadAnimation("images/tur1.png", "images/tur2.png", "images/tur2.png", "images/tur3.png", "images/tur4.png", "images/tur5.png")

    
}

//setup function for placing objects on screen
function setup() {

    //size of the game screen
    createCanvas(1000, 600);

    //giving the background an animation
    bg = createSprite(500, 300, 1000, 600);
    bg.addImage(bgImg);
    bg.scale = 0.5;
    bg.velocityX = -(8 + score/10);

    //adding player sprite to the game
    mario = createSprite(100, 500, 50, 50);
    mario.addAnimation("running", mario_running);
    mario.addAnimation("collided",mario_collided);
    
    mario.scale = 0.25;
     // mario.debug = true;

    //creating invisible ground
    ground = createSprite(500, 580, 1000, 5);
    ground.visible = false;

    //creating edges to the canavs
    edges = createEdgeSprites();
    
    //creating groups 
    brickGroup = new Group();
    coinsGroup = new Group();
    obstaclesGroup = new Group();

    //creating the restart button
    restart = createSprite(500,300,100,50);
    restart.addImage(restartImg);
    restart.scale=0.5;
    restart.visible= false;
}

//function draw for setting properties of your character
function draw() {
    if(mousePressedOver(restart)&&restart.visible==true){
        restartGame();
    }
   if(gameState==="PLAY"){
        //making the mario jump when space is pressed
    if (keyWentDown('space')) {
        jumpSound.play();
        mario.velocityY = -16;
    }
    mario.velocityY += 0.3;
    mario.collide(ground);

    //maing background recreate
    if (bg.x < 100) {
        bg.x = 600;
    }

    //avoiding mario to go out of the screen
    if (mario.x < 100) {
        mario.x = 100;
    }
    if (mario.y < 50) {
        mario.y = 50;
    }

    //calling the functions
    generateBricks();
    generateObstacles();
    generateCoins();

    //making only one object of the group destory if mario touches it
    for (var i = 0; i < brickGroup.length; i++) {
        var temp = brickGroup.get(i)
        if (temp.isTouching(mario)) {
            mario.collide(temp);
        }
    }

    for (var i = 0; i < coinsGroup.length; i++) {
        var temp = coinsGroup.get(i);
        if (mario.isTouching(temp)) {
            temp.destroy();
            //adding score
            score++
            coinSound.play();
        }
    }
   
    for (var i = 0; i < obstaclesGroup.length; i++) {
        var temp = obstaclesGroup.get(i);
        if (mario.isTouching(temp)) {
            temp.destroy();
            gameState="END";
            dieSound.play();
        }
    }
    
}
else if(gameState==="END"){
    mario.velocityX=0;
    mario.velocityY=0;
    mario.changeAnimation('collided',mario_collided);
    mario.y=550;
    bg.velocityX=0;
    obstaclesGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    score=0;
    restart.visible=true;
    
}


    //adding drawsprites to draw the sprites on the screen
    drawSprites();

    //giving color and size to the text
    fill("black");
    textSize(25);
    text("Coins: " + score, 100, 100);
   
}

function generateBricks() {
    if (frameCount % 110 === 0) {
        bricks = createSprite(1100, random(250, 450), 100, 50);
        bricks.addImage(brickImg);
        bricks.velocityX =-(8 + score/10);
        bricks.depth=1;
        brickGroup.add(bricks);
        bricks.lifetime = 250;
    }
}

function generateCoins() {
    if (frameCount % 70 === 0) {
        var coins = createSprite(1200, random(250, 450), 20, 20);
        coins.addAnimation("coins", coinsAnim)
        coins.scale = 0.1;
        coins.velocityX = -(8 + score/10);
        coins.depth=1;
        coinsGroup.add(coins);
        coins.lifetime = 250;
        

    }
}

function generateObstacles() {
    if (frameCount % 90 === 0) {
        var obstacles = createSprite(1200, 545)
        obstacles.velocityX = -(8 + score/10);
        obstacles.lifetime = 250;
        var randNum = Math.round(random(1, 2))
        switch (randNum) {
            case 1: obstacles.addAnimation("mushroom", mushAnim);
            break;
            case 2: obstacles.addAnimation("turtle", turtleAnim);
            break;
            default:break;
        }
        obstacles.depth=1;
        obstacles.scale = 0.13;
        obstaclesGroup.add(obstacles);
        
    }
}

function restartGame(){
    gameState="PLAY";
    obstaclesGroup.destroyEach();
    coinsGroup.destroyEach();
    brickGroup.destroyEach();
    mario.changeAnimation("running", mario_running);
    bg.velocityX=-8;
    restart.visible=false;
}


