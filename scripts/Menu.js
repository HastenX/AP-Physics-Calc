let menuIcon = document.getElementById("menuIcon");
let body = document.getElementById("blur");
let menuElements = document.getElementById("menuElements");
let menuHeader = document.getElementById("menuHeader");

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

document.getElementById("blur").addEventListener("click", () => {
    isMenuOpen = false;
    menuIcon.classList.remove("menuOpen");
    menuIcon.classList.add("menuClose");
    body.classList.remove("blurOpen");
    body.classList.add("blurClose");
    spreadElements(false);
});

function spreadElements(spreadElements) {
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


function sizeMenu() {
    menuIcon.style.height = "4vw";
    menuIcon.style.width = "4vw";

    // SETS TRAVEL FOR MENU ITEMS
    let distanceToTravel = -11;
    const widthOfUnit =(((window.innerWidth/(9*screen.width))*100) -(12/24));

    menuElements.querySelectorAll("a").forEach((element) => {
        element.style.setProperty('--distanceToTravel', (distanceToTravel) + "vw");
        distanceToTravel -= (widthOfUnit);
        
        element.style.width = widthOfUnit + "vw";
    });

    menuHeader.style.left = (((window.innerWidth/(8*screen.width))*100)) + "vw";
    menuHeader.style.width = (((window.innerWidth/(4*screen.width))*100)) + "vw";
}

window.addEventListener("resize", sizeMenu());
sizeMenu();