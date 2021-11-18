class Deadlines
{

	constructor(course,date,time)
	{
		this.course=course;
		this.date=date;
		this.time=time;
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
        return this.course+" "+this.date+" :"+this.time;
    }

}
