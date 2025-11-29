import { SigFigs } from "./lib/SigFigs.js";

let sigFigs;

let initalY = document.getElementById("inputY");
let velocity = document.getElementById("inputVelocity");
let angle = document.getElementById("inputAngle");

let canvas = document.getElementById("physicsSim");
canvas.style.backgroundColor = "rgba(62, 165, 223, 0.8)";

let sim = canvas.getContext("2d");
sim.translate(vwToPixels(0), vhToPixels(-100));

let runningSim = false;
document.getElementById("runSim").addEventListener("click", () => {
    initalY = document.getElementById("inputY");
    velocity = document.getElementById("inputVelocity");
    angle = document.getElementById("inputAngle");
    if(!!initalY.value && !!velocity.value && !!angle.value) {
        sigFigs = new SigFigs(initalY.value, velocity.value, angle.value);
        runningSim = true;
    }
});

document.getElementById("clearSim").addEventListener("click", () => {
    clearSimulation();
});

document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("input", ()=> {
        if(runningSim) {
            clearSimulation();
        }
        if((element.value < 0 && element != angle && element != velocity) && element.value != "") {
            element.value = 0
        }
        if((element.value <= 0 && (element === angle || element === velocity) && element.value != "")) {
            element.value = 0.001
        }
    });
});

function clearSimulation() {
    hasLaunchStarted = false;
    runningSim = false;
    calledLaunch = false;
    catapultFrame = -125;
}

function vwToPixels(vw) {
    return vw * (canvas.width)/100;
}

function pixelsToVw(pixels) {
    return pixels *100/canvas.width
}

function vhToPixels(vh) {
    return vh * -(canvas.height)/100;
}
// startShape = [pivot(x,y),lengthBottom, lengthTop, lengthRight, lengthLeft
// 
const angleConversion = -Math.PI/180;
function rotateShape(startShape, angle) {
    startShape[1] *= -1 
    startShape[4] *= -1
    let shape = [
        [startShape[0], [null,null]],
        [[null,null], [null,null]],
        [[null,null], [null,null]],
        [[null,null], [null,null]],
    ];
    shape.forEach((pose, i) => {
        // let closerToTop = (angle >45 && angle < 90) || (angle > 90 && angle <135) || (angle >180  && angle < 225) ? 0 : 1;
        if(i % 2 == 1) {
            pose[1][0] = (i==3 || i == 1? -1: 1)*(startShape[i+1] * Math.cos(angle*angleConversion)) + pose[0][0];
            pose[1][1] = (startShape[i+1] * Math.sin(angle*angleConversion)) + pose[0][1];
        } else {
            pose[1][0] = (i==3 || i == 1? -1: 1)*(startShape[i+1] * Math.sin(angle*angleConversion)) + pose[0][0];
            pose[1][1] = (startShape[i+1] * Math.cos(angle*angleConversion)) + pose[0][1];
        }

        if( i < 3 ) shape[i+1][0] = pose[1];
    });
    return shape;
}
// shape = [pivot(x,y),lengthBottom, lengthTop, lengthRight, lengthLeft 
// 
let launchPoint;
function drawShape(shape, angle, fillColor, borderColor, hasCircle=false) {
    sim.beginPath();
    sim.moveTo(shape[0][0], shape[0][1]);
    let newShape = rotateShape(shape, angle);
    sim.lineTo(newShape[0][1][0], newShape[0][1][1]);
    if(hasCircle) {
        sim.arc(newShape[1][1][0], newShape[1][1][1], 3, 0, 2 * Math.PI)
        launchPoint = [newShape[1][1][0], newShape[1][1][1]];
    }
    sim.fillStyle = fillColor;
    sim.strokeStyle = borderColor;
    sim.lineTo(newShape[1][1][0], newShape[1][1][1]);
    sim.lineTo(newShape[2][1][0], newShape[2][1][1]);
    sim.lineTo(newShape[3][1][0], newShape[3][1][1]);
    sim.fill();
    sim.stroke();
    sim.closePath();
}
let xOffset =0
function drawIndex(location, text, size, color, isHorizontal) {
    if(!hasLaunchStarted) {
        sim.fillStyle = color;
        sim.font = size+"vh " + "Arial";
        if(sigFigs) {
            sigFigs.applySigFigs(Number(text));
            text = sigFigs.output;
            xOffset = String(text).length * .9
        }
        sim.fillText(text, 
            isHorizontal ? location[0]- vwToPixels(xOffset): location[0] + vwToPixels(2), 
            isHorizontal ? location[1]: location[1]+ vhToPixels(-7.75));
        sim.stroke();
        if(!isHorizontal) {
            drawShape([[location[0]+vwToPixels(2), location[1]-vhToPixels(4)],vwToPixels(2),vhToPixels(8), vwToPixels(2), vhToPixels(8)], 0, "white", "transparent");
            return;
        }
        drawShape([[location[0] - vwToPixels(0.25), location[1]+vhToPixels(12)],vwToPixels(2),vhToPixels(8), vwToPixels(2), vhToPixels(8)], 90, "white", "transparent");
    }
}

