// Framework7 App Construction
var app = new Framework7({
  root: '#app',
  routes: [
    {
      name: 'index',
      path: '/',
      url: './index.html'
    },
    {
      name: 'objectives',
      path: '/objectives/',
      url: './pages/objectives.html',
      options: {
        animate: true,
      }
    },
    {
      name: 'values',
      path: '/values/',
      url: './pages/values.html'
    },
    {
      name: 'theWhy',
      path: '/theWhy/',
      url: './pages/theWhy.html'
    },
    {
      name: 'main',
      path: '/main/',
      url: './pages/main.html'
    }
  ]
});

var $$ = Dom7;

var mainView = app.views.create('.view-main');

// Fake loading the splash screen
setTimeout(function() {
    mainView.router.navigate('/objectives/');
}, 3000)

// Constant Variables
const addHabitPopup = app.popup.create({
  content: `
  <div class="popup popup-add-habit">
    <h1>Add Habit</h1>
    <div class="list inline-labels no-hairlines-between">
      <ul id="add-habits-list">
        <li id="habit-name" class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Name</div>
            <div class="item-input-wrap">
              <input type="text" name="name">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li id="daily-radio" class="radio-option">
          <label class="item-radio item-content">
            <input type="radio" name="frequency" value="daily"/>
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Daily</div>
            </div>
          </label>
        </li>
        <li id="monthly-radio" class="radio-option">
          <label class="item-radio item-content">
            <input type="radio" name="frequency" value="monthly"/>
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Monthly</div>
            </div>
          </label>
        </li>
        <li id="custom-radio" class="radio-option">
          <label class="item-radio item-content">
            <input type="radio" name="frequency" value="custom"/>
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Custom</div>
            </div>
          </label>
        </li>
        <li id="popup-day-input" class="item-content item-input">
          <div class="item-inner">
            <div class="item-title item-label">Day of Month</div>
            <div class="item-input-wrap">
              <input type="number" name="day-of-month" min="1" max="31" placeholder="Day to repeat habit">
              <span class="input-clear-button"></span>
            </div>
          </div>
        </li>
        <li>
          <div id="popup-custom-day-input" class="block block-strong">
            <p> Mon  <label class="checkbox"><input type="checkbox" value="M"><i class="icon-checkbox"></i></label>
                Tue  <label class="checkbox"><input type="checkbox" value="T"><i class="icon-checkbox"></i></label>
                Wed  <label class="checkbox"><input type="checkbox" value="W"><i class="icon-checkbox"></i></label>
                Thu  <label class="checkbox"><input type="checkbox" value="Th"><i class="icon-checkbox"></i></label>
            </p>
            <p>
                Fri  <label class="checkbox"><input type="checkbox" value="F"><i class="icon-checkbox"></i></label>
                Sat  <label class="checkbox"><input type="checkbox" value="S"><i class="icon-checkbox"></i></label>
                Sun  <label class="checkbox"><input type="checkbox" value="Su"><i class="icon-checkbox"></i></label>
            </p>
          </div>
        </li>
        <li id="popup-time-reminder-input">
          <div class="item-inner no-hairlines">
            <div class="item-title item-label">Reminder Time</div>
            <div>
              <input type="time" name="time-of-day" min="0:00" max="23:59" placeholder="Time between 0 and 23:59 (Optional. Default is 10:00)">
            </div>
          </div>
        </li>
        <li id="popup-add-journal">
          <label class="item-checkbox item-content">
            <input type="checkbox"/>
            <i class="icon icon-checkbox"></i>
            <div class="item-inner">
              <div class="item-title">Add Journal?</div>
            </div>
          </label>
        </li>
      </ul>
    </div>
    <div id="edit-habit-buttons" class="block">
      <div class="row">
        <button id="delete-habit-button" class="col button button-fill">Delete</button>
        <button id="finished-editing-button" class="col button button-fill">Done</button>
      </div>
    </div>
    <button id="create-habit-button" class="small-button button button-fill" onclick="AddHabit()">Create</button>
  </div>`
});


// Global Variables
var objectiveNumber = 6;
var valueNumber = 6;

