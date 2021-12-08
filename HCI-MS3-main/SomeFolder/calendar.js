document.addEventListener('DOMContentLoaded', function() {

  var calendarEl = document.getElementById('calendar');

var calendar = new FullCalendar.Calendar(calendarEl, {
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
  select: function(arg) {
    // THIS IS WHERE WE WANT THE DIALOG BOX
    var title = prompt('Add Class:');
    if (title) {
      calendar.addEvent({
        //Add event
        title: title,
        start: arg.start,
        end: arg.end,
        allDay: arg.allDay
      })
    }
    calendar.unselect()
  },
  eventClick: function(arg) {
    if (confirm('Are you sure you want to delete this event?')) {
      arg.event.remove()
    }
  },
  editable: true,
  dayMaxEvents: true, // allow "more" link when too many events
  events: [
    {
      title: 'Exam Session',
      start: '2021-12-07',
      end: '2021-12-10'
    }
    // import data from somewhere
  ]
});

    calendar.render();

    let calendarPage = document.getElementById("calendar_page"); //a pointer to the calendar page div
    calendarBtn.addEventListener("click", function(e) 
    { 
      calendar.render();  
    });
});