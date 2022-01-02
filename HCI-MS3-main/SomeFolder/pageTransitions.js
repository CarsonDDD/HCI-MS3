let homePage = document.getElementById("home_page"); //a pointer to the home page div
let calendarPage = document.getElementById("calendar_page"); //a pointer to the calendar page div
let statisticsPage = document.getElementById("statistics_page"); //a pointer to the statistics page div

let homeBtn = document.getElementById("home_li"); //a pointer to the home img 
let calendarBtn = document.getElementById("calendar_li"); //a pointer to the calendar img
let statisticsBtn = document.getElementById("statistics_li"); //a pointer to the statistics img

let currPage = homePage, currBtn = homeBtn; //currPage is the current page, while currBtn is the button to go to the currPage

//color variables
let hoverColor = "rgb(0, 170, 170)", selectedColor = "rgb(0, 128, 128)", defColor = "rgb(0, 85, 85)";

//add click, mouseover, and mouseleave events to all the buttons

homeBtn.addEventListener("click", function (e) {
    if (currPage != homePage) {
        closeCal1();
        completionCloseInfo();
        calendar.unselect();
    }

    currPage = homePage;
    showPage();
    currBtn = homeBtn;
    highlightBtn(e);
    resetTooltip();
});
homeBtn.addEventListener("mouseover", overBtn);
homeBtn.addEventListener("mouseleave", leaveBtn);

calendarBtn.addEventListener("click", function (e) {
    if (currPage != calendarPage) {
        closeBub();
        closeInfo();
    }

    currPage = calendarPage;
    showPage(); currBtn = calendarBtn;
    highlightBtn(e);
    resetTooltip();
});

calendarBtn.addEventListener("mouseover", overBtn);
calendarBtn.addEventListener("mouseleave", leaveBtn);

statisticsBtn.addEventListener("click", function (e) {
    currPage = statisticsPage;
    showPage();
    currBtn = statisticsBtn;
    highlightBtn(e);
    resetTooltip();
}
);
statisticsBtn.addEventListener("mouseover", overBtn);
statisticsBtn.addEventListener("mouseleave", leaveBtn);

function overBtn(e) {
    if (e.target !== currBtn) //change the color of the image when mouse is over it
    //note that we only do this if the button the mouse is over is NOT the currBtn
    //currBtn should still stay selected
    {
        e.target.style.backgroundColor = hoverColor;

        if (window.innerWidth <= 400)
            createTooltip(getAppropriateText(e.target), getAppropriateBtn(e.target));
    }
}

function leaveBtn(e) {
    if (e.target !== currBtn) //change the color of the image when mouse leaves it
    //note that we only do this if the button the mouse has left is NOT the currBtn
    //currBtn should still stay selected
    {
        e.target.style.backgroundColor = defColor;
        resetTooltip();
    }
}

function getAppropriateText(btn) {
    if (btn === homeBtn)
        return "Home";
    else if (btn === calendarBtn)
        return "Calendar";
    else
        return "Statistics";
}

function getAppropriateBtn(btn) {
    if (btn === homeBtn)
        return document.getElementById("home_btn");
    else if (btn === calendarBtn)
        return document.getElementById("calendar_btn");
    else
        return document.getElementById("statistics_btn");
}

function highlightBtn() {
    //if we click a button, we want to unselect the previously clicked button

    homeBtn.style.backgroundColor = defColor;
    calendarBtn.style.backgroundColor = defColor;
    statisticsBtn.style.backgroundColor = defColor;
    homeBtn.style.cursor = "pointer";
    calendarBtn.style.cursor = "pointer";
    statisticsBtn.style.cursor = "pointer";

    currBtn.style.backgroundColor = selectedColor; //change the color of crrBtn to indicate that it is selected
    currBtn.style.cursor = "default"; //make sure that the user does not get the idea that currBtn is still clickable
}

function showPage() {
    //hide every page except for currPage

    homePage.style.display = "none";
    calendarPage.style.display = "none";
    statisticsPage.style.display = "none";

    currPage.style.display = "flex";

    if (currPage === homePage) {
        menu.bubbles.forEach(element => {
            element.setDimensions(element.cx, element.cy, element.rad);
        });
        menu.generateBubbles();

        if (menu.bubbles.length === 0) {
            document.getElementById("home_main_bubble").innerHTML = "You currently have no courses. Click the plus button below to add one!";
        }
    }
}

window.addEventListener("resize", handlePlus);
window.addEventListener("resize", handleSideBar);

plusBtn.addEventListener("mouseover", function () {
    if (window.innerWidth <= 800) {
        createTooltip("Add course", plusBtn);
    }
})

plusBtn.addEventListener("mouseleave", function () {
    if (window.innerWidth <= 800) {
        resetTooltip();
    }
})

function handlePlus() {
    if (window.innerWidth <= 800) {
        plusBtn.innerHTML = "";
        plusBtn.style.backgroundImage = "url('./images/plus.png')";
        plusBtn.style.backgroundSize = "contain";
        plusBtn.style.backgroundRepeat = "no-repeat";
        plusBtn.style.backgroundPosition = "center";
    }
    else {
        plusBtn.innerHTML = "Add course";
        plusBtn.style.backgroundImage = "none";
    }
};

function handleSideBar() {
    if (window.innerWidth <= 400) {
        document.getElementById("sidebar").style.width = "60px";
    }
    else {
        resetTooltip();
    }
}

document.getElementById("sidebar").addEventListener("mouseover", function () {
    if (window.innerWidth > 400) {
        document.getElementById("sidebar").style.width = "270px";
    }
});

document.getElementById("sidebar").addEventListener("mouseleave", function () {
    if (window.innerWidth > 400) {
        document.getElementById("sidebar").style.width = "60px";
    }
});

showPage();
highlightBtn();
handlePlus();
handleSideBar();

