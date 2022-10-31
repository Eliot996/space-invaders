'use strict'

{ // making the grid
    var grid = document.getElementById("grid");
    for (let i = 0; i < 15 * 15; i++) {
        grid.innerHTML += '<div id="' + i + '"></div>';
    }
}

const squares = document.querySelectorAll("#grid div");
const resultDisplay = document.querySelector("#result");
let width = 15;

let currentShooterIndex = Math.floor((((squares.length / width) - 2) * width) + (width / 2));
let currentInvadersIndex = 0;

let alienInvadersTakenDown = [];
let result = 0;
let direction = 1;


// defining the alien invaders, an array for how they appear
const alienInvaders = [
    0 ,1 ,2 ,3 ,4 ,5 ,6 ,7 ,8 ,9 ,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

// draw the invaders
function drawInvaders() {
    alienInvaders.forEach(invaderIndex => {
        if (!alienInvadersTakenDown.includes(invaderIndex)){
            squares[invaderIndex + currentInvadersIndex].classList.add("invader");
            squares[invaderIndex + currentInvadersIndex].innerHTML = " <img src=\"Alien.png\">"
        }
    });
}
drawInvaders();

function undrawInvaders() {
    alienInvaders.forEach(invaderIndex => {
        squares[invaderIndex + currentInvadersIndex].classList.remove("invader");
        squares[invaderIndex + currentInvadersIndex].innerHTML = "";
    });
}

// update invaders
function updateInvaders() {
    undrawInvaders();


    if((((currentInvadersIndex + alienInvaders[alienInvaders.length -1]) % width === width -1) && (direction > 0)) || 
       (((currentInvadersIndex + alienInvaders[0]) % width === 0      ) && (direction < 0))) {
            currentInvadersIndex += width;
            direction *= -1;
            //console.log("aliens hit limit, changing direction")
            //console.log(direction);
        } else {
            currentInvadersIndex += direction;
        }

    drawInvaders();

    // check for game over states
    if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
        resultDisplay.textContent = 'Game Over'
        squares[currentShooterIndex].classList.add("boom")
        clearInterval(invaderId)
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if ( alienInvaders[i] > (squares.length - (width -1))) {
            resultDisplay.textContent = 'Game Over'
            squares[currentShooterIndex].classList.add("boom")
            clearInterval(invaderId)
        }
    }

    // check for game win
    if (alienInvadersTakenDown.length === alienInvaders.length) {
        resultDisplay.textContent += " - Game Won";
        clearInterval(invaderId);
    }
}

let invaderId = setInterval(updateInvaders, 500)

// draw the shooter

squares[currentShooterIndex].classList.add("shooter");
squares[currentShooterIndex].innerHTML = "<img src=\"defender.png\">"

function moveShooter(e) {
    squares[currentShooterIndex].classList.remove("shooter");
    squares[currentShooterIndex].innerHTML = " "

    switch(e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
            break;
        case "ArrowRight":
            if ((currentShooterIndex) % width < width -1)  currentShooterIndex += 1;
            break;
    }

    squares[currentShooterIndex].classList.add("shooter");
    squares[currentShooterIndex].innerHTML = "<img src=\"defender.png\">"
}
document.addEventListener("keydown", moveShooter);

function shoot(e) {
    let laserId;
    let currentLaserIndex = currentShooterIndex - 15;

    
    function moveLaser() {
        squares[currentLaserIndex].classList.remove("laser");
        squares[currentLaserIndex].innerHTML = ""
        currentLaserIndex -= width;
        squares[currentLaserIndex].classList.add("laser");
        squares[currentLaserIndex].innerHTML = "<img src=\"laser.png\">"
        
        // check for hit
        if (squares[currentLaserIndex].classList.contains("invader")) {

            squares[currentLaserIndex].classList.remove("laser");
            squares[currentLaserIndex].classList.remove("invader");
            squares[currentLaserIndex].innerHTML = ""
            squares[currentLaserIndex].classList.add("boom");
            
            setTimeout(() => {
                squares[currentLaserIndex].classList.remove("boom");
                squares[currentLaserIndex].innerHTML = "";
            }, 250);
            clearInterval(laserId);

            const alienTakenDown = currentLaserIndex - currentInvadersIndex;
            alienInvadersTakenDown.push(alienTakenDown);

            result++;
            resultDisplay.textContent = result;
        }
        
        // check for out of bounce
        if (currentLaserIndex < width) {
            setTimeout(() => () => {
                squares[currentLaserIndex].classList.remove("laser");
                squares[currentLaserIndex].innerHTML = ""
            }, 100);
            clearInterval(laserId);
        }
    }

    if (e.key === " ") laserId = setInterval(moveLaser, 100);
}

document.addEventListener("keyup", shoot)