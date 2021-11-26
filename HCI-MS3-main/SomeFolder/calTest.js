let sessions = manager.get
calendar();

// Clears entire calendar
//calendar.getEvents().forEach(event=>event.remove());

function calendar() {
  let inputElem,
    dummyElem,
    dateInput,
    timeInput,
    calendar,
    button;

  // test code
  /*inputElem = document.getElementById("title");
  dummyElem = document.getElementById("dummy");
  button = document.getElementById("addBtn");
  dateInput = document.getElementById("date");
  timeInput = document.getElementById("time");*/

  //button.addEventListener("click", addEntry, false);
  // end test code

  initCalendar();

  // inits session array
  sessions.forEach(calObj => {
    addCalendarEntry(calObj);
  });

  function addEntry(event) {
    /*let inputValue = inputElem.value;
    inputElem.value = "";

    let dummyValue = dummyElem.value;
    dummyElem.value = "";

    let dateValue = dateInput.value;
    dateInput.value = "";

    let timeValue = timeInput.value;
    timeInput.value = "";*/
    // instead of getting values from input, get from form. Does this need to be called after Session Form??

    let newEntry = {
      title: inputValue,
      date: dateValue,
      time: timeValue,
      pos: inputValue,
      dummy: dummyValue,
    };

    addCalendarEntry(newEntry);

    sessions.push(newEntry);
  }

  function addCalendarEntry({ title: inputValue, date: dateValue, id: pos }) {
    calendar.addEvent({
      title: inputValue,
      start: dateValue,
      id: pos,
      //end: '2020-09-10'
      //startTime
      //endTime

    });
  }

  function showSessionInfo(event){
    //alert("Show info for Session:" + calendar.getElementById(event.id).title);
    sessions.forEach(calObj => {
      if(calObj.title == event.title){
        alert("IT WORKS!!! " + calObj.dummy);

        return;
      }
    });
  }


  function initCalendar() {
    var calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      initialDate: '2021-11-25',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      navLinks: true,
      height: 600,
      events: [],

      eventClick: function (info) {
        showSessionInfo(info.event);

        // change the border color just for fun
        info.el.style.borderColor = 'red';
      }
    });

    calendar.render();
    //.updateSize()
  }



}
