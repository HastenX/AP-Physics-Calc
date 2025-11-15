// const vwConversionFactor = 15.0413333333;
// const vhConversionFactor = 4.68666499666 *0.681436942675;
let initalY = document.getElementById("inputY");
let initalX = document.getElementById("inputX");
let velocity = document.getElementById("inputVelocity");
let angle = document.getElementById("inputAngle");

let canvas = document.getElementById("physicsSim");
canvas.style.backgroundColor = "rgba(62, 165, 223, 0.8)";

let sim = canvas.getContext("2d");
sim.translate(vwToPixels(0), vhToPixels(-100));

document.getElementById("runSim").addEventListener("click", () => {
    initalY = document.getElementById("inputY");
    initalX = document.getElementById("inputX");
    velocity = document.getElementById("inputVelocity");
    angle = document.getElementById("inputAngle");
    if(!!initalY.value && !!initalX.value && !!velocity.value && !!angle.value) {
        console.log("running");
    }
});

document.querySelectorAll("input").forEach((element) => {
    element.addEventListener("input", ()=> {
        setPhysicsSim();
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

function vhToPixels(vh) {
    return vh * -(canvas.height)/100;
}

function setPhysicsSim() {
    sim.clearRect(vwToPixels(0), vhToPixels(0),vwToPixels(100), vhToPixels(100));
    // Default UI
    sim.beginPath();
    sim.rect(vwToPixels(0), vhToPixels(0), vwToPixels(100), vhToPixels(8));
    sim.rect(vwToPixels(0), vhToPixels(0), vwToPixels(5), vhToPixels(100));


    sim.stroke();
    // platform offset
    if(initalY.value >0) {
        sim.beginPath();

        sim.stroke();
    }
}

setPhysicsSim();
