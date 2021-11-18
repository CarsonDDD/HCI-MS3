class Course
{

	constructor(name,totalHours,grade,color)
	{
		this.name=name;
		this.totalHours=totalHours;
		this.grade=grade;
		this.color=color;
		this.deadlineArray=new Array();
		this.sessionArray=new Array();
	}

	name()
	{
		return this.name;
	}
	totalHours()
	{
		return this.totalHours;
	}
	grade()
	{
		return this.grade;
	}
	color()
	{
		return this.color;
	}
	deadlineArray()
	{
		return this.deadlineArray;
	}
	sessionArray()
	{
		return this.sessionArray;
	}

	addHours(time)
	{
		this.totalHours+=time;
	}
	setGrade(grade)
	{
		this.grade=grade;
	}
	addDeadline(deadline)
	{
		this.deadlineArray.push(deadline);
	}
	addSession(session)
	{
		this.sessionArray.push(session);
	}
}

class Deadlines
{

	constructor(course,date,time,type)
	{
		this.course=course;
		this.date=date;
		this.time=time;
		this.type=type;
	}

	course()
	{
		return this.course;
	}

	date()
	{
		return this.date;
	}

	type()
	{
		return this.type;
	}

	time()
	{
		return this.time;
	}

    toPrint()
    {
        return this.course+" "+this.type+"<br>"+this.date+" @"+this.time;
    }

}

class Session
{

	constructor(course,date,start,end)
	{
		this.course=course;
		this.date=date;
		this.start=start;
		this.end=end;
	}

	course()
	{
		return this.course;
	}
	date()
	{
		return this.date;
	}

	start()
	{
		return this.start;
	}
	end()
	{
		return this.end;
	}

}


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
        let c=new Course(name,totalHours,grade,color);
        this.numCourses++;
        this.courseList.push(c);
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

    createSession(courseName,date,start,end)
    {
        let s=new Session(courseName,date,start,end);
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
}
/*
let m=new Manager();
m.createCourse("Comp3020",0,100,"Blue");
m.createCourse("Comp3040",0,90,"Grey");
m.createCourse("Comp3050",0,80,"Red");
m.createDeadline("Comp3020","21/11/2021","12am","Midterm");
m.createDeadline("Comp3040","27/10/2021","12am","Assignment");
m.createDeadline("Comp3020","26/9/2021","12am","Midterm");
m.createDeadline("Comp3050","12/7/2021","12am","Assignment");
m.createDeadline("Comp3050","5/5/2021","12am","Midterm");
m.createDeadline("Comp3020","10/10/2021","12am","Assignment");
m.createSession("Comp3020","21/11/2021",100,200);
m.createSession("Comp3040","21/11/2021",100,200);
m.createSession("Comp3050","21/11/2021",100,200);
//m.printDeadlines();

//let arr= ["Comp3020 Milestone3: Novermber 16","Comp3020 Midterm 2: TBA","Something Something 420"];
function update(list)
{
	ul = document.createElement('ul');
	btn=document.createElement('button');
	btn.innerHTML="Remove";
	btn.type="button";

document.getElementById('deadline_list').appendChild(ul);

list.forEach(function (item) {
    let li = document.createElement('li');
    ul.appendChild(li);
	li.appendChild(btn);

    li.innerHTML += item.toPrint();
});
}
console.log(update(m.getDeadlineList()));*/

window.addEventListener('load', () =>{
	let m=new Manager();
	m.createCourse("Comp3020",0,100,"Blue");
	m.createCourse("Comp3040",0,90,"Grey");
	m.createCourse("Comp3050",0,80,"Red");
	m.createDeadline("Comp3020","21/11/2021","12am","Midterm");
	m.createDeadline("Comp3040","27/10/2021","12am","Assignment");
	m.createDeadline("Comp3020","26/9/2021","12am","Midterm");
	m.createDeadline("Comp3050","12/7/2021","12am","Assignment");
	m.createDeadline("Comp3050","5/5/2021","12am","Midterm");
	m.createDeadline("Comp3020","10/10/2021","12am","Assignment");
	m.createSession("Comp3020","21/11/2021",100,200);
	m.createSession("Comp3040","21/11/2021",100,200);
	m.createSession("Comp3050","21/11/2021",100,200);

	const ul = document.createElement('ul');
	const btn=document.createElement('button');
	btn.innerHTML="Remove";
	btn.type="button";

	document.getElementById('deadline_list').appendChild(ul);

	m.deadlineList.forEach(function (item) {
    const li = document.createElement('li');
	li.appendChild(btn);
    ul.appendChild(li);

    li.innerHTML += item.toPrint();
	});
	btn.addEventListener('click', (e) => 
	{
		ul.removeChild(li);
	});
});