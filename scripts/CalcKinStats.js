let initalY = document.getElementById("inputY");
let initalX = document.getElementById("inputX");
let velocity = document.getElementById("inputVelocity");
let angle = document.getElementById("inputAngle");

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
        if(element.value < 0 && element != angle && element != velocity) {
            element.value = 0
        }
        if(element.value <= 0 && (element === angle || element === velocity)) {
            element.value = 0.001
        }
    });
});
