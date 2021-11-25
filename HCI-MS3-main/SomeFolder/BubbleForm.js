//pointers to html elements

let submitBtn = document.getElementById("submit_btn");
let cancelBtn = document.getElementById("cancel_btn");
let plusBtn = document.getElementById("plus_button");
let createBub = document.getElementById("create_bubble");
let parent = document.querySelector("body");

//variables for dragging 

let prevXBub = 0, prevYBub = 0;
let leftBub = -1, topBub = -1;

/************************Event Listeners***************************************/

submitBtn.addEventListener("click", addCourse);
cancelBtn.addEventListener("click", closeBub);
plusBtn.addEventListener("click", function()
{
    resetTooltip();
    openBub();
});
plusBtn.addEventListener("mouseover", function()
{
    createTooltip("Add a course", plusBtn);
});
plusBtn.addEventListener("mouseleave", function()
{
    resetTooltip();
});
createBub.addEventListener("mousedown", function(e)
{
    let inside = false;
    let children = createBub.children;

    for (let i = 0; i < children.length; i++) //we don't drag is mouse is over a textbox
    {
        let c = children[i];
        if (c.getAttribute("type") === "text")
        {
            let rect = c.getBoundingClientRect();
            let x = e.pageX;
            let y = e.pageY;

            if (x >= rect.left && x < rect.right &&
                y >= rect.top + window.scrollY && y < rect.bottom + window.scrollY)
                inside = true;
        }
    }

    if (!inside)
    {
        prevXBub = e.pageX;
        prevYBub = e.pageY;
        leftBub = (createBub.getBoundingClientRect().left - parent.getBoundingClientRect().left);
        topBub = (createBub.getBoundingClientRect().top - parent.getBoundingClientRect().top);
        createBub.style.cursor = "grabbing";
        parent.addEventListener("mousemove", moveBub);
        parent.addEventListener("mouseleave", function()
        {
            createBub.style.cursor = "grab";
            parent.removeEventListener("mousemove", moveBub);
        })
    }
})
window.addEventListener("mouseup", function()
{
    createBub.style.cursor = "grab";
    parent.removeEventListener("mousemove", moveBub);
})
window.addEventListener("resize", function()
{
    leftBub = -1;
    topBub = -1;

    if (createBub.style.opacity == 1)
    {
        closeBub();
        openBub();
    }
})

/*********************************************************************************** */

function moveBub(e)
{
    leftBub += e.pageX - prevXBub;
    topBub += e.pageY - prevYBub;    

    fitBub();

    prevXBub = e.pageX;
    prevYBub = e.pageY;
    createBub.style.left = leftBub + "px";
    createBub.style.top = topBub + "px";
}

function fitBub()
{
    let rect = createBub.getBoundingClientRect();

    if (leftBub < 0)
        leftBub = 0;
    if (topBub < 0)
        topBub = 0;
    if (leftBub + rect.width > window.innerWidth)
        leftBub = window.innerWidth - rect.width;

    let high = window.innerHeight;
    if (window.innerWidth <= 600)
        high *= 2;

    if (topBub + rect.height > high)
        topBub = high - rect.height;
}

function openBub()
{
    if (createBub.style.opacity == 0) //not shown yet
    {
        if (leftBub == -1) //not yet moved
        {
            let rect = document.getElementById("home_main").getBoundingClientRect();
            let middle = (rect.left + rect.width / 2) / window.innerWidth;

            createBub.style.left = "calc(" + 100 * middle + "% - " + createBub.getBoundingClientRect().width / 2 + "px)";
        }
        else
        {   
            createBub.style.left = leftBub + "px";
            createBub.style.top = topBub + "px";
        }

        createBub.style.opacity = 1;
    }
    else
    {
        closeBub();
    }
}
  
function closeBub()
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
    let chosenColour = -1;
    let message = null;

    for(let i = 1; i <= 10; i++) //will need to alter depending on how many colours we have
    {
        if(document.getElementById("colour" + i).checked)
          chosenColour = i - 1;
    }

    if (courseName === "") message = "Invalid course: Can't be blank.";
    else if (isNaN(tarGPA) || document.getElementById("tarGPA").value.length === 0) message = "Invalid grade: Has to be a number.";
    else if (tarGPA < 0) message = "Invalid grade: Has to be non-negative.";
    else if (chosenColour === -1) message = "Invalid color: Please select a color."
    else
    {
        if(manager.createCourse(courseName, 0, tarGPA, colours[chosenColour]))
            closeBub();
        else    
            message = "Invalid course: " + courseName + " already exists.";
    }

    if (message != null) alert(message);
}

function onlyOne(colour)//can have for loop or create a pointer to each colour and then a bunch of if and elses
{
    for(let i = 1; i <= 10; i++)//will need to alter depending on how many colours we have
    {
        document.getElementById("colour" + i).checked = false;
    }
    document.getElementById(colour).checked = true;
}