function drawCatapult(rotate,yOffset) {
    let xOffset=18
    drawShape([[vwToPixels(xOffset+6), vhToPixels(yOffset+8 +9)],vwToPixels(30),vhToPixels(2), vwToPixels(30), vhToPixels(2)],225, "grey", "transparent");
    drawShape([[vwToPixels(xOffset + 7), vhToPixels(yOffset+7+16)],vwToPixels(30),vhToPixels(3), vwToPixels(30), vhToPixels(3)], 180, "grey", "transparent");
    drawShape([[vwToPixels(xOffset+ 5.95), vhToPixels(yOffset+20)],vwToPixels(10),vhToPixels(2), vwToPixels(10), vhToPixels(2)],rotate, "grey", "transparent", true);
}
let catapultFrame = -125;

let yMax; 
let xHalf, xMax;
let halfTime, maxTime;

let setInitalHeight = 0;
function setPhysicsSim() {
    if(catapultFrame < -3){
        console.log("e")
        sim.clearRect(vwToPixels(0), vhToPixels(0),vwToPixels(100), vhToPixels(100));

        // Borders
        drawShape([[vwToPixels(0), vhToPixels(8)],vwToPixels(100),vhToPixels(10), vwToPixels(100), vhToPixels(10)], 90, "grey", "transparent");
        drawShape([[vwToPixels(5), vhToPixels(0)],vwToPixels(5),vhToPixels(100), vwToPixels(5), vhToPixels(100)], 270, "grey", "transparent");
    }
    
    // Catapult:
    if(runningSim){
        runningSimulation();
    }

    if(!hasLaunchStarted){
        drawCatapult(catapultFrame, setInitalHeight);
        // Y 0
        drawIndex([vwToPixels(2), vhToPixels(12)], "0", 1, "white", false);
        // X 0
        drawIndex([vwToPixels(23.5), vhToPixels(1)], "0", 1, "white", true);
    }

    requestAnimationFrame(setPhysicsSim);
}
function runningSimulation() {
    trueAngle= angle.value%90;
    halfTime = (Number(velocity.value))*Math.sin(trueAngle*Math.PI/180)/9.8;
    yMax = (Number(initalY.value) + Number(velocity.value*Math.sin(trueAngle*Math.PI/180)*halfTime) - Number(.5*9.81*Math.pow(halfTime,2)));
    xHalf = Math.abs(velocity.value*Math.cos(trueAngle*Math.PI/180)*halfTime);
    maxTime = halfTime + Math.pow((2*yMax)/9.8,.5);
    xMax = Math.abs(velocity.value*Math.cos(trueAngle*Math.PI/180)*maxTime);

    setInitalHeight = (initalY.value/yMax *87)-36;
    if(catapultFrame < -2) {
        let temp;
        drawIndex([vwToPixels(2), vhToPixels(88)], yMax, 1, "white", false);
        if(initalY.value != 0) {
            drawIndex([vwToPixels(2), vhToPixels((initalY.value/yMax *87)+10)], initalY.value, 1, "white", false);
        }
        drawIndex([vwToPixels(95), vhToPixels(1)], xMax, 1, "white", true)
        drawIndex([vwToPixels((xHalf/xMax*(90-20))+5+20), vhToPixels(1)], xHalf, 1, "white", true)

        sigFigs.applySigFigs(xMax);
        temp = sigFigs.output;
        document.getElementById("xMaxOutput").innerText = "X Distance Traveled: ".concat(temp).concat("m");
        temp = []
        sigFigs.applySigFigs(xHalf);
        temp.push(sigFigs.output);
        sigFigs.applySigFigs(yMax);
        temp.push(sigFigs.output);
        document.getElementById("yMaxOutput").innerText = "Maximum Point: (".concat(temp[0]).concat(",").concat(temp[1]).concat(")");


    }
    if(catapultFrame < 0) {
        catapultFrame++;
    }  
    if(catapultFrame > -80 && catapultFrame < 1) {
        catapultFrame++;
    }   
    if(catapultFrame >= 1) {
        launchController();
    }
}
let hasLaunchStarted;
function launchController() {
    if(!hasLaunchStarted) {
        hasLaunchStarted = true;
        updateItem(launchPoint[0], launchPoint[1])
    }
    timedUpdate();
}

function updateItem(pose) {
    if(pixelsToVw(pose[1]*-1) >= 0) {
        sim.moveTo(pose[0], pose[1]);
        sim.arc(pose[0], pose[1], 3, 0, 2 * Math.PI);
        sim.fillStyle = "white";
        sim.fill();
        sim.strokeStyle = "transparent";
        sim.stroke();
    }
}
let calledLaunch = false
let x,y;
let trueAngle;
function timedUpdate(){
    if(!calledLaunch) {
        calledLaunch = true
        let timeMili = 0;
        let timer = setInterval(() => {
            console.log(trueAngle)
            timeMili += 5;
            x= Number(velocity.value)*Math.cos(trueAngle*Math.PI/180)*(timeMili/1000);
            y= Number(initalY.value) + (Number(velocity.value)*Math.sin(Number(trueAngle*Math.PI/180))*(timeMili/1000)) + (-.5*9.8*(Math.pow((timeMili/1000),2)));
            updateItem([vwToPixels((x/xMax*(90-20))+5+20) ,vhToPixels((y/yMax*82)+8)]);
            if(timeMili % 10 == 0) {
                document.getElementById("timeOutput").innerText = "Time of Launch: ".concat(timeMili/1000).concat("S");
            }
            if (timeMili >  maxTime*1000 || !hasLaunchStarted) {
                document.getElementById("timeOutput").innerText = "Time of Launch: ".concat(maxTime).concat("S");
                clearInterval(timer);
            }
        }, 5);
    }
}


setPhysicsSim();