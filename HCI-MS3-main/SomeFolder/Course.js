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

