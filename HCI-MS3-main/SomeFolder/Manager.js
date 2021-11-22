import {menu} from "./Bubbles.js"
import {Course} from "./Course.js"
import {Session} from "./Session.js"
import {Deadlines} from "./Deadlines.js"
import {generatePanel} from "./InfoForm.js"

class Manager
{
    constructor()
    {
        this.numCourses=0;
        this.courseList=new Array();
        this.deadlineList=new Array();
    }

    createCourse(name,totalHours,grade,color)
    {
		if (!this.exists(name))
		{
        	let c = new Course(name,totalHours,grade,color);
        	this.numCourses++;
        	this.courseList.push(c);

			//create a bubble with corresponding size
			menu.add(0, name, color);
			this.updateMenu();
			menu.generateBubbles();

			return true;
		}
		else
			return false;
    }

    createDeadline(courseName,date,time,type)
    {
        let d= new Deadlines(courseName,date,time,type);
        for (let i=0;i<this.numCourses;i++)
        {
            if(this.courseList[i].name==courseName)
            {
                this.courseList[i].addDeadline(d);
                this.deadlineList.push(d);
            }
        }
    }

	removeDeadline(deadline)
	{
		let idx = -1;

		for (let i = 0; i < manager.deadlineList.length && idx == -1; i++)
		{
			if (manager.deadlineList[i] === deadline)
				idx = i;
		}

		if (idx >= 0 && idx < manager.deadlineList.length)
		{
			for (let i = idx; i < manager.deadlineList.length - 1; i++)
				manager.deadlineList[i] = manager.deadlineList[i + 1];
		
			manager.deadlineList.pop();
		}
	}

    createSession(courseName,date,start,end,type)
    {
        let s=new Session(courseName,date,start,end,type);
        for(let i=0;i<this.numCourses;i++)
        {
            if(this.courseList[i].name==courseName)
            {
                this.courseList[i].addSession(s);
            }
        }

    }

    printDeadlines()
    {
        for(let deadline of this.deadlineList)
        {
            console.log(deadline.toPrint());
        }
    }

	getDeadlineList()
	{
		return this.deadlineList;
	}

	exists(name)
	{
		let toReturn = false;

		for (let i = 0; i < this.courseList.length && !toReturn; i++)
		{
			if (this.courseList[i].name === name)
				toReturn = true;
		}

		return toReturn;
	}
	
	getTotalHours()
	{
		let sum = 0;
		for (let i = 0; i < this.courseList.length; i++)
			sum += this.courseList[i].totalHours;
		
		return sum;
	}

	updateMenu()
	{
		let totalHours = this.getTotalHours();
		let minSize = 50, maxSize = 200;

		for (let i = 0; i < menu.bubbles.length; i++)
		{
			let percent = (totalHours === 0) ? 0 : this.courseList[i].totalHours / totalHours;
			let rad = minSize + percent * (maxSize - minSize);
			menu.setRadius(i, rad);
		}
	}
}

export let manager = new Manager();
manager.createCourse("Comp3020",0,100,"#0000FF");
manager.createCourse("Comp3040",0,90,"#00FF00");
manager.createCourse("Comp3050",0,80,"#FF0000");
manager.createDeadline("Comp3020","21/11/2021","12am","Midterm");
manager.createDeadline("Comp3020","27/10/2021","12am","Assignment");
manager.createDeadline("Comp3020","26/9/2021","12am","Midterm");
manager.createDeadline("Comp3020","12/7/2021","12am","Assignment");
manager.createDeadline("Comp3020","5/5/2021","12am","Midterm");
manager.createDeadline("Comp3020","10/10/2021","12am","Assignment");
manager.createSession("Comp3020","21/11/2021","1:00AM","2:00PM", "Assignment");
manager.createSession("Comp3040","21/11/2021","8:00AM", "9:34PM", "Quiz");
manager.createSession("Comp3050","21/12/2021","2:00PM", "3:15PM", "General");
manager.createSession("Comp3020","21/11/2021","8:00AM", "11:59PM", "Quiz");
manager.createSession("Comp3040","21/02/2021","7:00AM", "7:30AM", "Assignment");
manager.createSession("Comp3050","21/04/2021","4:45PM", "6:15PM", "General");

export function main()
{
	const ul = document.createElement('ul');
	let elem = document.getElementById('deadline_list');

	let n = elem.children.length;
    if (n > 0)
        elem.removeChild(elem.lastChild);

	elem.appendChild(ul);

	manager.deadlineList.forEach(function (item) {
    const li = document.createElement('li');
	const btn = document.createElement('button');
	const p = document.createElement('p');

	btn.style.backgroundImage = "url('./images/ex.png')";
	btn.style.backgroundColor = "rgb(255, 0, 0)";
	btn.style.border = "none";
	btn.style.backgroundSize = "50%";
	btn.style.backgroundPosition = "center center"
	btn.style.backgroundRepeat = "no-repeat";
	btn.style.width = "2em";
	btn.style.height = "2em";
	btn.style.borderRadius = "1em";
	btn.style.position = "absolute";
	btn.style.right = "0";
	btn.style.top = "0";
	btn.type="button";
	btn.className = "deadline_btn";
	btn.addEventListener('click', function() 
	{
		ul.removeChild(li);
		manager.removeDeadline();

		let course = -1;

		for (let i = 0; i < manager.courseList.length && course == -1; i++)
		{
			if (manager.courseList[i].name === item.course)
			{
				course = manager.courseList[i];
				course.removeDeadline(item);
			}
		}

		if (course != -1)
		{
			generatePanel(course, document.getElementById("form_deadline_panel"), true);
		}
	});
	btn.addEventListener("mouseover", function(e)
	{
		e.target.style.backgroundColor = "rgb(127, 0, 0)";
	})
	btn.addEventListener("mouseleave", function(e)
	{
		e.target.style.backgroundColor = "rgb(255, 0, 0)";
	})

	li.style.listStyle = "none";
	li.style.margin = "2em 0";
	li.style.position = "relative";
	li.style.lineHeight = "1.5em";
	li.style.borderBottom = "0.1em solid black";
	li.innerHTML += item.course + "</br>";
	li.innerHTML += item.type + "</br>";
	li.innerHTML += item.date + "</br>";

	p.style.position = "absolute";
	p.style.left = "50%";
	p.style.bottom = "0";
	p.innerHTML += item.time;
	p.className = "deadline_p";
	
	li.appendChild(p);
	li.appendChild(btn);
    ul.appendChild(li);
	});
}

function handleSize()
{
	let btns = document.querySelectorAll(".deadline_btn");
	let ps = document.querySelectorAll(".deadline_p");

	if (window.innerWidth <= 400)
	{
		btns.forEach(element => {
			element.style.position = "relative";
		});
		ps.forEach(element => {
			element.style.position = "relative";
			element.style.left = "0";
		})
	}	
	else
	{
		btns.forEach(element => {
			element.style.position = "absolute";
		});
		ps.forEach(element => {
			element.style.position = "absolute";
			element.style.left = "50%";
		})
	}	
}

window.addEventListener("resize", handleSize);

main();
handleSize();