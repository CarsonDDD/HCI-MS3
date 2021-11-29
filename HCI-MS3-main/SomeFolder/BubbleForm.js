//pointers to html elements

let submitBtn = document.getElementById("submit_btn");
let cancelBtn = document.getElementById("cancel_btn");
let plusBtn = document.getElementById("plus_button");
let createBub = document.getElementById("create_bubble");
let parent = document.querySelector("body");

let colourOne = document.getElementById("colour1");
let colourTwo = document.getElementById("colour2");
let colourThree = document.getElementById("colour3");
let colourFour = document.getElementById("colour4");
let colourFive = document.getElementById("colour5");
let colourSix = document.getElementById("colour6");
let colourSeven = document.getElementById("colour7");
let colourEight = document.getElementById("colour8");
let colourNine = document.getElementById("colour9");
let colourTen = document.getElementById("colour10");
let colourEleven = document.getElementById("colour11");
let colourTwelve = document.getElementById("colour12");

//Active listeners

colourOne.addEventListener("click", onlyOne);
colourTwo.addEventListener("click", onlyOne);
colourThree.addEventListener("click", onlyOne);
colourFour.addEventListener("click", onlyOne);
colourFive.addEventListener("click", onlyOne);
colourSix.addEventListener("click", onlyOne);
colourSeven.addEventListener("click", onlyOne);
colourEight.addEventListener("click", onlyOne);
colourNine.addEventListener("click", onlyOne);
colourTen.addEventListener("click", onlyOne);
colourEleven.addEventListener("click", onlyOne);
colourTwelve.addEventListener("click", onlyOne);

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
        clear();
        closeBub();
    }
}
  
function closeBub()
{
    createBub.style.opacity = 0;
    createBub.style.left = "-1000px";
    createBub.style.top = "auto";
    createBub.style.bottom = "15%";
    clear();
}

let colours = new Array(
    "#9AB973",
    "#B4F1B3",
    "#A6D5FD",
    "#B9CBD9",
    "#CFE3E2",
    "#BCB0EE",
    "#FCCFF4",
    "#FCC9C5",
    "#FEDDD8",
    "#EAE7E2",
    "#F7F3CD",
    "#FAD6A5"
);

function addCourse()
{
    let courseName = document.getElementById("courseName").value;
    let tarGPA = Number(document.getElementById("tarGPA").value);
    let chosenColour = -1;
    let message = null;

    for(let i = 1; i <= 12; i++) //will need to alter depending on how many colours we have
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

function onlyOne()
{
    for(let i = 1; i <= 12; i++)//will need to alter depending on how many colours we have
    {
        document.getElementById("colour" + i).checked = false;
    }
    this.checked = true;
}

function clear()//ensures each time form is open then input options are clear, called after submit and close
{
    let formPop = document.getElementById("create_bubble");
    formPop.reset();
    for(let i = 1; i <= 12; i++)//will need to alter depending on how many colours we have
    {
        document.getElementById("colour" + i).checked = false;
    }
}

