export class Course
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
	removeDeadline(deadline)
	{
		let idx = -1;
		
		for (let i = 0; i < this.deadlineArray.length && idx == -1; i++)
		{
			if (this.deadlineArray[i] === deadline)
				idx = i;
		}

		if (idx >= 0 && idx < this.deadlineArray.length)
		{
			for (let i = idx; i < this.deadlineArray.length - 1; i++)
				this.deadlineArray[i] = this.deadlineArray[i + 1];
		
			this.deadlineArray.pop();
		}
	}
	removeSession(session)
	{
		let idx = -1;
		
		for (let i = 0; i < this.sessionArray.length && idx == -1; i++)
		{
			if (this.sessionArray[i] === session)
				idx = i;
		}

		if (idx >= 0 && idx < this.sessionArray.length)
		{
			for (let i = idx; i < this.sessionArray.length - 1; i++)
				this.sessionArray[i] = this.sessionArray[i + 1];
		
			this.sessionArray.pop();
		}
	}
}

