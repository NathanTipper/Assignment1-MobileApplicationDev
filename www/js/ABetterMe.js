function Habit(name, journalEntry) {
  this.name = name;
  this.journalEntry = journalEntry;
}

function makeNewHabit(name, journalEntry) {
  let newHabit = new Habit(name, journalEntry);
  habits.push(newHabit);
}

var habits = [];
