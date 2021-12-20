let homePage = document.getElementById("home_page"); //a pointer to the home page div
let calendarPage = document.getElementById("calendar_page"); //a pointer to the calendar page div

let homeBtn = document.getElementById("home_btn"); //a pointer to the home img 
let calendarBtn = document.getElementById("calendar_btn"); //a pointer to the calendar img

let currPage = homePage, currBtn = homeBtn; //currPage is the current page, while currBtn is the button to go to the currPage
                                            
//color variables
let hoverColor = "rgb(0, 170, 170)", selectedColor = "rgb(0, 128, 128)", defColor = "rgb(0, 85, 85)"; 

//add click, mouseover, and mouseleave events to all the buttons

homeBtn.addEventListener("click", function(e) 
{ 
    if (currPage != homePage)
    {
        closeCal1();
        completionCloseInfo();
        calendar.unselect();
    }
    
    currPage = homePage; 
    showPage(); 
    currBtn = homeBtn; 
    highlightBtn(e); 
    resetTooltip()
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
    resetTooltip()
});

calendarBtn.addEventListener("mouseover", overBtn);
calendarBtn.addEventListener("mouseleave", leaveBtn);

function overBtn(e) 
{ 
    if (e.target !== currBtn) //change the color of the image when mouse is over it
                                //note that we only do this if the button the mouse is over is NOT the currBtn
                                //currBtn should still stay selected
    {
        e.target.style.backgroundColor = hoverColor; 
        
        createTooltip((e.target === homeBtn) ? "Home" : (e.target === calendarBtn) ? "Calendar" : "Statistics", e.target);
    }
}
function leaveBtn(e) 
{ 
    if (e.target !== currBtn) //change the color of the image when mouse leaves it
                                //note that we only do this if the button the mouse has left is NOT the currBtn
                                //currBtn should still stay selected
    {
        e.target.style.backgroundColor = defColor; 

        resetTooltip();
    }
}

function highlightBtn() 
{ 
    //if we click a button, we want to unselect the previously clicked button

    homeBtn.style.backgroundColor = defColor;
    calendarBtn.style.backgroundColor = defColor;
    homeBtn.style.cursor = "pointer";
    calendarBtn.style.cursor = "pointer";

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