var objectives = [];
var values = [];
var theWhy = "";
var habits = [];

// Event Listeners
$$(document).on('page:init', '.page[data-name="objectives"]', function(e) {
  $("#add-objective-button").click(function() {
    $("#objectives-list").append("<li><div class='item-content'><div class='item-media'>\
    <i class='material-icons'>keyboard_arrow_right</i></div><div class='item-inner'>\
    <div class='item-input-wrap no-hairlines'><input type='text'\
    name='objective${objectiveNumber++}' placeholder='Objective'></div></div></div></li>");
  })

});

$$(document).on('page:init', '.page[data-name="values"]', function(e) {
  $("#add-value-button").click(function() {
    $("#values-list").append("<li><div class='item-content'><div class='item-media'>\
    <i class='material-icons'>keyboard_arrow_right</i></div><div class='item-inner'>\
    <div class='item-input-wrap no-hairlines'><input type='text'\
    name='value${valueNumber++}' placeholder='Value'></div></div></div></li>");
  })
});

$$(document).on('page:init', '.page[data-name="theWhy"]', function(e) {
  $(".theWhy-wrapper textarea").focus();
});

$$(document).on('page:init', '.page[data-name="main"]', function(e) {
  UpdateHabits()

  $("#add-habit-button").click(function() {
    InitializeAddHabitPopup();
  });
})


// Classes
function Habit(name, info, journalEntry) {
  this.name = name;
  this.info = info;
  this.journals = [journalEntry];
  this.streak = 0;
}

function HabitInfo(frequency, dayOfMonth, timeOfDay, days) {
  this.frequency = frequency;
  if(this.frequency === 'monthly')
    this.dayOfMonth = dayOfMonth;
  else
    this.dayOfMonth = 0;

  this.timeOfDay = timeOfDay;

  if(this.frequency === 'custom')
    this.days = days;
  else
    this.days = [];
}

// Functions
function CreateHabit(name, reminders, journalEntry) {
  habits.push(new Habit(name, reminders, journalEntry));
  UpdateHabits();
}

function InitializeAddHabitPopup() {
    addHabitPopup.open();
    $("#edit-habit-buttons").hide();
    $("#create-habit-button").show();
    $(".radio-option input").on("change", function() {
      switch($(".radio-option input:checked").val()) {
        case 'daily':
          $("#popup-day-input").hide();
          $("#popup-custom-day-input").hide();
          break;
        case 'monthly':
          $("#popup-day-input").show();
          $("#popup-custom-day-input").hide()
          break;
        case 'custom':
          $("#popup-day-input").hide();
          $("#popup-custom-day-input").show();
          break;
        default:
          console.log("Unknown option was checked");
      }
    })
}

function AddHabit() {
  // Get all info
  let nameOfHabit = $("#habit-name input").val();
  let frequency = $(".radio-option input:checked").val();
  let timeOfDay = $("#popup-time-reminder-input input").val();

  let dayOfMonth = 0;
  let days = [];
  switch(frequency) {
    case 'monthly':
      dayOfMonth = $("#popup-day-input input").val();
      break;
    case 'custom':
      let checks = $("#popup-custom-day-input input:checked");
      for(let i = 0; i < checks.length; ++i) {
        days.push(checks[i].value);
      }
      break;
  }

  let info = new HabitInfo(frequency, dayOfMonth, timeOfDay, days);
  console.log(info);
  let journalEntry = "I am being run down by a hippopatimus... Please help.";
  ResetAddHabitPopup();
  addHabitPopup.close();
  CreateHabit(nameOfHabit, info, journalEntry);
}

