class Course {

	constructor(name, totalHours, grade, color) {
		this.name = name;
		this.totalHours = totalHours;
		this.grade = grade;
		this.color = color;
		this.deadlineArray = new Array();
		this.sessionArray = new Array();
		this.removedDeadlines = new Array();
		this.removedSessions = new Array();
		this.removeOrComplete = new Array();
	}

	name() {
		return this.name;
	}
	totalHours() {
		return this.totalHours;
	}
	grade() {
		return this.grade;
	}
	color() {
		return this.color;
	}
	deadlineArray() {
		return this.deadlineArray;
	}
	sessionArray() {
		return this.sessionArray;
	}

	addHours(time) {
		this.totalHours += time;
	}
	setGrade(grade) {
		this.grade = grade;
	}
	addDeadline(deadline) {
		this.deadlineArray.push(deadline);
	}
	addSession(session) {
		this.sessionArray.push(session);
	}
	removeDeadline(deadline) {
		let idx = -1;

		for (let i = 0; i < this.deadlineArray.length && idx == -1; i++) {
			if (this.deadlineArray[i] === deadline)
				idx = i;
		}

		if (idx >= 0 && idx < this.deadlineArray.length) {

			this.removedDeadlines.push(this.deadlineArray[idx]);

			for (let i = idx; i < this.deadlineArray.length - 1; i++)
				this.deadlineArray[i] = this.deadlineArray[i + 1];

			this.deadlineArray.pop();
		}
	}
	removeSession(session, removed) {
		let idx = -1;

		for (let i = 0; i < this.sessionArray.length && idx == -1; i++) {
			if (this.sessionArray[i] === session)
				idx = i;
		}

		if (idx >= 0 && idx < this.sessionArray.length) {
			this.removedSessions.push(this.sessionArray[idx]);
			this.removeOrComplete.push(removed);

			for (let i = idx; i < this.sessionArray.length - 1; i++)
				this.sessionArray[i] = this.sessionArray[i + 1];

			this.sessionArray.pop();
		}
	}
}

class Session {

	constructor(course, date, endDate, start, end, type, comments) {
		this.course = course;
		this.date = date;
		this.endDate = endDate;
		this.start = start;
		this.end = end;
		this.type = type;
		this.comments = comments;
	}

	course() {
		return this.course;
	}
	date() {
		return this.date;
	}

	start() {
		return this.start;
	}
	end() {
		return this.end;
	}
	type() {
		return this.type;
	}
}

class Deadlines {

	constructor(course, date, time, type, comments) {
		this.course = course;
		this.date = date;
		this.time = time;
		this.type = type;
		this.comments = comments;
	}

	course() {
		return this.course;
	}

	date() {
		return this.date;
	}

	type() {
		return this.type;
	}

	toPrint() {
		return this.course + " " + this.date + " :" + this.time + this.type;
	}
}

class Manager {
	constructor() {
		this.numCourses = 0;
		this.courseList = new Array();
		this.deadlineList = new Array();
		this.removedDeadlines = new Array();
	}

