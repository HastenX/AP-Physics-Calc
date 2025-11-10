let menuIcon = document.getElementById("menuIcon");
let body = document.getElementById("blur");
let menuElements = document.getElementById("menuElements");

let isMenuOpen = false;

menuIcon.addEventListener("click", ()=> {
    if(!isMenuOpen) {
        isMenuOpen = true;
        menuIcon.classList.remove("menuClose");
        menuIcon.classList.add("menuOpen");
        body.classList.remove("blurClose");
        body.classList.add("blurOpen");
        spreadElements(true);
        return;
    }
    isMenuOpen = false;
    menuIcon.classList.remove("menuOpen");
    menuIcon.classList.add("menuClose");
    body.classList.remove("blurOpen");
    body.classList.add("blurClose");
    spreadElements(false);
});

// SETS TRAVEL FOR MENU ITEMS
let distanceToTravel = 10;

menuElements.querySelectorAll("a").forEach((element) => {
    element.style.setProperty('--distanceToTravel', (-distanceToTravel) + "rem");
    distanceToTravel += 10.215;
    console.log(element.style.getPropertyValue('--distanceToTravel'))
});

function spreadElements(spreadElements) {
    menuElements.querySelectorAll("a").forEach((element) => console.log(element.classList));
    if(spreadElements) {
        menuElements.querySelectorAll("a").forEach((element)=> {
            element.classList.remove("hide");
            element.classList.add("spread");
            element.style.right = element.style.getPropertyValue('--distanceToTravel');
        });
        return;
    }
    menuElements.querySelectorAll("a").forEach((element)=> {
        element.classList.add("hide");
        element.classList.remove("spread");
        element.style.right = "35rem";
    });
}