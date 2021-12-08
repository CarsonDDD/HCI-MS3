//pointers to html elements

let closeBtn = document.getElementById("close_btn");
let formCalendarBtn = document.getElementById("form_calendar_btn");
let infoDiv = document.getElementById("info_div");
let deadline_btn = document.getElementById("deadlines");
let session_btn = document.getElementById("sessions");
let deadline = document.getElementById("form_deadline_panel");
let session = document.getElementById("form_session_panel");

let changeName = document.getElementById("change_name");
let changeGrade = document.getElementById("change_grade");
let changeColor = document.getElementById("change_color");

let nameText = document.getElementById("course_name_text");
let gradeText = document.getElementById("target_grade_text");

let courseName = document.getElementById("course_name");
let grade = document.getElementById("target_grade");
let hours = document.getElementById("hours");

let colorAux = document.getElementById("color_div_aux");
let pickers = document.querySelectorAll(".picker");
let color = document.getElementById("color");

let undo_btn1 = document.getElementById("form_undo_btn1");
let undo_btn2 = document.getElementById("form_undo_btn2");

//variables for dragging

let prevXInfo = 0, prevYInfo = 0;
let leftInfo = -1, topInfo = -1;

//variables for selection

let selectedColorInfo = "rosybrown";
let defaultColorInfo = "rgb(255, 191, 191)";
let hoverColorInfo = "rgb(158, 118, 118)";
let selected = deadline_btn;

let selectedPicker = null;
let currBubbleDiv = null;

/***************************Event Listeners*************************************** */

infoDiv.addEventListener("mousedown", function(e)
{
    let inside = false;
    let clickables = new Array(nameText, gradeText, changeName, changeGrade, changeColor, deadline_btn, session_btn, closeBtn, formCalendarBtn);
    clickables = clickables.concat(Array.from(document.querySelectorAll(".picker")));
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
        prevXInfo = e.pageX;
        prevYInfo = e.pageY;
        leftInfo = (infoDiv.getBoundingClientRect().left - parent.getBoundingClientRect().left);
        topInfo = (infoDiv.getBoundingClientRect().top - parent.getBoundingClientRect().top);
        infoDiv.style.cursor = "grabbing";
        parent.addEventListener("mousemove", moveInfo);
        parent.addEventListener("mouseleave", function()
        {
            infoDiv.style.cursor = "grab";
            parent.removeEventListener("mousemove", moveInfo);
        })
    }
})
window.addEventListener("mouseup", function()
{
    infoDiv.style.cursor = "grab";
    parent.removeEventListener("mousemove", moveInfo);
})
infoDiv.addEventListener("mouseleave", function()
{
    infoDiv.style.cursor = "grab";
    parent.removeEventListener("mousemove", moveInfo);
})
window.addEventListener("resize", function()
{
    leftInfo = -1;
    topInfo = -1;

    if (infoDiv.style.opacity == 1)
    {
        closeInfo();
        openInfo();
    }
})
closeBtn.addEventListener("click", function()
{
    closeInfo();
})
deadline_btn.addEventListener("mouseover", overButton);
deadline_btn.addEventListener("mouseleave", leaveButton);
deadline_btn.addEventListener("click", clickButton);
session_btn.addEventListener("mouseover", overButton);
session_btn.addEventListener("mouseleave", leaveButton);
session_btn.addEventListener("click", clickButton);

/***********************************For tooltips********************************************/

changeName.addEventListener("mouseover", function()
{
    if (changeName.style.backgroundColor === "rgb(175, 175, 175)") 
        createTooltip("Edit course name", changeName);
    else
        createTooltip("Apply change", changeName);
});
changeName.addEventListener("mouseleave", function()
{
    resetTooltip();
});

changeGrade.addEventListener("mouseover", function()
{
    if (changeGrade.style.backgroundColor === "rgb(175, 175, 175)") 
        createTooltip("Edit target grade", changeGrade);
    else    
        createTooltip("Apply change", changeGrade);
});
changeGrade.addEventListener("mouseleave", function()
{
    resetTooltip();
});

changeColor.addEventListener("mouseover", function()
{
    if (changeColor.style.backgroundColor === "rgb(175, 175, 175)") 
        createTooltip("Edit bubble color", changeColor);
    else
        createTooltip("Apply change", changeColor);
});
changeColor.addEventListener("mouseleave", function()
{
    resetTooltip();
});

/***********************************************************************/

