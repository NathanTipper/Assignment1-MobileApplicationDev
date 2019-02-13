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
      url: './pages/objectives.html'
    }
  ]
});

var $$ = Dom7;

var mainView = app.views.create('.view-main');
$(document).click(function() {
  //self.app.views.main.router.navigate('/page2/');
  //console.log(self.app.views.main.router);
});

$$(document).on('page:init', '.page[data-name="objectives"]', function(e) {
  console.log("Hello");
})

function Habit(name, journalEntry) {
  this.name = name;
  this.journalEntry = journalEntry;
}

function makeNewHabit(name, journalEntry) {
  let newHabit = new Habit(name, journalEntry);
  habits.push(newHabit);
}

var habits = [];
