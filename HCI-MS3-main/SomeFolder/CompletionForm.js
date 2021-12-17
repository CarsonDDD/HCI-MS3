//pointers to html elements

let completionCloseBtn = document.getElementById("completion_close_btn");
let completionDiv = document.getElementById("completion_div");

let completionCourseNameText = document.getElementById("completion_course_name_text");

let completionCourseName = document.getElementById("completion_course_name");

//variables for dragging

let completionPrevXInfo = 0, completionPrevYInfo = 0;// topInfo
let completionLeftInfo = -1, completionTopInfo = -1;

let currTaskDiv = null;//currBubbleDiv

/***************************Event Listeners*************************************** */

completionDiv.addEventListener("mousedown", function(e)
{
    let inside = false;
    let clickables = new Array(completionCourseNameText, completionCourseName, completionCloseBtn);
    clickables = clickables.concat(Array.from(document.querySelectorAll(".clickable")));

    //check to see if mouse is over a textbox; we don't want to drag the form if so
    for (let i = 0; i < clickables.length; i++)
    {
        let rect = clickables[i].getBoundingClientRect();
        let x = e.pageX;
        let y = e.pageY;
        if (x >= rect.left && x < rect.right &&
            y >= rect.top + window.scrollY && y < rect.bottom + window.scrollY)
            inside = true;      
    }

    if (!inside)
    {
        completionPrevXInfo = e.pageX;
        completionPrevYInfo = e.pageY;
        completionLeftInfo = (completionDiv.getBoundingClientRect().left - parent.getBoundingClientRect().left);
        completionTopInfo = (completionDiv.getBoundingClientRect().top - parent.getBoundingClientRect().top);
        completionDiv.style.cursor = "grabbing";
        parent.addEventListener("mousemove", completionMoveInfo);
        parent.addEventListener("mouseleave", function()
        {
            completionDiv.style.cursor = "grab";
            parent.removeEventListener("mousemove", completionMoveInfo);
        })
    }
})
window.addEventListener("mouseup", function()
{
    completionDiv.style.cursor = "grab";
    parent.removeEventListener("mousemove", completionMoveInfo);
})
completionDiv.addEventListener("mouseleave", function()
{
    completionDiv.style.cursor = "grab";
    parent.removeEventListener("mousemove", completionMoveInfo);
})
window.addEventListener("resize", function()
{
    completionLeftInfo = -1;
    completionTopInfo = -1;

    if (completionDiv.style.opacity == 1)
    {
        completionCloseInfo();
        completionOpenInfo();
    }
})
completionCloseBtn.addEventListener("click", function()
{
    completionCloseInfo();
})

function completionMoveInfo(e)//moveInfo(e)
{
    completionLeftInfo += e.pageX - completionPrevXInfo;
    completionTopInfo += e.pageY - completionPrevYInfo;    

    fitInfo();

    completionPrevXInfo = e.pageX;
    completionPrevYInfo = e.pageY;
    completionDiv.style.left = completionLeftInfo + "px";
    completionDiv.style.top = completionTopInfo + "px";
}

function fitInfo()
{
    let rect = completionDiv.getBoundingClientRect();

    if (completionLeftInfo < 0)
    completionLeftInfo = 0;
    if (completionTopInfo < 0)
        completionTopInfo = 0;
    if (completionLeftInfo + rect.width > window.innerWidth)
        completionLeftInfo = window.innerWidth - rect.width;

    let high = window.innerHeight;
    if (window.innerWidth <= 600)
        high *= 2;

    if (completionTopInfo + rect.height > high)
        completionTopInfo = high - rect.height;
}

function completionResetEdits() 
{
    completionCourseName.style.display = "block";
    completionCourseNameText.style.display = "none";
}

function completionOpenInfo()
{
    completionResetEdits();
    
    if (completionDiv.style.opacity == 0) //not shown yet
    {
        if (completionLeftInfo == -1) //not yet moved
        {
            let rect = document.getElementById("home_main").getBoundingClientRect();
            let middle = (rect.left + rect.width / 2) / window.innerWidth;

            completionDiv.style.left = "calc(" + 100 * middle + "% - " + completionDiv.getBoundingClientRect().width / 2 + "px)";
        }
        else
        {   
            completionDiv.style.left = completionLeftInfo + "px";
            completionDiv.style.top = completionTopInfo + "px";
        }

        completionDiv.style.opacity = 1;
    }
}
  
function completionCloseInfo()
{
    completionDiv.style.opacity = 0;
    completionDiv.style.left = "-1000px";
    completionDiv.style.top = "auto";
    completionDiv.style.bottom = "15%";

    currTaskDiv = null;
}

function completionClickTask(e)//e here needs to be the event we need to manipulate an array with an index or an object
{
    resetTooltip();

    if (currTaskDiv === null || e.target !== currTaskDiv) 
    {   
        let idx = -1;
        currTaskDiv = e.target;

        let course = manager.courseList[idx];//change to a calendar event id and will have to point to a specific event 

        //update content of info div
        document.getElementById("completion_course_name").innerHTML = course.name;
        //document.getElementById("hours").innerHTML = Math.floor(course.totalHours) + " hr/s and " + Math.round((course.totalHours % 1) * 60, 0) + " min/s";

        completionOpenInfo();
    }
    else if (e.target === currTaskDiv)
    {
        completionCloseInfo();
    }
}
