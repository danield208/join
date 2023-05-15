class Loading {
  urgentTasksArr = [];
  toDoTaskArr = [];
  inProgressArr = [];
  awaitArr = [];
  doneTaskArr = [];
  dates = [];
  MONTHS = [
    'Januar',
    'Februar',
    'März',
    'April',
    'Mai',
    'Juni',
    'Juli',
    'August',
    'September',
    'Oktober',
    'November',
    'Dezember',
  ];
  dayPeriod = ['Good morning, ', 'Hello, ', 'Good evening, '];
  YEAR = 0;
  MONTH = '';
  DAY = 0;
  FinalDate = '';
  constructor() {

    this.checkUrgent();
    this.checkStatus();
    this.init();
  }
  checkStatus() {
    Tasks.forEach((arr) => {
      if (arr.Status == 'toDo') {
        this.toDoTaskArr.push(arr);
      }
      if (arr.Status == 'inProgress') {
        this.inProgressArr.push(arr);
      }
      if (arr.Status == 'Await') {
        this.awaitArr.push(arr);
      }
      if (arr.Status == 'Done') {
        this.doneTaskArr.push(arr);
      }
    });
  }

  checkUrgent() {
    //Check Main Arr for urgent
    Tasks.forEach((arr) => {
      if (
        (arr.Priority == 'Urgent' && arr.Status == 'toDo') ||
        arr.Status == 'inProgress'
      ) {
        this.urgentTasksArr.push(arr);
      }
    });
    Tasks.forEach((date) => {
      this.dates.push(Date.parse(date.Deadline));
    });
    //Nummeric sort of the Dates
    this.dates.sort((a, b) => {
      return a - b;
    });
  }

  init() {
    document.getElementById('urgentTasks').innerText =
      this.urgentTasksArr.length;
    document.getElementById('upcomingDeadline').innerText = this.createDate();
    document.getElementById('AllTask').innerText = Tasks.length;
    document.getElementById('toDoTasks').innerText = this.toDoTaskArr.length;
    document.getElementById('inProgress').innerText = this.inProgressArr.length;
    document.getElementById('awaitForFeedback').innerText = this.awaitArr.length;
    document.getElementById('done').innerText = this.doneTaskArr.length;
    document.querySelector('.first-line').childNodes[1].innerText =
      this.getTimestampInSeconds();
  }

  createDate() {
    this.YEAR = new Date(this.dates[0]).getFullYear();
    this.MONTH = this.MONTHS[new Date(this.dates[0]).getMonth()];
    this.DAY = new Date(this.dates[0]).getDate();
    if (!this.dates.length == 0) {
      return (this.FinalDate = `${this.MONTH} ${this.DAY}, ${this.YEAR}`);
    } else {
      return "";
    }
  }
  getTimestampInSeconds() {
    let today = new Date();
    let time = today.getHours();
    if (time > 4 && time < 12) {
      return this.dayPeriod[0];
    }
    if (time >= 12 && time <= 18) {
      return this.dayPeriod[1];
    } else {
      return this.dayPeriod[2];
    }
  }
}
