var app = new Framework7({
  root: '#app',
  routes: [
    {
      name: 'index',
      url: '/',
      path: './index.html'
    },
    {
      name: 'page2',
      url: '/page2/',
      path: './pages/page2.html'
    }
  ]
});

$$ = Dom7;

var mainView = app.views.create('.view-main');
$(document).click(function() {
  mainView.router.navigate('/page2/');
});

function Habit(name, journalEntry) {
  this.name = name;
  this.journalEntry = journalEntry;
}

function makeNewHabit(name, journalEntry) {
  let newHabit = new Habit(name, journalEntry);
  habits.push(newHabit);
}

var habits = [];
