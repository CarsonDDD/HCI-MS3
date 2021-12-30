//pointers to html elements

let calForm1 = document.getElementById("sched_div");
let closeBtnCal1 = document.getElementById("calendar_close_btn");
let submitBtnCal1 = document.getElementById("calendar_submit_btn");
let courses = document.getElementById("courses");
let deadline_types = document.getElementById("deadline_types");
let session_purposes = document.getElementById("session_purposes");
let time_text = document.getElementById("time_text");
let start_time = document.getElementById("start_time");
let end_time = document.getElementById("end_time");
let deadline_date = document.getElementById("deadline_date");
let start_date = document.getElementById("start_date");
let end_date = document.getElementById("end_date");

let deadline_radio = document.getElementById("deadline_radio");
let session_radio = document.getElementById("session_radio");

let deadline_form = document.getElementById("deadline_form");
let session_form = document.getElementById("session_form");

let comments = document.getElementById("comments");

//variables for dragging

let prevXCal1 = 0, prevYCal1 = 0;
let leftCal1 = -1, topCal1 = -1;

/***************************Event Listeners*************************************** */

calForm1.addEventListener("mousedown", function(e)
{
    let inside = false;
    let clickables = new Array(closeBtnCal1, submitBtnCal1, courses, deadline_types, session_purposes,
        deadline_date, start_time, end_time, time_text, start_date, end_date, deadline_radio, session_radio, comments);

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
        prevXCal1 = e.pageX;
        prevYCal1 = e.pageY;
        leftCal1 = (calForm1.getBoundingClientRect().left - parent.getBoundingClientRect().left);
        topCal1 = (calForm1.getBoundingClientRect().top - parent.getBoundingClientRect().top);
        calForm1.style.cursor = "grabbing";
        parent.addEventListener("mousemove", moveCal1);
        parent.addEventListener("mouseleave", function()
        {
            calForm1.style.cursor = "grab";
            parent.removeEventListener("mousemove", moveCal1);
        })
    }
})
window.addEventListener("mouseup", function()
{
    calForm1.style.cursor = "grab";
    parent.removeEventListener("mousemove", moveCal1);
})
calForm1.addEventListener("mouseleave", function()
{
    calForm1.style.cursor = "grab";
    parent.removeEventListener("mousemove", moveCal1);
})
window.addEventListener("resize", function()
{
    leftCal1 = -1;
    topCal1 = -1;

    if (calForm1.style.opacity == 1)
    {
        closeCal1();
        openCal1();
    }
})
closeBtnCal1.addEventListener("click", function()
{
    closeCal1();
})
deadline_radio.addEventListener("click", function()
{
    if (deadline_radio.style.backgroundColor !== "black")
    {
        deadline_radio.style.backgroundColor = "black";
        session_radio.style.backgroundColor = "white";

        deadline_form.style.display = "block";
        session_form.style.display = "none";
    }
})
session_radio.addEventListener("click", function()
{
    if (session_radio.style.backgroundColor !== "black")
    {
        session_radio.style.backgroundColor = "black";
        deadline_radio.style.backgroundColor = "white";

        deadline_form.style.display = "none";
        session_form.style.display = "block";
    }
})
submitBtnCal1.addEventListener("click", function()
{
    if (deadline_radio.style.backgroundColor === "black")
    {
        let message = null;

        if (courses.value.length === 0)
            message = "Invalid course";
        else if (time_text.value.length === 0)
            message = "Invalid time";
        else if (deadline_date.value.length === 0)
            message = "Invalid date";
        else
        {
            let time = getTime(time_text.value);

            manager.createDeadline(courses.value, deadline_date.value, time, deadline_types.value, comments.value);

            main();
            closeCal1();
        }

        if (message !== null)
            alert(message);
    }
    else
    {
        let message = null;

        if (courses.value.length === 0)
            message = "Invalid course";
        else if (start_time.value.length === 0)
            message = "Invalid start time";
        else if (end_time.value.length === 0)
            message = "Invalid end time";
        else if (start_date.value.length === 0)
            message = "Invalid start date";
        else if (end_date.value.length === 0)
            message = "Invalid end date";
        else if (getDuration(start_date.value, end_date.value, getTime(start_time.value), getTime(end_time.value)) < 0)
            message = "Invalid end date: Can't be before start date"
        else
        {
            let startTime = getTime(start_time.value);
            let endTime = getTime(end_time.value);
                   
            manager.createSession(courses.value, start_date.value, end_date.value, startTime, endTime, session_purposes.value, comments.value);

            closeCal1();
        }

        if (message !== null)
            alert(message);
    }
})

