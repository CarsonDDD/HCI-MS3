// Re writting PageTransitions to fix a visual bug, this file is still WIP
class menuElement{
    /*button;
    icon;
    destination;*/

    constructor(button, icon, destination){
        this.button = button;
        this.icon = icon;
        this.destination = destination;
        console.log("menuElement Created!");
    }

    setBackgroundColor(bgColor){
        this.button.style.backgroundColor = bgColor;
        this.icon.style.backgroundColor = bgColor;
    }
}

// Class allows to not repeat the click event, also fixes a visual bug witht the icon
let home = new menuElement(
    document.getElementById("home_btn"),
    document.getElementById("home_icon"),
    document.getElementById("home_page")
);


let calendar = new menuElement(
    document.getElementById("calendar_btn"),
    document.getElementById("calendar_icon"),
    document.getElementById("calendar_page")

);
let calendarBtn = calendar.button;

let stats = new menuElement(
    document.getElementById("stats_btn"),
    document.getElementById("stats_icon"),
    document.getElementById("calendar_page"), // CHANGE TO STATS WHEN ADDED
);

//let selectedMenuItem = home;
let a = home;
let selectedMenuItem = home;

let hoverColor = "rgb(0, 128, 128)", selectedColor = "rgb(0, 128, 128)", defColor = "rgb(0, 85, 85)";

//homeBtn.addEventListener("click", function(e)
//homeBtn.addEventListener("mouseover", overBtn);
//homeBtn.addEventListener("mouseleave", leaveBtn);
//home.button.addEventListener("click", btnClick(home));
home.button.addEventListener("mouseover", hoverEnter);
home.button.addEventListener("mouseleave", hoverLeave);
home.icon.addEventListener("mouseover", hoverEnter);
home.icon.addEventListener("mouseleave", hoverLeave);

calendar.button.addEventListener("click", btnClick);

calendar.button.addEventListener("mouseover", hoverEnter);
calendar.button.addEventListener("mouseleave", hoverLeave);
calendar.icon.addEventListener("mouseover", hoverEnter);
calendar.icon.addEventListener("mouseleave", hoverLeave);

function hoverEnter(menuElem){
    if(menuElem.button !== selectedMenuItem.button){
        menuElem.setBackgroundColor(hoverColor);
    }
    alert("Enter");
}

function hoverLeave(menuElem){
    if (menuElem.button !== selectedMenuItem.button){
        //menuElem.button.style.backgroundColor = defColor;
        //menuElem.icon.style.backgroundColor = defColor;
        menuElem.setBackgroundColor(defColor);
    }
    alert("Leave");
}

function btnClick(menuElem){
    if(selectedMenuItem.destination !== menuElem.destination){
        closeBub();
    }
    showPage();
    selectedMenuItem = menuElem;
    highlightBtn();
}

function highlightBtn(){
    //if we click a button, we want to unselect the previously clicked button
    home.setBackgroundColor(defColor);
    //homeBtn.style.backgroundColor = defColor;

    stats.setBackgroundColor(defColor);
    //statsBtn.style.backgroundColor = defColor;

    calendar.setBackgroundColor(defColor);
    //calendarBtn.style.backgroundColor = defColor;
    //homeBtn.style.cursor = "pointer";
    //calendarBtn.style.cursor = "pointer";

    selectedMenuItem.setBackgroundColor(selectedColor);
    //currBtn.style.backgroundColor = selectedColor; //change the color of crrBtn to indicate that it is selected
    //currBtn.style.cursor = "default"; //make sure that the user does not get the idea that currBtn is still clickable
}

function showPage(){
    //hide every page except for currPage

    home.destination.style.display = "none";
    calendar.destination.style.display = "none";
    //stats.destination.style.display = "none";

    //homePage.style.display = "none";
    //calendarPage.style.display = "none";

    //currPage.style.display = "flex";
    selectedMenuItem.destination.style.display = "flex";

    if (selectedMenuItem === home){
        menu.bubbles.forEach(element => {
            element.setDimensions(element.cx, element.cy, element.rad);
        });
        menu.generateBubbles();
    }
}


showPage();
highlightBtn();