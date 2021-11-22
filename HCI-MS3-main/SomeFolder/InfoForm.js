import {menu} from "./Bubbles.js";
import {manager} from "./Manager.js";
import {main} from "./Manager.js";

let closeBtn = document.getElementById("close_btn");
let infoDiv = document.getElementById("info_div");//pointer to info div
let parent = document.querySelector("body");
let deadline_btn = document.getElementById("deadlines");
let session_btn = document.getElementById("sessions");
let deadline = document.getElementById("form_deadline_panel");
let session = document.getElementById("form_session_panel");

let changeName = document.getElementById("change_name");
let changeGrade = document.getElementById("change_grade");
let changeColor = document.getElementById("change_color");

let nameText = document.getElementById("course_name_text");
let gradeText = document.getElementById("target_grade_text");

let name = document.getElementById("course_name");
let grade = document.getElementById("target_grade");

let colorAux = document.getElementById("color_div_aux");
let pickers = document.querySelectorAll(".picker");
let color = document.getElementById("color");

let prevX = 0, prevY = 0;
let left = -1, top = -1;

let selectedColor = "rosybrown";
let defaultColor = "rgb(255, 191, 191)";
let hoverColor = "rgb(158, 118, 118)";
let selected = deadline_btn;

let selectedPicker = null;

infoDiv.addEventListener("mousedown", function(e)
{
    let inside = false;
    let texts = new Array(nameText, gradeText);

    for (let i = 0; i < texts.length; i++)
    {
        let rect = texts[i].getBoundingClientRect();
        let x = e.pageX;
        let y = e.pageY;
        if (x >= rect.left && x < rect.right &&
            y >= rect.top && y < rect.bottom)
            inside = true;
        
    }

    if (!inside)
    {
        prevX = e.pageX;
        prevY = e.pageY;
        left = (infoDiv.getBoundingClientRect().left - parent.getBoundingClientRect().left);
        top = (infoDiv.getBoundingClientRect().top - parent.getBoundingClientRect().top);
        infoDiv.style.cursor = "grabbing";
        parent.addEventListener("mousemove", move);
        parent.addEventListener("mouseleave", function()
        {
            infoDiv.style.cursor = "grab";
            parent.removeEventListener("mousemove", move);
        })
    }
})
window.addEventListener("mouseup", function()
{
    infoDiv.style.cursor = "grab";
    parent.removeEventListener("mousemove", move);
})
infoDiv.addEventListener("mouseleave", function()
{
    infoDiv.style.cursor = "grab";
    parent.removeEventListener("mousemove", move);
})
window.addEventListener("resize", function()
{
    left = -1;
    top = -1;

    if (infoDiv.style.opacity == 1)
    {
        closeForm();
        openForm();
    }
})
closeBtn.addEventListener("click", function()
{
    closeForm();
})
deadline_btn.addEventListener("mouseover", overButton);
deadline_btn.addEventListener("mouseleave", leaveButton);
deadline_btn.addEventListener("click", clickButton);
session_btn.addEventListener("mouseover", overButton);
session_btn.addEventListener("mouseleave", leaveButton);
session_btn.addEventListener("click", clickButton);
changeName.addEventListener("click", function(e)
{
    if (changeName.style.backgroundColor === "rgb(175, 175, 175)") //convert to confirm button
    {
        changeName.style.backgroundColor = "#04aa6d";
        changeName.style.backgroundImage = "url('./images/check.png')";
        name.style.display = "none";
        nameText.style.display = "block";
        nameText.value = "";
        nameText.placeholder = name.innerHTML;
    }
    else
    {
        changeName.style.backgroundColor = "rgb(175, 175, 175)";
        changeName.style.backgroundImage = "url('./images/edit.png')";
        name.style.display = "block";
        nameText.style.display = "none";

        let newName = nameText.value;

        if (newName.length > 0 && !manager.exists(newName))
        {
            let course = -1, bubble = -1;
            for (let i = 0; i < manager.courseList.length && (course == -1 || bubble == -1); i++)
            {
                if (manager.courseList[i].name === name.innerHTML)
                    course = manager.courseList[i];
                if (menu.bubbles[i].label === name.innerHTML)
                    bubble = menu.bubbles[i];
            }

            course.name = newName;
            name.innerHTML = newName;
            bubble.label = newName;
            bubble.div.innerHTML = newName;
        }
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
        gradeText.placeholder = grade.innerHTML;
    }
    else
    {
        changeGrade.style.backgroundColor = "rgb(175, 175, 175)";
        changeGrade.style.backgroundImage = "url('./images/edit.png')";
        grade.style.display = "block";
        gradeText.style.display = "none";

        let newGrade = Number(gradeText.value);

        if (gradeText.value.length > 0 && typeof newGrade == "number" && newGrade >= 0)
        {
            let course = -1;
            for (let i = 0; i < manager.courseList.length && course == -1; i++)
            {
                if (manager.courseList[i].name === name.innerHTML)
                    course = manager.courseList[i];
            }

            course.grade = newGrade;
            grade.innerHTML = newGrade;
        }
    }
});

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
    }
    else
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
                if (manager.courseList[i].name === name.innerHTML)
                    course = manager.courseList[i];
                if (menu.bubbles[i].label === name.innerHTML)
                    bubble = menu.bubbles[i];
            }

            let newColour = selectedPicker.style.backgroundColor;

            course.color = newColour;
            color.style.backgroundColor = newColour;
            bubble.colour = newColour;
            bubble.div.style.backgroundColor = newColour;
        }

        resetPickers();
    }
});

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
    name.style.display = "block";
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
    deadline_btn.style.backgroundColor = defaultColor;
    session_btn.style.backgroundColor = defaultColor;
    deadline_btn.style.cursor = "pointer";
    session_btn.style.cursor = "pointer";
    deadline.style.display = "none";
    session.style.display = "none";

    selected.style.backgroundColor = selectedColor;
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
        e.target.style.backgroundColor = hoverColor;
    }
}

