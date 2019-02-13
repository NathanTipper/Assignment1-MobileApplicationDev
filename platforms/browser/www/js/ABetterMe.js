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
const habitPopup = app.popup.create({
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
        <li class="radio-option">
          <label class="item-radio item-content">
            <input type="radio" name="frequency" value="daily"/>
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Daily</div>
            </div>
          </label>
        </li>
        <li class="radio-option">
          <label class="item-radio item-content">
            <input type="radio" name="frequency" value="monthly"/>
            <i class="icon icon-radio"></i>
            <div class="item-inner">
              <div class="item-title">Monthly</div>
            </div>
          </label>
        </li>
        <li class="radio-option">
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
              <input type="number" name="day-of-month" min="1" max="31" placeholder="Day of the month to repeat habit">
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
        <li id="popup-time-reminder-input" >
          <div class="item-inner no-hairlines">
            <div class="item-title item-label">Reminder Time</div>
            <div>
              <input type="time" name="time-of-day" min="0:00" max="23:59" placeholder="Time between 0 and 23:59 (Optional. Default is 10:00)">
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p class="align-center">
      <button class="small-button button button-fill" onclick="AddHabit()">Create</button>
    </p>
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
    habitPopup.open();
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
  });
});

// Classes
function Habit(name, reminders, journalEntry) {
  this.name = name;
  this.reminders = reminders;
  this.journalEntry = journalEntry;
  this.streak = 0;
}

// Functions
function CreateHabit(name, reminders, journalEntry) {
  habits.push(new Habit(name, reminders, journalEntry));
  UpdateHabits();
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

  let reminders = { frequency: frequency, timeOfDay: timeOfDay, dayOfMonth: dayOfMonth, days: days };
  // fake data for now until we get journals working
  let journalEntry = "I am being run down by a hippopatimus... Please help.";
  ResetHabitPopup();
  habitPopup.close();
  CreateHabit(nameOfHabit, reminders, journalEntry);
}

function UpdateHabits() {
  let habitsList = $("#habits-list");
  for(let i = 0; i < habits.length; ++i) {
    habitsList.append(`<li><a onclick='editHabit(${1})' class='item-link item-content'><div class='item-inner'>\
                      <div class='item-title'>${habits[i].name}</div>\
                      <div class='item-after'>${habits[i].streak}</div></div></a></li>`);
  }
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

function ResetHabitPopup() {
  $("#habit-name input").val("");
  $(".radio-option input:checked").prop('checked', false);
  $("#popup-time-reminder-input input").val("");
  $("#popup-day-input input").val("");

  let checks = $("#popup-custom-day-input input:checked");
  for(let i = 0; i < checks.length; ++i) {
    checks[i].prop('checked', false);
  }


}