changeName.addEventListener("click", function(e)
{
    if (changeName.style.backgroundColor === "rgb(175, 175, 175)") //convert to confirm button
    {
        changeName.style.backgroundColor = "#04aa6d";
        changeName.style.backgroundImage = "url('./images/check.png')";
        courseName.style.display = "none";
        nameText.style.display = "block";
        nameText.value = "";
        nameText.placeholder = "Enter new course name";

        createTooltip("Apply change", changeName);
    }
    else //convert to edit button
    {
        changeName.style.backgroundColor = "rgb(175, 175, 175)";
        changeName.style.backgroundImage = "url('./images/edit.png')";
        courseName.style.display = "block";
        nameText.style.display = "none";

        let newName = nameText.value;
        let message = null;

        if (newName !== courseName.innerHTML && manager.exists(newName)) message = "Invalid course: " + newName + " already exists.";
        else if (newName.length > 0) //name can't be the empty string or can't be a repeat
        {
            let course = -1, bubble = -1;
            for (let i = 0; i < manager.courseList.length && (course == -1 || bubble == -1); i++)
            {
                if (manager.courseList[i].name === courseName.innerHTML)
                    course = manager.courseList[i];
                if (menu.bubbles[i].label === courseName.innerHTML)
                    bubble = menu.bubbles[i];
            }

            //update the name variable of the deadlines
            for (let i = 0; i < course.deadlineArray.length; i++)
            {
                course.deadlineArray[i].course = newName; 
            }
            //update the name variable of the sessions
            for (let i = 0; i < course.sessionArray.length; i++)
            {
                course.sessionArray[i].course = newName;
            }
            course.name = newName; 
            courseName.innerHTML = newName; 
            bubble.label = newName;
            bubble.div.innerHTML = newName;
            main(); //update the deadline panel since name has been changed
        }

        if (message !== null) alert(message);

        createTooltip("Edit course name", changeName);
    }
});
changeGrade.addEventListener("click", function(e)
{
    if (changeGrade.style.backgroundColor === "rgb(175, 175, 175)") //convert to confirm button
    {
        changeGrade.style.backgroundColor = "#04aa6d";
        changeGrade.style.backgroundImage = "url('./images/check.png')";
        grade.style.display = "none";
        gradeText.style.display = "block";
        gradeText.value = "";
        gradeText.placeholder = "Enter new target grade";

        createTooltip("Apply change", changeGrade);
    }
    else //convert to edit button
    {
        changeGrade.style.backgroundColor = "rgb(175, 175, 175)";
        changeGrade.style.backgroundImage = "url('./images/edit.png')";
        grade.style.display = "block";
        gradeText.style.display = "none";

        let newGrade = Number(gradeText.value);
        let message = null;

        if (isNaN(newGrade)) message = "Invalid grade: Has to be a number";
        else if (gradeText.value.length > 0 && newGrade < 0) message = "Invalid grade: Has to be non-negative";
        else if (gradeText.value.length > 0)
        {
            let course = -1;
            for (let i = 0; i < manager.courseList.length && course == -1; i++)
            {
                if (manager.courseList[i].name === courseName.innerHTML)
                    course = manager.courseList[i];
            }

            course.grade = newGrade;
            grade.innerHTML = newGrade;
        }

        if (message !== null) alert(message);

        createTooltip("Edit target grade", changeGrade);
    }
});

changeColor.addEventListener("click", function(e)
{
    if (changeColor.style.backgroundColor === "rgb(175, 175, 175)") //convert to confirm button
    {
        changeColor.style.backgroundColor = "#04aa6d";
        changeColor.style.backgroundImage = "url('./images/check.png')";
        color.style.display = "none";
        for (let i = 0; i < pickers.length; i++)
        {
            pickers[i].style.display = "block";
            pickers[i].style.backgroundColor = colours[i];
            pickers[i].addEventListener("click", pickPicker);
        }
        colorAux.style.display = "flex";

        createTooltip("Apply change", changeColor);
    }
    else //convert to edit button
    {
        changeColor.style.backgroundColor = "rgb(175, 175, 175)";
        changeColor.style.backgroundImage = "url('./images/edit.png')";
        color.style.display = "block";
        pickers.forEach(element => {
            element.style.display = "none";
            element.removeEventListener("click", pickPicker);
        });
        colorAux.style.display = "none";

        if (selectedPicker !== null)
        {
            let course = -1, bubble = -1;
            for (let i = 0; i < manager.courseList.length && (course == -1 || bubble == -1); i++)
            {
                if (manager.courseList[i].name === courseName.innerHTML)
                    course = manager.courseList[i];
                if (menu.bubbles[i].label === courseName.innerHTML)
                    bubble = menu.bubbles[i];
            }

            let newColour = selectedPicker.style.backgroundColor;

            course.color = newColour;
            color.style.backgroundColor = newColour;
            bubble.colour = newColour;
            bubble.div.style.backgroundColor = newColour;
        }

        resetPickers();
        createTooltip("Edit bubble color", changeColor);
    }
});

