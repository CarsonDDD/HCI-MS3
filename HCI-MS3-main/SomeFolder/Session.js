export class Session
{

	constructor(course,date,start,end,type)
	{
		this.course=course;
		this.date=date;
		this.start=start;
		this.end=end;
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

	start()
	{
		return this.start;
	}
	end()
	{
		return this.end;
	}
	type()
	{
		return this.type;
	}
}
