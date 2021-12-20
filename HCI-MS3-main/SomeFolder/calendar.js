let calendar;

document.addEventListener('DOMContentLoaded', function() {

  var calendarEl = document.getElementById('calendar');

calendar = new FullCalendar.Calendar(calendarEl, {
  height: "auto",
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  initialDate: '2021-12-12',
  navLinks: true, // can click day/week names to navigate views
  selectable: true,
  selectMirror: true,
  contentHeight:600,
  unselectAuto: false,
  select: function(arg)
  {
    openCal1();
    
    let date = convertDate(arg.start);
    let endDate = convertDate(arg.end);

    //for deadline
    deadline_date.value = date[0];
    time_text.value = date[1];

    //for session
    start_date.value = date[0];
    end_date.value = endDate[0];
    start_time.value = date[1];
    end_time.value = endDate[1];
  },
  eventClick: function(arg) {
    showForm(arg);
    resetTooltip();
  },
  eventMouseEnter: function(arg)
  {
    arg.el.style.cursor = "pointer";
    
    if (arg.event.extendedProps.isDeadline)
      createTooltip("View deadline info", arg.el);
    else
      createTooltip("View session info", arg.el);
  },
  eventMouseLeave: function(arg)
  {
    arg.el.style.cursor = "default";
    resetTooltip();
  },
  dayMaxEvents: true // allow "more" link when too many events
});

    calendar.render();
    calendarBtn.addEventListener("click", function(e) 
    { 
      calendar.render();  
      updateCalendar();
    });
});

function updateCalendar()
{
  let events = calendar.getEvents();

  for (let i = 0; i < events.length; i++)
  {
    events[i].remove();
  }

  for (let i = 0; i < manager.courseList.length; i++)
  {
    let course = manager.courseList[i];
    for (let j = 0; j < course.deadlineArray.length; j++)
    {
      let deadline = course.deadlineArray[j];

      calendar.addEvent(
        {
            title: deadline.type,
            start: deadline.date + "T" + convertTime(deadline.time),
            color: course.color,
            textColor: "black",
            id: course.name + deadline.type + deadline.date + deadline.time,
            isDeadline: true
        }
      );
    }

    for (let j = 0; j < course.sessionArray.length; j++)
    {
      let session = course.sessionArray[j];

      calendar.addEvent(
        {
            title: session.type,
            start: session.date + "T" + convertTime(session.start),
            end: session.endDate + "T" + convertTime(session.end),
            color: course.color,
            textColor: "black",
            id: course.name + session.type + session.date + session.start + session.end,
            isDeadline: false
        }
      );
    }
  }
}

function convertDate(time) //from API format to our format
{
  let date = new String(time);
  let spaceIdx = new Array(5);

  for (let i = 0; i < 5; i++)
  {
    spaceIdx[i] = date.indexOf(" ", (i == 0) ? 0 : spaceIdx[i - 1] + 1);
  }

  let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let num = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  let day = date.substring(spaceIdx[1] + 1, spaceIdx[2]);
  let month = date.substring(spaceIdx[0] + 1, spaceIdx[1]);

  for (let i = 0; i < 12; i++)
  {
    if (month === monthNames[i])
      month = num[i];
  }

  let year = date.substring(spaceIdx[2] + 1, spaceIdx[3]);

  let t = date.substring(spaceIdx[3] + 1, spaceIdx[4]);

  return [year + "-" + month + "-" + day, t];
}

function convertTime(time) //our format to API format
{
  let colonIdx = time.indexOf(":");
  let hours = parseInt(time.substring(0, colonIdx));
  let mins = time.substring(colonIdx + 1, time.length - 3);
  let isAm = time.substring(time.length - 2, time.length);
  
  if (hours === 12 && isAm === "AM")
  {
    hours -= 12;
  }
  else if (hours !== 12 && isAm === "PM")
  {
    hours += 12;
  }

  let hrsString = (hours < 10) ? "0" + hours : hours;

  return hrsString + ":" + mins + ":00";
}

function showForm(arg)
{
  let item = null, isDeadline = true, courseObj = null;

  for (let i = 0; i < manager.courseList.length; i++)
  {
    let course = manager.courseList[i];
    for (let j = 0; j < course.deadlineArray.length; j++)
    {
      let deadline = course.deadlineArray[j];

      if (course.name + deadline.type + deadline.date + deadline.time === arg.event.id)
      {
        item = deadline;
        isDeadline = true;
        courseObj = course;
      }
    }

    for (let j = 0; j < course.sessionArray.length; j++)
    {
      let session = course.sessionArray[j];

      if (course.name + session.type + session.date + session.start + session.end === arg.event.id)
      {
        item = session;
        isDeadline = false;
        courseObj = course;
      }
    } 
  }

  generateCompletionForm(item, isDeadline, courseObj);
}