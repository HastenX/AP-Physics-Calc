// const vwConversionFactor = 15.0413333333;
// const vhConversionFactor = 4.68666499666 *0.681436942675;
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
        runningSim = true;
    }
});

document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("input", ()=> {
        if((element.value < 0 && element != angle && element != velocity) && element.value != "") {
            element.value = 0
        }
        if((element.value <= 0 && (element === angle || element === velocity) && element.value != "")) {
            element.value = 0.001
        }
    });
});

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
    sim.lineTo(newShape[1][1][0], newShape[1][1][1]);
    sim.lineTo(newShape[2][1][0], newShape[2][1][1]);
    sim.lineTo(newShape[3][1][0], newShape[3][1][1]);
    sim.fillStyle = fillColor;
    sim.fill();
    sim.strokeStyle = borderColor;
    sim.stroke();
    sim.closePath();
    sim.beginPath();
}

function drawIndex(location, text, size, color, isVerticle) {
    sim.fillStyle = color;
    sim.font = size+"vh " + "Arial";
    sim.fillText(text, 
        text >10 && !isVerticle ? location[0]- vwToPixels(2): location[0], 
        text >10 && !isVerticle ? location[1]+ vhToPixels(0.5): location[1]);
    sim.stroke();
    if(!isVerticle) {
        drawShape([[location[0]+vwToPixels(2), location[1]],vwToPixels(2),vhToPixels(8), vwToPixels(2), vhToPixels(8)], 0, "white", "transparent");
        return;
    }
    drawShape([[location[0] - vwToPixels(0.25), location[1]+vhToPixels(12)],vwToPixels(2),vhToPixels(8), vwToPixels(2), vhToPixels(8)], 90, "white", "transparent");
}

function drawCatapult(rotate,yOffset) {
    let xOffset=18
    drawShape([[vwToPixels(xOffset), vhToPixels(yOffset)],vwToPixels(8),vhToPixels(2), vwToPixels(8), vhToPixels(2)],45, "grey", "transparent");
    drawShape([[vwToPixels(xOffset + 5.5), vhToPixels(yOffset-1)],vwToPixels(8),vhToPixels(3), vwToPixels(8), vhToPixels(3)],0, "grey", "transparent");
    drawShape([[vwToPixels(xOffset+ 5.95), vhToPixels(yOffset+12)],vwToPixels(10),vhToPixels(2), vwToPixels(10), vhToPixels(2)],rotate, "grey", "transparent", true);
    // drawShape([[vwToPixels(50), vhToPixels(50)],vwToPixels(12),vhToPixels(2), vwToPixels(12), vhToPixels(2)],-145, "grey", "transparent", true);
}
let catapultFrame = -125;

let yMax; 
let xHalf, xMax;
let halfTime, maxTime;
function setPhysicsSim() {
    if(!hasLaunchStarted){
        sim.clearRect(vwToPixels(0), vhToPixels(0),vwToPixels(100), vhToPixels(100));
    }
    // Default UI
    // Borders
    drawShape([[vwToPixels(0), vhToPixels(8)],vwToPixels(100),vhToPixels(10), vwToPixels(100), vhToPixels(10)], 90, "grey", "transparent");
    drawShape([[vwToPixels(5), vhToPixels(0)],vwToPixels(5),vhToPixels(100), vwToPixels(5), vhToPixels(100)], 270, "grey", "transparent");
    
    // Catapult:
    if(runningSim){
        runningSimulation();
    }
    drawCatapult(catapultFrame, initalY.value==0 ? 8 : 30);

    // x and y intercepts
    // Y
    drawIndex([vwToPixels(2), vhToPixels(8)], "0", 1, "white", false);
    // drawIndex([vwToPixels(2), vhToPixels(90)], "a", 1, "white", false);
    // X
    drawIndex([vwToPixels(23.5), vhToPixels(1)], "0", 1, "white", true);
    // drawIndex([vwToPixels(90), vhToPixels(1)], "b", 1, "white", true);
    // sim.stroke();
    // sim.stroke();
    // platform offset
    requestAnimationFrame(setPhysicsSim);
}
function runningSimulation() {
    halfTime = (Number(velocity.value))*Math.sin(angle.value*Math.PI/180)/9.8;
    yMax = (Number(initalY.value) + Number(velocity.value*Math.sin(angle.value*Math.PI/180)*halfTime) - Number(.5*9.81*Math.pow(halfTime,2)));
    xHalf = Math.abs(velocity.value*Math.cos(angle.value*Math.PI/180)*halfTime);
    maxTime = halfTime + Math.pow((2*yMax)/9.8,.5);
    xMax = Math.abs(velocity.value*Math.cos(angle.value*Math.PI/180)*maxTime);

    drawIndex([vwToPixels(2), vhToPixels(90)], yMax, 1, "white", false);
    if(initalY != 0) {
        drawIndex([vwToPixels(2), vhToPixels((initalY.value/yMax *87)+8)], initalY.value, 1, "white", false);
    }
    drawIndex([vwToPixels(95), vhToPixels(1)], xMax, 1, "white", true)
    drawIndex([vwToPixels((((xHalf/xMax) * 100)+5)), vhToPixels(1)], xHalf, 1, "white", true)
    if(catapultFrame < 0) {
        catapultFrame++;
    }  
    if(catapultFrame > -80 && catapultFrame < 0) {
        catapultFrame++;
    }   
    if(catapultFrame >= 0) {
        launchController();
    }
}
let hasLaunchStarted;
let currentPose;
function launchController() {
    if(!hasLaunchStarted) {
        hasLaunchStarted = true;
        // currentPose = [vwToPixels(25),vwToPixels(20)];
        // sim.arc(launchPoint[0], launchPoint[1], 3, 0, 2 * Math.PI);
        // sim.fillStyle = "white";
        // sim.fill();
        // sim.strokeStyle = "transparent";
        // sim.stroke();
        updateItem(launchPoint[0], launchPoint[1])
    }
    timedUpdate();
}

function updateItem(pose) {
    if(pixelsToVw(pose[1]*-1) >= 0) {
        sim.arc(pose[0], pose[1], 3, 0, 2 * Math.PI);
        sim.fillStyle = "white";
        sim.fill();
        sim.strokeStyle = "transparent";
        sim.stroke();
    }
}
let called = false
function timedUpdate(){
    if(!called) {
        called = true
        var miliSeconds = 0;
        var timer = setInterval(function(){
            miliSeconds += 10;
            x= Number(velocity.value)*Math.cos(angle.value*Math.PI/180)*(miliSeconds/1000);
            y= Number(initalY.value) + (Number(velocity.value)*Math.sin(Number(angle.value*Math.PI/180))*(miliSeconds/1000)) + (-.5*9.8*(Math.pow((miliSeconds/1000),2)));
            updateItem([vwToPixels((x/xMax*90)+5) ,vhToPixels((y/yMax*82)+8)]);
            console.log([vwToPixels((x/xMax*90)+5) ,vhToPixels((y/yMax*82)+8)])
            if (miliSeconds >  maxTime*1000) {
                clearInterval(timer);
            }
        }, 10);
    }
}


setPhysicsSim();