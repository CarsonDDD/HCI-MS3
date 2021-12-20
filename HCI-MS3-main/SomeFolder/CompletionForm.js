//pointers to html elements

let completionCloseBtn = document.getElementById("completion_close_btn");
let completionDiv = document.getElementById("completion_div");
let taskType = document.getElementById("task_type");
let taskInfo = document.getElementById("task_info");
let taskShown = null;

//variables for dragging

let completionPrevXInfo = 0, completionPrevYInfo = 0;// topInfo
let completionLeftInfo = -1, completionTopInfo = -1;

/***************************Event Listeners*************************************** */

completionDiv.addEventListener("mousedown", function(e)
{
    let inside = false;
    let clickables = new Array(completionCloseBtn);
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
        taskType.innerHTML = (isDeadline) ? "Deadline Info" : "Session Info";

        const li = document.createElement('li');
        const btn = document.createElement('button');
        const complete_btn = document.createElement('button');
        const p = document.createElement('p');
        const c = document.createElement('div');

        let n = taskInfo.children.length;
        while (n > 0)
        {
            taskInfo.removeChild(taskInfo.lastChild);
            n--;
        }

        btn.style.backgroundImage = "url('./images/ex.png')";
        btn.style.backgroundColor = "rgb(255, 0, 0)";      
        btn.style.right = "0";
        styleButton(btn);

        complete_btn.style.backgroundImage = "url('./images/check.png')";
        complete_btn.style.backgroundColor = "rgb(0, 255, 0)";
        complete_btn.style.right = "3em";
        styleButton(complete_btn);

        btn.addEventListener('click', 
        (isDeadline) ? 
        function() { removeDeadline(taskInfo, li, c, course, item); resetTooltip(); completionCloseInfo(); } :
        function() { removeSession(taskInfo, li, c, course, item, true); resetTooltip(); completionCloseInfo(); });
        complete_btn.addEventListener('click', function()
        {
            updateBubbles(course, item, false);
            removeSession(taskInfo, li, c, course, item, false);
            resetTooltip();
            completionCloseInfo();
        });
        btn.addEventListener("mouseover", function(e)
        {
            e.target.style.backgroundColor = "rgb(127, 0, 0)";
            if (isDeadline)
                createTooltip("Remove deadline", e.target);
            else
                createTooltip("Remove session", e.target);
        });
        btn.addEventListener("mouseleave", function(e)
        {
            e.target.style.backgroundColor = "rgb(255, 0, 0)";
            resetTooltip();
        });
        complete_btn.addEventListener("mouseover", function(e)
        {
            e.target.style.backgroundColor = "rgb(0, 127, 0)";
            createTooltip("Complete session", e.target);
        });
        complete_btn.addEventListener("mouseleave", function(e)
        {
            e.target.style.backgroundColor = "rgb(0, 255, 0)";
            resetTooltip();
        });

        li.style.listStyle = "none";
        li.style.marginTop = "1.5em";
        li.style.position = "relative";
        li.style.lineHeight = "1.5em";
        li.innerHTML += item.course + "</br>";
        li.innerHTML += item.type + "</br>";
        
        if (!isDeadline && getDuration(item.date, item.endDate, "12:00 AM", "12:00 AM") > 0)
            li.innerHTML += item.date + " - " + item.endDate + "</br>";
        else
            li.innerHTML += item.date + "</br>";

        p.style.position = "absolute";
        p.style.left = "50%";
        p.style.bottom = "0";

        c.innerHTML += item.comments + "</br>";
        c.style.overflow = "auto";
        c.style.borderBottom = "0.1rem solid black";
        c.style.whiteSpace = "pre-wrap";
        c.style.lineHeight = "1.5em";
        c.style.marginBottom = "0.5em";
        
        if (item.comments.length === 0)
        {
            c.style.display = "none";
            li.style.borderBottom = "0.1rem solid black";
            li.style.marginBottom = "0.5em";
        }
        else
            c.style.display = "block";

        if (isDeadline)
            p.innerHTML += item.time;
        else
            li.innerHTML += item.start + " - " + item.end + "</br>";

        if (isDeadline)
            li.appendChild(p);
        else    
            li.appendChild(complete_btn);

        li.appendChild(btn);
        taskInfo.appendChild(li);
        taskInfo.appendChild(c);

        completionOpenInfo();

        taskShown = item;
    }
    else
    {
        completionCloseInfo();
    }
}