function getTime(time)
{
    let n = 0;
    for (let i = 0; i < time.length; i++)
    {
        if (time[i] === ":")
            n++;
    }

    if (n != 1)
        time = time.substring(0, time.lastIndexOf(":"));

    let colonIdx = time.indexOf(":");
    let hrs = parseInt(time.substring(0, colonIdx));
    let min = time.substring(colonIdx + 1);
    let t = "AM";

    if (hrs < 12)
        t = "AM";
    else 
    {
        t = "PM";
        hrs -= 12;
    }

    if (hrs === 0)
        hrs = 12;
    
    time = hrs + ":" + min + " " + t;

    return time;
}

/**************************************************************************************** */

function moveCal1(e)
{
    leftCal1 += e.pageX - prevXCal1;
    topCal1 += e.pageY - prevYCal1;    

    fitCal1();

    prevXCal1 = e.pageX;
    prevYCal1 = e.pageY;
    calForm1.style.left = leftCal1 + "px";
    calForm1.style.top = topCal1 + "px";
}

function fitCal1()
{
    let rect = calForm1.getBoundingClientRect();

    if (leftCal1 < 0)
        leftCal1 = 0;
    if (topCal1 < 0)
        topCal1 = 0;
    if (leftCal1 + rect.width > window.innerWidth)
        leftCal1 = window.innerWidth - rect.width;

    let high = window.innerHeight;
    // if (window.innerWidth <= 600)
    //     high *= 2;

    if (topCal1 + rect.height > high)
        topCal1 = high - rect.height;
}

function openCal1()
{   
    if (calForm1.style.opacity == 0) //not shown yet
    {
        if (leftCal1 == -1) //not yet moved
        {
            let rect = document.getElementById("calendar_page").getBoundingClientRect();
            let middle = (rect.left + rect.width / 2) / window.innerWidth;

            calForm1.style.left = "calc(" + 100 * middle + "% - " + calForm1.getBoundingClientRect().width / 2 + "px)";
        }
        else
        {   
            calForm1.style.left = leftCal1 + "px";
            calForm1.style.top = topCal1 + "px";
        }

        calForm1.style.opacity = 1;

        //generate everything

        let n = courses.children.length;

        for (let i = 0; i < n; i++)
            courses.removeChild(courses.lastChild);

        for (let i = 0; i < manager.courseList.length; i++)
        {
            let newOption = document.createElement("option");
            newOption.innerHTML = manager.courseList[i].name;
            newOption.value = manager.courseList[i].name;

            courses.appendChild(newOption);
        }

        //reset everything
        deadline_radio.style.backgroundColor = "black";
        session_radio.style.backgroundColor = "white";
        deadline_types.value = "Assignment";
        session_purposes.value = "Study";
        deadline_form.style.display = "block";
        session_form.style.display = "none";
        time_text.value = "";
        start_time.value = "";
        end_time.value = "";
        comments.value = "";
    }
}
  
function closeCal1()
{
    calForm1.style.opacity = 0;
    calForm1.style.left = "-1000px";
    calForm1.style.top = "auto";
    calForm1.style.bottom = "15%";
    updateCalendar();
    calendar.unselect();
}