	createCourse(name, totalHours, grade, color) {
		if (!this.exists(name)) {
			let c = new Course(name, totalHours, grade, color);
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

	createDeadline(courseName, date, time, type, comments) {
		let d = new Deadlines(courseName, date, time, type, comments);
		for (let i = 0; i < this.numCourses; i++) {
			if (this.courseList[i].name == courseName) {
				this.courseList[i].addDeadline(d);
				this.deadlineList.push(d);
			}
		}
	}

	removeDeadline(deadline) {
		let idx = -1;

		for (let i = 0; i < this.deadlineList.length && idx == -1; i++) {
			if (this.deadlineList[i] === deadline)
				idx = i;
		}

		if (idx >= 0 && idx < this.deadlineList.length) {
			this.removedDeadlines.push(this.deadlineList[idx]);

			for (let i = idx; i < this.deadlineList.length - 1; i++)
				this.deadlineList[i] = this.deadlineList[i + 1];

			this.deadlineList.pop();
		}
	}

	createSession(courseName, date, endDate, start, end, type, comments) {
		let s = new Session(courseName, date, endDate, start, end, type, comments);
		for (let i = 0; i < this.numCourses; i++) {
			if (this.courseList[i].name == courseName) {
				this.courseList[i].addSession(s);
			}
		}

	}

	printDeadlines() {
		for (let deadline of this.deadlineList) {
			console.log(deadline.toPrint());
		}
	}

	getDeadlineList() {
		return this.deadlineList;
	}

	exists(name) {
		let toReturn = false;

		for (let i = 0; i < this.courseList.length && !toReturn; i++) {
			if (this.courseList[i].name === name)
				toReturn = true;
		}

		return toReturn;
	}

	getTotalHours() {
		let sum = 0;
		for (let i = 0; i < this.courseList.length; i++)
			sum += this.courseList[i].totalHours;

		return sum;
	}

	updateMenu() {
		let totalHours = this.getTotalHours();
		let minSize = 50, maxSize = 200;

		for (let i = 0; i < menu.bubbles.length; i++) {
			let percent = (totalHours === 0) ? 0 : this.courseList[i].totalHours / totalHours;
			let rad = minSize + percent * (maxSize - minSize);
			menu.setRadius(i, rad);
		}
	}
}

function sort(a, b) {
	
	let dateA, dateB;

	if (a instanceof Deadlines)
	{
		dateA = new Date(a.date + "T" + convertTime(a.time) + "Z");
		dateB = new Date(b.date + "T" + convertTime(b.time) + "Z");
	}
	else 
	{
		dateA = new Date(a.date + "T" + convertTime(a.start) + "Z");
		dateB = new Date(b.date + "T" + convertTime(b.start) + "Z");
	}

	return dateA - dateB;
}

let manager = new Manager();
let undo_btn = document.getElementById("undo_btn");

undo_btn.addEventListener("mouseover", function()
{
    if (undo_btn.style.opacity == 1)
    {
        undo_btn.style.backgroundColor = "rgb(200, 200, 200)";
        createTooltip("Undo", undo_btn);
    }
});

undo_btn.addEventListener("mouseleave", function()
{
    undo_btn.style.backgroundColor = "rgb(255, 255, 255)";
    resetTooltip();
});

undo_btn.addEventListener("click", function()
{
	if (undo_btn.style.opacity == 1)
	{
		let last = manager.removedDeadlines.pop();
		let idx = -1;

    	for (let i = 0; i < manager.courseList.length && idx === -1; i++)
    	{
        	if (manager.courseList[i].name === last.course)
            	idx = i;
    	}

    	let course = manager.courseList[idx];
    	course.removedDeadlines.pop();
    	manager.createDeadline(last.course, last.date, last.time, last.type, last.comments);

    	generatePanel(course, deadline, true); 
    	updateUndoBtns(course);
		updateUndo();
    	main();
    	resetTooltip();
	}
});

manager.createCourse("Comp3020", 0, 100, "#0000FF");
manager.createCourse("Comp3040", 0, 90, "#00FF00");
manager.createCourse("Comp3050", 0, 80, "#FF0000");
// manager.createDeadline("Comp3020", "21/11/2020", "12:00AM", "Midterm");
// manager.createDeadline("Comp3020", "27/10/2021", "12:00AM", "Assignment");
// manager.createDeadline("Comp3020", "27/10/2021", "1:00AM", "Midterm");
// manager.createDeadline("Comp3020", "12/7/2021", "12:00AM", "Assignment");
// manager.createDeadline("Comp3020", "5/5/2021", "12:00AM", "Midterm");
// manager.createDeadline("Comp3020", "10/10/2021", "12:00AM", "Assignment");
// manager.createSession("Comp3020", "20/11/2021", "9:00AM", "2:00PM", "Assignment");
// manager.createSession("Comp3040", "21/11/2021", "8:00AM", "9:34PM", "Quiz");
// manager.createSession("Comp3050", "21/12/2021", "2:00PM", "1:59PM", "General");
// manager.createSession("Comp3020", "21/11/2021", "8:00AM", "11:59PM", "Quiz");
// manager.createSession("Comp3040", "21/02/2021", "7:00AM", "7:30AM", "Assignment");
// manager.createSession("Comp3050", "21/04/2021", "4:45PM", "6:15PM", "General");

function main() //this function generates the deadline panel
{
	const ul = document.createElement('ul');
	let elem = document.getElementById('deadline_list');

	let n = elem.children.length;
	if (n > 0)
		elem.removeChild(elem.lastChild);

	elem.appendChild(ul);
	manager.deadlineList.sort(sort);

	manager.deadlineList.forEach(function (item) {
		const li = document.createElement('li');
		const btn = document.createElement('button');
		const p = document.createElement('p');
		const c = document.createElement('div');

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
		btn.type = "button";
		btn.className = "deadline_btn";
		btn.addEventListener('click', function () {
			ul.removeChild(li);
			ul.removeChild(c);
			manager.removeDeadline(item); //remove deadline from deadline list

			let course = -1;

			for (let i = 0; i < manager.courseList.length && course == -1; i++) {
				if (manager.courseList[i].name === item.course) {
					course = manager.courseList[i]; //also need to remove the deadline from the list of course
					course.removeDeadline(item);
				}
			}

			if (course !== -1) {
				generatePanel(course, document.getElementById("form_deadline_panel"), true); //update the panel on the info form (in case it is open)
				updateUndoBtns(course);
				updateUndo();
			}

			resetTooltip();
		});
		btn.addEventListener("mouseover", function (e) {
			e.target.style.backgroundColor = "rgb(127, 0, 0)";
			createTooltip("Remove deadline", e.target);
		})
		btn.addEventListener("mouseleave", function (e) {
			e.target.style.backgroundColor = "rgb(255, 0, 0)";
			resetTooltip();
		})

		li.style.listStyle = "none";
		li.style.marginTop = "1.5em";
		li.style.position = "relative";
		li.style.lineHeight = "1.5em";
		li.innerHTML += item.course + "</br>";
		li.innerHTML += item.type + "</br>";
		li.innerHTML += item.date + "</br>";

		p.style.position = "absolute";
		p.style.left = "50%";
		p.style.bottom = "0";
		p.innerHTML += item.time + "</br>";
		p.className = "deadline_p";

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

		li.appendChild(p);
		li.appendChild(btn);
		ul.appendChild(li);
		ul.appendChild(c);
	});
}

function handleSize() //media query for the deadline panel (since dynamically styled)
{
	let btns = document.querySelectorAll(".deadline_btn");
	let ps = document.querySelectorAll(".deadline_p");

	if (window.innerWidth <= 400) {
		btns.forEach(element => {
			element.style.position = "relative";
		});
		ps.forEach(element => {
			element.style.position = "relative";
			element.style.left = "0";
		})
	}
	else {
		btns.forEach(element => {
			element.style.position = "absolute";
		});
		ps.forEach(element => {
			element.style.position = "absolute";
			element.style.left = "50%";
		})
	}
}

function updateUndo()
{
	if (manager.removedDeadlines.length !== 0)
		undo_btn.style.opacity = 1;
	else   
	{ 
		undo_btn.style.opacity = 0.5;
		undo_btn.style.backgroundColor = "rgb(255, 255, 255)";
	}
}

window.addEventListener("resize", handleSize);

main();
handleSize();