function leaveButton(e)
{
    if (e.target !== selected)
    {
        e.target.style.backgroundColor = defaultColor;
    }
}

function move(e)
{
    left += e.pageX - prevX;
    top += e.pageY - prevY;    

    fit();

    prevX = e.pageX;
    prevY = e.pageY;
    infoDiv.style.left = left + "px";
    infoDiv.style.top = top + "px";
}

function fit()
{
    let rect = infoDiv.getBoundingClientRect();

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

export function openForm()
{
    selected = deadline_btn;
    resetButtons();
    resetEdits();
    resetPickers();
    
    if (infoDiv.style.opacity == 0) //not shown yet
    {
        if (left == -1) //not yet moved
        {
            let rect = document.getElementById("home_main").getBoundingClientRect();
            let middle = (rect.left + rect.width / 2) / window.innerWidth;

            infoDiv.style.left = "calc(" + 100 * middle + "% - " + infoDiv.getBoundingClientRect().width / 2 + "px)";
        }
        else
        {   
            infoDiv.style.left = left + "px";
            infoDiv.style.top = top + "px";
        }

        infoDiv.style.opacity = 1;
    }
}
  
function closeForm()
{
    infoDiv.style.opacity = 0;
    infoDiv.style.left = "-1000px";
    infoDiv.style.top = "auto";
    infoDiv.style.bottom = "15%";

    currBubbleDiv = null;
}

let currBubbleDiv = null;

export function clickBubble(e)
{
    if (currBubbleDiv === null || e.target !== currBubbleDiv) //no bubble has been clicked
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

        generatePanel(course, deadline, true);
        generatePanel(course, session, false);      

        openForm();
    }
    else if (e.target === currBubbleDiv)
    {
        closeForm();
    }
}

export function generatePanel(course, panel, forDeadlines)
{
    const ul = document.createElement('ul');

    let n = panel.children.length;
    if (n > 0)
        panel.removeChild(panel.lastChild);

    panel.appendChild(ul);

    let array = (forDeadlines) ? course.deadlineArray : course.sessionArray;

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
        complete_btn.style.right = "3em";
        styleButton(complete_btn);

        btn.addEventListener('click', 
        (forDeadlines) ? 
        function() { removeDeadline(ul, li, course, item); } :
        function() { removeSession(ul, li, course, item); });
        complete_btn.addEventListener('click', function()
        {
            updateBubbles(course, item);
            removeSession(ul, li, course, item);
        });
        btn.addEventListener("mouseover", function(e)
        {
            e.target.style.backgroundColor = "rgb(127, 0, 0)";
        });
        btn.addEventListener("mouseleave", function(e)
        {
            e.target.style.backgroundColor = "rgb(255, 0, 0)";
        });
        complete_btn.addEventListener("mouseover", function(e)
        {
            e.target.style.backgroundColor = "rgb(0, 127, 0)";
        });
        complete_btn.addEventListener("mouseleave", function(e)
        {
            e.target.style.backgroundColor = "rgb(0, 255, 0)";
        });
    
        li.style.listStyle = "none";
        li.style.margin = "2em 0";
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

function removeDeadline(ul, li, course, item)
{
    ul.removeChild(li);
    course.removeDeadline(item);
    manager.removeDeadline(item);
    main();
}

function removeSession(ul, li, course, item)
{
    ul.removeChild(li);
    course.removeSession(item);
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
}

function updateBubbles(course, item)
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

        if (!isAM1) hourStart += 12;
        if (!isAM2) hourEnd += 12;

        if (minEnd - minStart < 0)
        {
            hourEnd--;
            minEnd += 60;
        }

        let hourDiff = hourEnd - hourStart;
        let minDiff = minEnd - minStart;

        course.addHours(hourDiff + (minDiff / 60));
        manager.updateMenu();
        menu.generateBubbles();
    }
}