let submitBtn = document.getElementById("submit_btn");
let cancelBtn = document.getElementById("cancel_btn");
let plusBtn = document.getElementById("plus_button");
let createBub = document.getElementById("create_bubble");//pointer to create bubble form div
let parent = document.querySelector("body");

import {manager} from "./Manager.js";

let prevX = 0, prevY = 0;
let left = -1, top = -1;

submitBtn.addEventListener("click", addCourse);
cancelBtn.addEventListener("click", closeForm);
plusBtn.addEventListener("click", openForm);
createBub.addEventListener("mousedown", function(e)
{
    let inside = false;
    let children = createBub.children;

    for (let i = 0; i < children.length; i++)
    {
        let c = children[i];
        if (c.getAttribute("type") === "text")
        {
            let rect = c.getBoundingClientRect();
            let x = e.pageX;
            let y = e.pageY;
            if (x >= rect.left && x < rect.right &&
                y >= rect.top && y < rect.bottom)
                inside = true;
        }
    }

    if (!inside)
    {
        prevX = e.pageX;
        prevY = e.pageY;
        left = (createBub.getBoundingClientRect().left - parent.getBoundingClientRect().left);
        top = (createBub.getBoundingClientRect().top - parent.getBoundingClientRect().top);
        createBub.style.cursor = "grabbing";
        parent.addEventListener("mousemove", move);
        parent.addEventListener("mouseleave", function()
        {
            createBub.style.cursor = "grab";
            parent.removeEventListener("mousemove", move);
        })
    }
})
window.addEventListener("mouseup", function()
{
    createBub.style.cursor = "grab";
    parent.removeEventListener("mousemove", move);
})
window.addEventListener("resize", function()
{
    left = -1;
    top = -1;

    if (createBub.style.opacity == 1)
    {
        closeForm();
        openForm();
    }
})

function move(e)
{
    left += e.pageX - prevX;
    top += e.pageY - prevY;    

    fit();

    prevX = e.pageX;
    prevY = e.pageY;
    createBub.style.left = left + "px";
    createBub.style.top = top + "px";
}

function fit()
{
    let rect = createBub.getBoundingClientRect();

    if (left < 0)
        left = 0;
    if (top < 0)
        top = 0;
    if (left + rect.width > window.innerWidth)
        left = window.innerWidth - rect.width;

    let high = window.innerHeight;
    if (window.innerWidth <= 600)
        high *= 2;

    if (top + rect.height > high)
        top = high - rect.height;
}

function openForm()
{
    if (createBub.style.opacity == 0) //not shown yet
    {
        if (left == -1) //not yet moved
        {
            let rect = document.getElementById("home_main").getBoundingClientRect();
            let middle = (rect.left + rect.width / 2) / window.innerWidth;

            createBub.style.left = "calc(" + 100 * middle + "% - " + createBub.getBoundingClientRect().width / 2 + "px)";
        }
        else
        {   
            createBub.style.left = left + "px";
            createBub.style.top = top + "px";
        }

        createBub.style.opacity = 1;
    }
    else
    {
        closeForm();
    }
}
  
function closeForm()
{
    createBub.style.opacity = 0;
    createBub.style.left = "-1000px";
    createBub.style.top = "auto";
    createBub.style.bottom = "15%";
}

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
    let courseName = document.getElementById("courseName").value;
    let tarGPA = Number(document.getElementById("tarGPA").value);
    let chosenColour = 0;

    if (courseName !== "" && 
        typeof tarGPA == "number" && tarGPA >= 0) //gpa has to be a positive number
    {
        for(let i = 1; i <= 10; i++) //will need to alter depending on how many colours we have
        {
            if(document.getElementById("colour" + i).checked)
              chosenColour = i - 1;
        }

        if(manager.createCourse(courseName, 0, tarGPA, colours[chosenColour]))
        {
            closeForm();
        }
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