undo_btn1.addEventListener("mouseover", function()
{
    if (undo_btn1.style.opacity == 1)
    {
        undo_btn1.style.backgroundColor = "rgb(200, 200, 200)";
        createTooltip("Undo", undo_btn1);
    }
});

undo_btn1.addEventListener("mouseleave", function()
{
    undo_btn1.style.backgroundColor = "rgb(255, 255, 255)";
    resetTooltip();
});

undo_btn1.addEventListener("click", function()
{
    if (currBubbleDiv !== null && undo_btn1.style.opacity == 1)
    {
        let idx = -1;

        for (let i = 0; i < menu.bubbles.length && idx === -1; i++)
        {
            if (menu.bubbles[i].div === currBubbleDiv)
                idx = i;
        }

        let course = manager.courseList[idx];
        let last = course.removedDeadlines.pop();

        idx = -1;

        for (let i = 0; i < manager.removedDeadlines.length && idx === -1; i++)
        {
            if (manager.removedDeadlines[i] === last)
                idx = i;
        }

        for (let i = idx; i < manager.removedDeadlines.length - 1; i++)
        {
            manager.removedDeadlines[i] = manager.removedDeadlines[i + 1];
        }

        manager.removedDeadlines.pop();

        manager.createDeadline(last.course, last.date, last.time, last.type);

        generatePanel(course, deadline, true); 
        updateUndoBtns(course);
        updateUndo();
        main();
        resetTooltip();
    }
});

undo_btn2.addEventListener("mouseover", function()
{
    if (undo_btn2.style.opacity == 1)
    {
        undo_btn2.style.backgroundColor = "rgb(200, 200, 200)";
        createTooltip("Undo", undo_btn2);
    }
});

undo_btn2.addEventListener("mouseleave", function()
{
    undo_btn2.style.backgroundColor = "rgb(255, 255, 255)";
    resetTooltip();
})

undo_btn2.addEventListener("click", function()
{
    if (currBubbleDiv !== null && undo_btn2.style.opacity == 1)
    {
        let idx = -1;

        for (let i = 0; i < menu.bubbles.length && idx === -1; i++)
        {
            if (menu.bubbles[i].div === currBubbleDiv)
                idx = i;
        }

        let course = manager.courseList[idx];
        let last = course.removedSessions.pop();
        let rOrC = course.removeOrComplete.pop();
        manager.createSession(last.course, last.date, last.start, last.end, last.type);

        if (!rOrC)
            updateBubbles(course, last, true);

        generatePanel(course, session, false); 
        updateUndoBtns(course);
        main();
        resetTooltip();
    }
});

/**************************************************************************************** */

function pickPicker(e)
{
    pickers.forEach(element => {
        element.style.border = "2px solid black";  
      });
    selectedPicker = (selectedPicker != null && selectedPicker === e.target) ? null : e.target;

    if (selectedPicker != null)
          selectedPicker.style.border = "5px solid black";
}

function resetPickers()
{
    selectedPicker = null;
    pickers.forEach(element => {
        element.style.border = "2px solid black";  
    });
}

function resetEdits() 
{
    changeName.style.backgroundImage = "url('./images/edit.png')";
    changeGrade.style.backgroundImage = "url('./images/edit.png')";
    changeColor.style.backgroundImage = "url('./images/edit.png')";
    changeName.style.backgroundColor = "rgb(175, 175, 175)";
    changeGrade.style.backgroundColor = "rgb(175, 175, 175)";
    changeColor.style.backgroundColor = "rgb(175, 175, 175)";
    courseName.style.display = "block";
    nameText.style.display = "none";
    grade.style.display = "block";
    gradeText.style.display = "none";
    color.style.display = "block";
    pickers.forEach(element => {
        element.style.display = "none";
        element.removeEventListener("click", pickPicker);
    });
    colorAux.style.display = "none";
}

function clickButton(e)
{
    if (e.target !== selected) //pick new mode
    {
        selected = e.target;
        resetButtons();
    }   
}

