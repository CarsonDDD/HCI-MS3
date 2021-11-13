let homePage = document.getElementById("home_page"); //a pointer to the home page div
let calendarPage = document.getElementById("calendar_page"); //a pointer to the calendar page div
let statisticsPage = document.getElementById("statistics_page"); //a pointer to the statistics page div

let homeBtn = document.getElementById("home_btn"); //a pointer to the home img 
let calendarBtn = document.getElementById("calendar_btn"); //a pointer to the calendar img
let statisticsBtn = document.getElementById("statistics_btn"); //a pointer to the statistics img

let homeToolTip = document.getElementById("home_tooltip"); //a pointer to the home tooltip
let calendarToolTip = document.getElementById("calendar_tooltip"); //a pointer to the calendar tool tip
let statisticsToolTip = document.getElementById("statistics_tooltip"); //a pointer to the statistics tool tip

let currPage = homePage, currBtn = homeBtn; //currPage is the current page, while currBtn is the button to go to the currPage
                                            
//color variables
let hoverColor = "rgb(0, 200, 0)", selectedColor = "rgb(0, 128, 0)", defColor = "rgb(0, 255, 0)"; 

//add click, mouseover, and mouseleave events to all the buttons

homeBtn.addEventListener("click", function(e) { currPage = homePage; showPage(); currBtn = homeBtn; highlightBtn(e); });
homeBtn.addEventListener("mouseover", overBtn);
homeBtn.addEventListener("mouseleave", leaveBtn);

calendarBtn.addEventListener("click", function(e) { currPage = calendarPage; showPage(); currBtn = calendarBtn; highlightBtn(e);});
calendarBtn.addEventListener("mouseover", overBtn);
calendarBtn.addEventListener("mouseleave", leaveBtn);

statisticsBtn.addEventListener("click", function(e) { currPage = statisticsPage; showPage(); currBtn = statisticsBtn; highlightBtn(e);});
statisticsBtn.addEventListener("mouseover", overBtn);
statisticsBtn.addEventListener("mouseleave", leaveBtn);

function overBtn(e) 
{ 
    if (e.target !== currBtn) //change the color of the image when mouse is over it
                                //note that we only do this if the button the mouse is over is NOT the currBtn
                                //currBtn should still stay selected
    {
        e.target.style.backgroundColor = hoverColor; 

        let tooltip = getCorrespondingTooltip(e.target);
        tooltip.style.opacity = 1; //show the tooltip for the hovered button
    }
}
function leaveBtn(e) 
{ 
    if (e.target !== currBtn) //change the color of the image when mouse leaves it
                                //note that we only do this if the button the mouse has left is NOT the currBtn
                                //currBtn should still stay selected
    {
        e.target.style.backgroundColor = defColor; 
                                
        let tooltip = getCorrespondingTooltip(e.target);
        tooltip.style.opacity = 0; //get rid of the tooltip for the button
    }
}

function highlightBtn() 
{ 
    //if we click a button, we want to unselect the previously clicked button

    homeBtn.style.backgroundColor = defColor;
    calendarBtn.style.backgroundColor = defColor;
    statisticsBtn.style.backgroundColor = defColor;
    homeBtn.style.cursor = "pointer";
    calendarBtn.style.cursor = "pointer";
    statisticsBtn.style.cursor = "pointer";

    currBtn.style.backgroundColor = selectedColor; //change the color of crrBtn to indicate that it is selected
    currBtn.style.cursor = "default"; //make sure that the user does not get the idea that currBtn is still clickable

    let tooltip = getCorrespondingTooltip(currBtn);
    tooltip.style.opacity = 0; //get rid of tooltip for the clicked button
}

function showPage()
{
    //hide every page except for currPage

    homePage.style.display = "none";
    calendarPage.style.display = "none";
    statisticsPage.style.display = "none";

    currPage.style.display = "flex"; 
}

function getCorrespondingTooltip(btn)
{
    if (btn === homeBtn) return homeToolTip;
    else if (btn === calendarBtn) return calendarToolTip;
    else return statisticsToolTip;
}

showPage();
highlightBtn();