function UpdateHabits() {
  let habitsList = $("#habits-list");
  let habitsListLength = $("#habits-list li").length;

  if(habitsListLength < habits.length) {
    for(let i = habitsListLength; i < habits.length; ++i) {
      habitsList.append(`<li><a onclick='editHabit(${i})' class='item-link item-content'><div class='item-inner'>\
                        <div class='item-title'>${habits[i].name}</div>\
                        <div class='item-after'>${habits[i].streak}</div></div></a></li>`);
    }
  }
  else {
    habitsList.empty();
    for(let i = 0; i < habits.length; ++i) {
      habitsList.append(`<li><a onclick='editHabit(${i})' class='item-link item-content'><div class='item-inner'>\
                        <div class='item-title'>${habits[i].name}</div>\
                        <div class='item-after'>${habits[i].streak}</div></div></a></li>`);
    }
  }
  if($("#habits-list li").length > 0) {
    $("#habits-list").show();
    $("#no-habits-message").hide();
  }
  else {
    $("#habits-list").hide();
    $("#no-habits-message").show();
  }
}

function editHabit(index) {
  addHabitPopup.open();
  let habitToEdit = habits[index];
  let habitInfo = habits[index].info;
  $("#habit-name input").val(habitToEdit.name);
  $("#popup-time-reminder-input input").val(habitInfo.timeOfDay);
  switch (habitInfo.frequency) {
    case 'daily':
      $("#daily-radio input").prop('checked', true);
      break;

    case 'monthly':
      $("#monthly-radio input").prop("checked", true);
      $("#pop-custom-day-input input").val(habitInfo.dayOfMonth);
      break;
    case 'custom':
      $("#custom-radio input").prop("checked", true);
      let days = $("#popup-custom-day-input input");
      if(habitInfo.days.length > 0) {
        for(let i = 0, k = 0; i < days.length; ++i) {
          if(days[i].val() == habitInfo.days[k]) {
            days[i].prop("checked", true);
            ++k;
            if(k >= habitInfo.days.length)
              break;
          }
        }
      }
  }

  $("#edit-habit-buttons").show();
  $("#create-habit-button").hide();

  $("#finished-editing-button").click(function() {
    DoneEditingHabit(index);
  })

  $("#delete-habit-button").click(function() {
    DeleteHabit()
  })
}

function DoneEditingHabit(index) {
  let nameOfHabit = $("#habit-name input").val();
  let frequency = $(".radio-option input:checked").val();
  let timeOfDay = $("#popup-time-reminder-input input").val();

  let dayOfMonth = 0;
  let days = [];
  switch(frequency) {
    case 'monthly':
      dayOfMonth = $("#popup-day-input input").val();
      break;
    case 'custom':
      let checks = $("#popup-custom-day-input input:checked");
      for(let i = 0; i < checks.length; ++i) {
        days.push(checks[i].value);
      }
      break;
  }

  let info = new HabitInfo(frequency, dayOfMonth, timeOfDay, days);
  let journalEntry = "I am being run down by a hippopatimus... Please help.";
  ResetAddHabitPopup();
  addHabitPopup.close();
  habits[index].name = nameOfHabit;
  habits[index].info = info;
  UpdateHabits(index);
}

function DeleteHabit(index) {
  habits.splice(index, 1);
  UpdateHabits();
  ResetAddHabitPopup();
  addHabitPopup.close();
}

// Obtain all the objectives the user types in and put them in a list.
function GetObjectives() {
  let objectivesList = $("#objectives-list input");
  for(let i = 0; i < objectivesList.length; ++i) {
    if(objectivesList[i].value === "")
      continue;

    objectives.push(objectivesList[i].value);
  }

  mainView.router.navigate('/values/', { animate: true });
}

function GetValues() {
  let valuesList = $("#values-list input");
  for(let i = 0; i < valuesList.length; ++i) {
    if(valuesList[i].value === "")
      continue;

    values.push(valuesList[i].value);
  }

  mainView.router.navigate('/theWhy/', { animate: true });
}

function GetWhy() {
  theWhy = $("#theWhy")[0].value;

  mainView.router.navigate('/main/');
}

function ResetAddHabitPopup() {
  $("#habit-name input").val("");
  $(".radio-option input:checked").prop('checked', false);
  $("#popup-time-reminder-input input").val("");
  $("#popup-day-input input").val("");

  let checks = $("#popup-custom-day-input input:checked");
  for(let i = 0; i < checks.length; ++i) {
    checks[i].prop('checked', false);
  }
}