function resetButtons()
{
    deadline_btn.style.backgroundColor = defaultColorInfo;
    session_btn.style.backgroundColor = defaultColorInfo;
    deadline_btn.style.cursor = "pointer";
    session_btn.style.cursor = "pointer";
    deadline.style.display = "none";
    session.style.display = "none";

    selected.style.backgroundColor = selectedColorInfo;
    selected.style.cursor = "default";
    if (selected === deadline_btn)
        deadline.style.display = "block";
    else
        session.style.display = "block";
}

function overButton(e)
{
    if (e.target !== selected)
    {
        e.target.style.backgroundColor = hoverColorInfo;
    }
}

function leaveButton(e)
{
    if (e.target !== selected)
    {
        e.target.style.backgroundColor = defaultColorInfo;
    }
}

function moveInfo(e)
{
    leftInfo += e.pageX - prevXInfo;
    topInfo += e.pageY - prevYInfo;    

    fitInfo();

    prevXInfo = e.pageX;
    prevYInfo = e.pageY;
    infoDiv.style.left = leftInfo + "px";
    infoDiv.style.top = topInfo + "px";
}

function fitInfo()
{
    let rect = infoDiv.getBoundingClientRect();

    if (leftInfo < 0)
        leftInfo = 0;
    if (topInfo < 0)
        topInfo = 0;
    if (leftInfo + rect.width > window.innerWidth)
        leftInfo = window.innerWidth - rect.width;

    let high = window.innerHeight;
    if (window.innerWidth <= 600)
        high *= 2;

    if (topInfo + rect.height > high)
        topInfo = high - rect.height;
}

function openInfo()
{
    selected = deadline_btn;
    resetButtons();
    resetEdits();
    resetPickers();
    
    if (infoDiv.style.opacity == 0) //not shown yet
    {
        if (leftInfo == -1) //not yet moved
        {
            let rect = document.getElementById("home_main").getBoundingClientRect();
            let middle = (rect.left + rect.width / 2) / window.innerWidth;

            infoDiv.style.left = "calc(" + 100 * middle + "% - " + infoDiv.getBoundingClientRect().width / 2 + "px)";
        }
        else
        {   
            infoDiv.style.left = leftInfo + "px";
            infoDiv.style.top = topInfo + "px";
        }

        infoDiv.style.opacity = 1;
    }
}
  
function closeInfo()
{
    infoDiv.style.opacity = 0;
    infoDiv.style.left = "-1000px";
    infoDiv.style.top = "auto";
    infoDiv.style.bottom = "15%";

    currBubbleDiv = null;
}

function clickBubble(e)
{
    resetTooltip();

    if (currBubbleDiv === null || e.target !== currBubbleDiv) 
    {   
        let idx = -1;
        currBubbleDiv = e.target;

        for (let i = 0; i < menu.bubbles.length && idx === -1; i++)
        {
            if (menu.bubbles[i].div === e.target)
                idx = i;
        }

        let course = manager.courseList[idx];

        //update content of info div
        document.getElementById("course_name").innerHTML = course.name;
        document.getElementById("target_grade").innerHTML = course.grade;
        document.getElementById("color").style.backgroundColor = course.color;
        document.getElementById("hours").innerHTML = Math.floor(course.totalHours) + " hr/s and " + Math.round((course.totalHours % 1) * 60, 0) + " min/s";

        generatePanel(course, deadline, true);
        generatePanel(course, session, false);      
        updateUndoBtns(course);

        openInfo();
    }
    else if (e.target === currBubbleDiv)
    {
        closeInfo();
    }
}

function updateUndoBtns(course)
{
    let idx = -1;

    for (let i = 0; i < menu.bubbles.length && idx === -1; i++)
    {
        if (menu.bubbles[i].div === currBubbleDiv)
        idx = i;
    }

    let c = manager.courseList[idx];

    if (c === course)
    {
        if (course.removedDeadlines.length !== 0)
            undo_btn1.style.opacity = 1;
        else
        {    
            undo_btn1.style.opacity = 0.5;
            undo_btn1.style.backgroundColor = "rgb(255, 255, 255)";
        }

        if (course.removedSessions.length !== 0)
            undo_btn2.style.opacity = 1;
        else    
        {
            undo_btn2.style.opacity = 0.5;
            undo_btn2.style.backgroundColor = "rgb(255, 255, 255)";
        }
    }
}

