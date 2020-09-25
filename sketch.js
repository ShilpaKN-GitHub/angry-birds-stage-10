const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;

var engine, world;

var box1, box2, box3, box4, box5;
var pig1, pig2;
var log1, log2, log3, log4;
var bird;
var ground, platform;
var slingshot;

var backgroundImage;
var bg = "sprites/bg.png";

var gameState = "onSling";

var score = 0;

function preload()
{
    getBackgroundImage();
}

function setup()
{
    var canvas = createCanvas(1200, 400);
    
    engine = Engine.create();
    world = engine.world;

    box1 = new Box(width-350, height-80, 80, 80);
    box2 = new Box(width-150, height-80, 80, 80);
    box3 = new Box(width-350, height-125, 80, 80);
    box4 = new Box(width-150, height-125, 80, 80);
    box5 = new Box(width-250, height-250, 80, 80);

    pig1 = new Pig(width-250, height-90);
    pig2 = new Pig(width-250, height-125);

    log1 = new Log(width-250, height-120, 280, PI/2);
    log2 = new Log(width-250, height-225, 280, PI/2);
    log3 = new Log(width-320, height-250, 150, PI/7);
    log4 = new Log(width-180, height-250, 150, -PI/7);

    bird = new Bird(200, 50);

    ground = new Ground(600, height, 1200, 20);
    platform = new Ground(150, 305, 300, 170);
    
    slingshot = new Slingshot(bird.body, {x: 200, y: 50});

    //Example of worldtimeapi
    getTime();
}

function draw()
{
    if(backgroundImage)
    {
        background(backgroundImage);
    }

    noStroke();
    textSize(35);
    fill("white");
    text("Score: " + score, width - 300, 50);

    Engine.update(engine);

    ground.display();
	platform.display();
    
    box1.display();
    box2.display();
    box3.display();
    box4.display();
    box5.display();

    pig1.display();
    pig1.score();
    pig2.display();
    pig2.score();

    log1.display();
    log2.display();
    log3.display();
    log4.display();

    bird.display();

    slingshot.display();
}

//Example of how worldtimeapi works. Not required for angry birds game.
async function getTime()
{
    var response = await fetch("//worldtimeapi.org/api/timezone/Asia/Kolkata");
    var responseJSON = await response.json();
    console.log(responseJSON);

    var datetime = responseJSON.datetime;
    console.log(datetime);

    var hour = datetime.slice(11, 13);
    console.log(hour);
}

async function getBackgroundImage()
{
    var response = await fetch("//worldtimeapi.org/api/timezone/Asia/Kolkata");
    var responseJSON = await response.json();
    var datetime = responseJSON.datetime;
    var hour = datetime.slice(11, 13);

    if(hour >= 06 && hour <= 19)
    {
        bg = "sprites/bg.png";
    }
    else
    {
        bg = "sprites/bg2.jpg";
    }
    backgroundImage = loadImage(bg);
    //console.log(bg);
}

function mouseDragged()
{
    //Can also use gameState === "onSling"
    if(gameState !== "launched")
    {
        Body.setPosition(bird.body, {x: mouseX, y: mouseY});
    }
}

function mouseReleased()
{
    slingshot.fly();
    gameState = "launched";
}

function keyPressed()
{
    var spaceKeyAsciiCode = 32;
    if(keyCode === spaceKeyAsciiCode && bird.body.speed < 1)
    {
        World.remove(world, bird.body);
        bird = new Bird(200, 50);
        slingshot.attach(bird.body);
        gameState = "onSling";
    }
}