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

formCalendarBtn.addEventListener("click", function()
{
    closeBub();
    closeInfo();

    currPage = calendarPage; 
    showPage(); currBtn = calendarBtn; 
    highlightBtn(calendarBtn);
    taskShown = null;
    calendar.render();
    resetTooltip()
})

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

        openInfo();
    }
    else if (e.target === currBubbleDiv)
    {
        closeInfo();
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

    let crs = manager.courseList[idx];

    if (crs === course)
    {
        const ul = document.createElement('ul');

        let n = panel.children.length;
        if (n > 0)
            panel.removeChild(panel.lastChild);

        panel.appendChild(ul);

        let array = (forDeadlines) ? course.deadlineArray : course.sessionArray;
        array.sort(sort);

        if (array.length === 0)
        {
            if (forDeadlines)
                panel.innerHTML = "You have no important dates for this course. Go to the Calendar page to set one!";
            else
                panel.innerHTML = "You have no sessions for this course. Go the the Calendar page to set one!";

            panel.style.paddingTop = "10%";
            panel.style.fontSize = "1.5rem";
            panel.style.textAlign = "center";
        }
        else
        {
            panel.style.padding = "0 2rem";
            panel.style.textAlign = "left";
            panel.style.fontSize = 0;
        }

        array.forEach(function (item) {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            const p = document.createElement('p');
            const c = document.createElement('div');
    
            btn.style.backgroundImage = "url('./images/edit.png')";
            btn.style.backgroundColor = "rgb(255, 255, 255)";      
            btn.style.right = "0";
            styleButton(btn);

            btn.addEventListener('click', function()
            {
                closeBub();
                closeInfo();
                currPage = calendarPage;
                showPage();
                currBtn = calendarBtn;
                highlightBtn(calendarBtn);
                taskShown = null;
                calendar.render();
                generateCompletionForm(item, item instanceof Deadlines, c);

                resetTooltip();
            })
    
            btn.addEventListener("mouseover", function(e)
            {
                e.target.style.backgroundColor = "rgb(127, 127, 127)";
                if (forDeadlines)
                    createTooltip("Edit date", e.target);
                else
                    createTooltip("Edit session", e.target);
            });
            btn.addEventListener("mouseleave", function(e)
            {
                e.target.style.backgroundColor = "rgb(255, 255, 255)";
                resetTooltip();
            });
    
            li.style.listStyle = "none";
            li.style.marginTop = "1.5em";
            li.style.position = "relative";
            li.style.lineHeight = "1.5em";
            li.innerHTML += item.type + "</br>";
            li.style.fontSize = "1rem";

            if (!forDeadlines && getDuration(item.date, item.endDate, "12:00 AM", "12:00 AM") > 0)
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

            if (forDeadlines)
                p.innerHTML += item.time;
            else
                li.innerHTML += item.start + " - " + item.end + "</br>";
        
            li.appendChild(p);
            li.appendChild(btn);
            ul.appendChild(li);
            ul.appendChild(c);
        });
    }
}

function removeDeadline(ul, li, c, course, item)
{
    ul.removeChild(li);
    ul.removeChild(c);
    course.removeDeadline(item);
    manager.removeDeadline(item);
    main();
}

function removeSession(ul, li, c, course, item, removed)
{
    ul.removeChild(li);
    ul.removeChild(c);
    course.removeSession(item, removed);
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
    let duration = getDuration(item.date, item.endDate, item.start, item.end);
   
    if (undo)
    {
        course.addHours(-duration);
    }
    else
    {
        course.addHours(duration);
    }

    manager.updateMenu();
    menu.generateBubbles();
    hours.innerHTML = Math.floor(course.totalHours) + " hr/s and " + Math.round((course.totalHours % 1) * 60, 0) + " min/s";
}

function getDuration(startDate, endDate, startTime, endTime)
{
    let a = new Session("", startDate, 0, startTime, 0, 0, "");
    let b = new Session("", endDate, 0, endTime, 0, 0, "");

    return sort(b, a) / 1000 / 3600;
}