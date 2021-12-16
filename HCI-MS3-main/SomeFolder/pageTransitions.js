let homePage = document.getElementById("home_page"); //a pointer to the home page div
let calendarPage = document.getElementById("calendar_page"); //a pointer to the calendar page div

let homeBtn = document.getElementById("home_btn"); //a pointer to the home img
let calendarBtn = document.getElementById("calendar_btn"); //a pointer to the calendar img
let statsBtn = document.getElementById("stats_btn"); //a pointer to the calendar img

//Icons
let homeIcon = document.getElementById("home_icon"); //a pointer to the home img
let calendarIcon = document.getElementById("calendar_icon"); //a pointer to the calendar img
let statsIcon = document.getElementById("stats_icon"); //a pointer to the calendar img

let currPage = homePage, currBtn = homeBtn; //currPage is the current page, while currBtn is the button to go to the currPage

//color variables hover handled in css
let hoverColor = "rgb(0, 128, 128)", selectedColor = "rgb(0, 128, 128)", defColor = "rgb(0, 85, 85)";

//add click, mouseover, and mouseleave events to all the buttons

homeBtn.addEventListener("click", function(e)
{
    if (currPage != homePage)
    {
        closeCal1();
    }

    currPage = homePage;
    showPage();
    currBtn = homeBtn;
    highlightBtn(e);
});
homeBtn.addEventListener("mouseover", overBtn);
homeBtn.addEventListener("mouseleave", leaveBtn);

calendarBtn.addEventListener("click", function(e)
{
    if (currPage != calendarPage)
    {
        closeBub();
        closeInfo();
    }

    currPage = calendarPage;
    showPage(); currBtn = calendarBtn;
    highlightBtn(e);
});

calendarBtn.addEventListener("mouseover", overBtn);
calendarBtn.addEventListener("mouseleave", leaveBtn);


statsBtn.addEventListener("click", function(e)
{
    if (currPage != statsPage)
    {
        closeBub();
        closeInfo();
    }

    //currPage = statsPage;
    showPage(); currBtn = statsBtn;
    highlightBtn(e);
});

statsBtn.addEventListener("mouseover", overBtn);
statsBtn.addEventListener("mouseleave", leaveBtn);

function overBtn(e)
{
    if (e.target !== currBtn)
    {
        e.target.style.backgroundColor = hoverColor; // handled in css
        //e.target.style.color = hoverColor;

        //createTooltip((e.target === homeBtn) ? "Home" : (e.target === calendarBtn) ? "Calendar" : "Statistics", e.target);
    }
}
function leaveBtn(e)
{
    if (e.target !== currBtn)
    {
        e.target.style.backgroundColor = defColor;
        //e.target.style.color = defColor;
    }
}

function itemClick(menuItem){

}

function highlightBtn()
{
    //if we click a button, we want to unselect the previously clicked button

    homeBtn.style.backgroundColor = defColor;
    statsBtn.style.backgroundColor = defColor;
    //homeBtn.style.color = defColor;
    //calendarBtn.style.color = defColor;
    calendarBtn.style.backgroundColor = defColor;
    //homeBtn.style.cursor = "pointer";
    //calendarBtn.style.cursor = "pointer";

    currBtn.style.backgroundColor = selectedColor; //change the color of crrBtn to indicate that it is selected
    currBtn.style.cursor = "default"; //make sure that the user does not get the idea that currBtn is still clickable
}

function showPage()
{
    //hide every page except for currPage

    homePage.style.display = "none";
    calendarPage.style.display = "none";

    currPage.style.display = "flex";

    if (currPage === homePage)
    {
        menu.bubbles.forEach(element => {
            element.setDimensions(element.cx, element.cy, element.rad);
        });
        menu.generateBubbles();
    }
}

showPage();
highlightBtn();