function generatePanel(course, panel, forDeadlines) //this function generates both the deadline and session panel on the form
{
    let idx = -1;

    for (let i = 0; i < menu.bubbles.length && idx === -1; i++)
    {
        if (menu.bubbles[i].div === currBubbleDiv)
            idx = i;
    }

    let c = manager.courseList[idx];

    if (c === course)
    {
        const ul = document.createElement('ul');

        let n = panel.children.length;
        if (n > 0)
            panel.removeChild(panel.lastChild);

        panel.appendChild(ul);

        let array = (forDeadlines) ? course.deadlineArray : course.sessionArray;
        array.sort(sort);

        array.forEach(function (item) {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            const complete_btn = document.createElement('button');
            const p = document.createElement('p');
    
            btn.style.backgroundImage = "url('./images/ex.png')";
            btn.style.backgroundColor = "rgb(255, 0, 0)";      
            btn.style.right = "0";
            styleButton(btn);

            complete_btn.style.backgroundImage = "url('./images/check.png')";
            complete_btn.style.backgroundColor = "rgb(0, 255, 0)";
            complete_btn.style.right = "6em";
            styleButton(complete_btn);

            btn.addEventListener('click', 
            (forDeadlines) ? 
            function() { removeDeadline(ul, li, course, item); resetTooltip(); } :
            function() { removeSession(ul, li, course, item, true); resetTooltip();});
            complete_btn.addEventListener('click', function()
            {
                updateBubbles(course, item, false);
                removeSession(ul, li, course, item, false);
                resetTooltip();
            });
            btn.addEventListener("mouseover", function(e)
            {
                e.target.style.backgroundColor = "rgb(127, 0, 0)";
                if (forDeadlines)
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
            li.style.margin = "1.5em 0";
            li.style.position = "relative";
            li.style.lineHeight = "1.5em";
            li.style.borderBottom = "0.1em solid black";
            li.innerHTML += item.type + "</br>";
            li.innerHTML += item.date + "</br>";
    
            p.style.position = "absolute";
            p.style.left = "50%";
            p.style.bottom = "0";

            if (forDeadlines)
                p.innerHTML += item.time;
            else
                li.innerHTML += item.start + " - " + item.end + "</br>";
        
            if (forDeadlines)
                li.appendChild(p);
            else    
                li.appendChild(complete_btn);

            li.appendChild(btn);
            ul.appendChild(li);
        });
    }
}

function removeDeadline(ul, li, course, item)
{
    ul.removeChild(li);
    course.removeDeadline(item);
    manager.removeDeadline(item);
    undo_btn1.style.opacity = 1;
    updateUndo();
    main();
}

function removeSession(ul, li, course, item, removed)
{
    ul.removeChild(li);
    course.removeSession(item, removed);
    undo_btn2.style.opacity = 1;
}

function styleButton(btn)
{
    btn.style.border = "none";
    btn.style.backgroundSize = "50%";
    btn.style.backgroundPosition = "center center"
    btn.style.backgroundRepeat = "no-repeat";
    btn.style.width = "2em";
    btn.style.height = "2em";
    btn.style.borderRadius = "1em";
    btn.style.position = "absolute";
    btn.style.top = "0";
    btn.type="button";
    btn.className = "clickable";
}

function updateBubbles(course, item, undo) //this function is called when completing a session
{
    let start = item.start;
    let end = item.end;

    let isAM1 = (start.substring(start.length - 2, start.length) === "AM");
    let isAM2 = (end.substring(end.length - 2, end.length) === "AM");

    let idxStart = start.indexOf(":");
    let idxEnd = end.indexOf(":");

    if (idxStart >= 0 && idxEnd >= 0)
    {
        let hourStart = parseInt(start.substring(0, idxStart));
        let hourEnd = parseInt(end.substring(0, idxEnd));
        let minStart = parseInt(start.substring(idxStart + 1, start.length - 2));
        let minEnd = parseInt(end.substring(idxEnd + 1, end.length - 2));

        if (!isAM1 && hourStart !== 12) hourStart += 12;
        else if (isAM1 && hourStart === 12) hourStart -= 12;
        if (!isAM2 && hourEnd != 12) hourEnd += 12;
        else if (isAM2 && hourEnd === 12) hourEnd -= 12;

        if (minEnd - minStart < 0)
        {
            hourEnd--;
            minEnd += 60;
        }

        let hourDiff = hourEnd - hourStart;
        let minDiff = minEnd - minStart;

        if (hourDiff < 0)
            hourDiff += 24;

        if (undo)
            course.addHours(-(hourDiff + (minDiff / 60)));
        else
            course.addHours(hourDiff + (minDiff / 60));

        manager.updateMenu();
        menu.generateBubbles();
        hours.innerHTML = Math.floor(course.totalHours) + " hr/s and " + Math.round((course.totalHours % 1) * 60, 0) + " min/s";
    }
}