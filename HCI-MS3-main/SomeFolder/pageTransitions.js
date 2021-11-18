let homePage = document.getElementById("home_page"); //a pointer to the home page div
let calendarPage = document.getElementById("calendar_page"); //a pointer to the calendar page div
let statisticsPage = document.getElementById("statistics_page"); //a pointer to the statistics page div

let homeBtn = document.getElementById("home_btn"); //a pointer to the home img 
let calendarBtn = document.getElementById("calendar_btn"); //a pointer to the calendar img
let statisticsBtn = document.getElementById("statistics_btn"); //a pointer to the statistics img

let currPage = homePage, currBtn = homeBtn; //currPage is the current page, while currBtn is the button to go to the currPage
                                            
//color variables
let hoverColor = "rgb(0, 170, 170)", selectedColor = "rgb(0, 128, 128)", defColor = "rgb(0, 85, 85)"; 

let createBub = document.getElementById("create_bubble");//pointer to create bubble form div

let submitBtn = document.getElementById("submit_btn");
let cancelBtn = document.getElementById("cancel_btn");
let plusBtn = document.getElementById("plus_button");

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

submitBtn.addEventListener("click", addCourse);
cancelBtn.addEventListener("click", closeForm);
plusBtn.addEventListener("click", openForm);

function overBtn(e) 
{ 
    if (e.target !== currBtn) //change the color of the image when mouse is over it
                                //note that we only do this if the button the mouse is over is NOT the currBtn
                                //currBtn should still stay selected
    {
        e.target.style.backgroundColor = hoverColor; 
    }
}
function leaveBtn(e) 
{ 
    if (e.target !== currBtn) //change the color of the image when mouse leaves it
                                //note that we only do this if the button the mouse has left is NOT the currBtn
                                //currBtn should still stay selected
    {
        e.target.style.backgroundColor = defColor; 
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
}

function showPage()
{
    //hide every page except for currPage

    homePage.style.display = "none";
    calendarPage.style.display = "none";
    statisticsPage.style.display = "none";

    currPage.style.display = "flex"; 
}

function openForm()
{
    createBub.style.display = "block";
}
  
function closeForm()
{
    createBub.style.display = "none";
}

import {m} from "./Manager.js";
let colours = new Array(
    "#F7F3CD",
    "#B4F1B3",
    "#A6D5FD",
    "#B9CBD9",
    "#CFE3E2",
    "#BCB0EE",
    "#FCCFF4",
    "#FCC9C5",
    "#FEDDD8",
    "#EAE7E2"
);


function addCourse()
{
    let courseName = document.getElementById("courseName");
    let tarGPA = document.getElementById("tarGPA");
    let chosenColour = 0;

    if (courseName.value !== "" && tarGPA !== "")
    {
        for(let i = 1; i <= 10; i++) //will need to alter depending on how many colours we have
        {
            if(document.getElementById("colour" + i).checked)
              chosenColour = i - 1;
        }

        m.createCourse(courseName.value, 0, tarGPA.value, colours[chosenColour]);
        closeForm();
    }
}

function onlyOne(colour)//can have for loop or create a pointer to each colour and then a bunch of if and elses
{
    for(let i = 1; i <= 10; i++)//will need to alter depending on how many colours we have
    {
        document.getElementById("colour" + i).checked = false;
    }
    document.getElementById(colour).checked = true;
}

showPage();
highlightBtn();

