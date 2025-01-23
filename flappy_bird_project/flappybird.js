//board
let board;
let boardwidth = 360;
let boardheight = 640;
let context;

//varijable za pticu
let birdwidth = 34;
let birdheight = 24;
let birdX = boardwidth/8; //polozaj ptice na kanvasu
let birdY = boardheight/2;
let birdimg;

let bird = 
{
    x : birdX,
    y : birdY,
    width : birdwidth,
    height : birdheight
}

//pipes
let pipearray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipex = boardwidth;
let pipey = 0;

//loading images for pipe
let toppipeimg;
let bottompipeimg;

//physics
let velocityx = -2;  //pipes moving left speed
let velocityy = 0;  //bird jump speed she is not jumping at all  (jump -> negative number)
let gravity = 0.4; //pos num, bird goes downwards due to gravity

let gameover = false;
let score = 0;

window.onload = function()
{
    board = document.getElementById("board");
    board.height = boardheight;
    board.width = boardwidth;
    context = board.getContext("2d");  //used for drwaing on the board

    //draw flappy bird
    //context.fillSytle = "green";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdimg = new Image();
    birdimg.src = "./flappybird.png";
    birdimg.onload = function()
    {
       context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);
    }

    //loading images for pipes
    toppipeimg = new Image();
    toppipeimg.src = "./toppipe.png";

    bottompipeimg = new Image();
    bottompipeimg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placepipes, 2000);    //svako 2 sekunde
    document.addEventListener("keydown", movebird);
}


function update()
{
    requestAnimationFrame(update);
    if (gameover)
    {
        return;
    }
    context.clearRect (0, 0, board.width, board.height);  //clearing the previous frame

    //ptica
    velocityy += gravity; 
    //bird.y += velocityy; //to move upvards, now we need to add gravity
    bird.y = Math.max(bird.y + velocityy, 0); //limiting bird to the top of the canvas
    context.drawImage(birdimg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height)  //if the bird falls down 
    {
        gameover = true;
    }

    //pipes update loop
    for (let i = 0; i< pipearray.length; i++)
    {
        let pipe = pipearray[i];
        pipe.x += velocityx;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if (!pipe.passed && bird.x > pipe.x + pipe.width)
        {
           score += 0.5;  //passing 2 pipes (bottom and top)= 1 score tj 0.5 * 2 = 1 score
           pipe.passed = true; 
        }

        if (detectcollision(bird,pipe))
        {
            gameover=true;
        }
    }

    //clear pipes off the canvas on the left side
    while (pipearray.lenght > 0 && pipearray[0].x < -pipewidth)
    {
        pipearray.shift();   //removes first element from the array
    }

    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);


    if(gameover)
    {
        context.fillText("GAME OVER", 5, 90);  //position x and position y
    }
}


function placepipes()
{
    if (gameover)
    {
        return;
    }

    let randompipey = pipey - pipeheight/4 - Math.random()*(pipeheight/2);   //da pipe ne bude skroz dole
    let openingspace = boardheight/4;

    let toppipe = {
        img: toppipeimg,
        x : pipex,
        y : randompipey,
        width : pipewidth,
        height : pipeheight,
        passed : false   //to see if the flappy bird has passed this pipe yet
    }

    pipearray.push(toppipe);   //svako 2 sekunde cemo pozvati ovu funkciju i dodaje novi pipe na nas niz (array)

    let bottompipe = 
    {
        img: bottompipeimg,
        x : pipex,
        y : randompipey + pipeheight + openingspace,
        width : pipewidth,
        height : pipeheight,
        passed : false   //to see if the flappy bird has passed  the pipe
    }

    pipearray.push (bottompipe);
}


function movebird(e)
{
   if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX")
   {
       //jump
       velocityy=-6;   //jump

       //reseting game (restoring the game back to the default)
       if (gameover)
       {
           bird.y = birdY;
           pipearray = [];
           score = 0;
           gameover = false;

       }
   }
}


function detectcollision (a,b)
{
    return a.x < b.x + b.width && 
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}