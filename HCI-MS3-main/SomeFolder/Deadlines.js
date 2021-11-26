class Deadlines
{

	constructor(course,date,time,type)
	{
		this.course=course;
		this.date=date;
		this.time=time;
		this.type = type;
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

    toPrint()
    {
        return this.course+" "+this.date+" :"+this.time + this.type;
    }
}
