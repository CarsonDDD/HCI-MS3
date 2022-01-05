//pointers to html elements

let completionCloseBtn = document.getElementById("completion_close_btn");
let completionDiv = document.getElementById("completion_div");
let taskType = document.getElementById("task_type");
let courseNameEvent = document.getElementById("courseNameEvent"); 
let deadlineInfoDiv = document.getElementById("deadline_info_div");
let sessionInfoDiv = document.getElementById("session_info_div");

let deadline_info_type_p = document.getElementById("deadline_info_type_p");
let deadline_info_date_p = document.getElementById("deadline_info_date_p");
let deadline_info_time_p = document.getElementById("deadline_info_time_p");

let session_info_purpose_p = document.getElementById("session_info_purpose_p");
let session_info_startDate_p = document.getElementById("session_info_startDate_p");
let session_info_endDate_p = document.getElementById("session_info_endDate_p");
let session_info_startTime_p = document.getElementById("session_info_startTime_p");
let session_info_endTime_p = document.getElementById("session_info_endTime_p");

let event_comments = document.getElementById("event_comments");
let event_comments_div = document.getElementById("event_comments_div");

let complete_event_btn = document.getElementById("complete_event_btn");
let remove_event_btn = document.getElementById("remove_event_btn");

let undo_button = document.getElementById("undo_btn");

let removedTasks = new Array();
let rOrC = new Array();

let taskShown = null;

//variables for dragging

let completionPrevXInfo = 0, completionPrevYInfo = 0;// topInfo
let completionLeftInfo = -1, completionTopInfo = -1;

/***************************Event Listeners*************************************** */

completionDiv.addEventListener("mousedown", function(e)
{
    let inside = false;
    let clickables = new Array(completionCloseBtn, complete_event_btn, remove_event_btn);
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
remove_event_btn.addEventListener("click", function()
{
    if (taskShown !== null)
    {
        let course = null;

        for (let i = 0; i < manager.courseList.length && course === null; i++)
        {
            let c = manager.courseList[i];
            if (c.name === taskShown.course)
            {
                course = c;
            }
        }

        if (course !==  null)
        {
            if (taskShown instanceof Deadlines)
            {
                manager.removeDeadline(taskShown);
                course.removeDeadline(taskShown);
                main();
            }
            else
            {
                course.removeSession(taskShown, true);
            }
            undo_button.style.opacity = 1;

            removedTasks.push(taskShown);
            rOrC.push(true);

            updateUndo();
            completionCloseInfo();
        }
    }
})
complete_event_btn.addEventListener("click", function()
{
    if (taskShown !== null)
    {
        let course = null;

        for (let i = 0; i < manager.courseList.length && course === null; i++)
        {
            let c = manager.courseList[i];
            if (c.name === taskShown.course)
            {
                course = c;
            }
        }

        if (course !==  null)
        {
            if (taskShown instanceof Session)
            {
                updateBubbles(course, taskShown, false);
                course.removeSession(taskShown);

                removedTasks.push(taskShown);
                rOrC.push(false);

                completionCloseInfo();
                undo_button.style.opacity = 1;
                updateUndo();
            }
        }
    }
})

undo_button.addEventListener("mouseover", function()
{
    if (undo_button.style.opacity == 1)
    {
        undo_button.style.backgroundColor = "rgb(10, 126, 126)";     
        undo_button.style.cursor = "pointer";
        createTooltip("Undo", undo_button);
    }
})

undo_button.addEventListener("mouseleave", function()
{
    undo_button.style.backgroundColor = "rgb(0, 85, 85)";
    undo_button.style.cursor = "default";
    resetTooltip();
})

undo_button.addEventListener("click", function()
{
    if (undo_button.style.opacity == 1)
    {
        let last = removedTasks.pop();
        let lastROrC = rOrC.pop();
        let idx = -1;

        for (let i = 0; i < manager.courseList.length && idx === -1; i++)
        {
            if (manager.courseList[i].name === last.course)
            {
                idx = i;
            }
        }

        if (last instanceof Deadlines)
        {
            manager.createDeadline(last.course, last.date, last.time, last.type, last.comments);
        }
        else
        {
            manager.createSession(last.course, last.date, last.endDate, last.start, last.end, last.type, last.comments);

            if (!lastROrC)
            {
                updateBubbles(manager.courseList[idx], last, true);
            }
        }

        main();
        updateUndo();
        updateCalendar();
        resetTooltip();
    }
})

function updateUndo()
{
    if (removedTasks.length !== 0)
    {
        undo_button.style.opacity = 1;
    }
    else
    {
        undo_button.style.opacity = 0.5;
        undo_button.style.backgroundColor = "rgb(0, 85, 85)";
    }
}

function completionMoveInfo(e)//moveInfo(e)
{
    completionLeftInfo += e.pageX - completionPrevXInfo;
    completionTopInfo += e.pageY - completionPrevYInfo;    

    fitCompletion();

    completionPrevXInfo = e.pageX;
    completionPrevYInfo = e.pageY;
    completionDiv.style.left = completionLeftInfo + "px";
    completionDiv.style.top = completionTopInfo + "px";
}

function fitCompletion()
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

function completionOpenInfo()
{    
    if (completionDiv.style.opacity == 0) //not shown yet
    {
        if (completionLeftInfo == -1) //not yet moved
        {
            let rect = document.getElementById("calendar_page").getBoundingClientRect();
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

    taskShown = null;
    updateCalendar();
}

function generateCompletionForm(item, isDeadline, course)
{
    if (taskShown === null || taskShown !== item)
    {
        taskType.innerHTML = (isDeadline) ? "Date Info" : "Session Info";
        courseNameEvent.innerHTML = item.course;

        if (isDeadline)
        {
            deadlineInfoDiv.style.display = "flex";
            sessionInfoDiv.style.display = "none";

            deadline_info_type_p.innerHTML = item.type;
            deadline_info_date_p.innerHTML = item.date;
            deadline_info_time_p.innerHTML = item.time;
        }
        else
        {
            deadlineInfoDiv.style.display = "none";
            sessionInfoDiv.style.display = "flex";

            session_info_purpose_p.innerHTML = item.type;
            session_info_startDate_p.innerHTML = item.date;
            session_info_endDate_p.innerHTML = item.endDate;
            session_info_startTime_p.innerHTML = item.start;
            session_info_endTime_p.innerHTML = item.end;
        }

        if (item.comments.length === 0)
        {
            event_comments.style.display = "none";
        }
        else
        {
            event_comments.style.display = "flex";
        }
        event_comments.innerHTML = item.comments;

        if (isDeadline)
        {
            complete_event_btn.style.display = "none";
            remove_event_btn.innerHTML = "Remove date";
        }
        else
        {
            complete_event_btn.style.display = "block";
            complete_event_btn.innerHTML = "Complete session";
            remove_event_btn.innerHTML = "Remove session";
        }

        completionOpenInfo();

        taskShown = item;
    }
    else
    {
        completionCloseInfo();
    }
}