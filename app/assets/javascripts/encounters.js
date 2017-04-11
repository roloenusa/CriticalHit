// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
// You can use CoffeeScript in this file: http://coffeescript.org/

var challenge_ratings = [
  '0','1/8','1/4','1/2',
  '1','2','3','4','5','6','7','8','9','10',
  '11','12','13','14','15','16','17','18','19','20',
  '21','22','23','24','25','26','27','28','29','30'
];

var difficulties = [
  {"Easy": 0,    'Medium':  0,   'Hard': 0,    'Deadly': 0},     // 0
  {'Easy': 25,   'Medium': 50,   'Hard': 75,   'Deadly': 100},   // 1
  {'Easy': 50,   'Medium': 100,  'Hard': 150,  'Deadly': 200},   // 2
  {'Easy': 75,   'Medium': 150,  'Hard': 225,  'Deadly': 400},   // 3
  {'Easy': 125,  'Medium': 250,  'Hard': 375,  'Deadly': 500},   // 4
  {'Easy': 250,  'Medium': 500,  'Hard': 750,  'Deadly': 1100},  // 5
  {'Easy': 300,  'Medium': 600,  'Hard': 900,  'Deadly': 1400},  // 6
  {'Easy': 350,  'Medium': 750,  'Hard': 1100, 'Deadly': 1700},  // 7
  {'Easy': 450,  'Medium': 900,  'Hard': 1400, 'Deadly': 2100},  // 8
  {'Easy': 550,  'Medium': 1100, 'Hard': 1600, 'Deadly': 2400},  // 9
  {'Easy': 600,  'Medium': 1200, 'Hard': 1900, 'Deadly': 2800},  // 10
  {'Easy': 800,  'Medium': 1600, 'Hard': 2400, 'Deadly': 3600},  // 11
  {'Easy': 1000, 'Medium': 2000, 'Hard': 3000, 'Deadly': 4500},  // 12
  {'Easy': 1100, 'Medium': 2200, 'Hard': 3400, 'Deadly': 5100},  // 13
  {'Easy': 1250, 'Medium': 2500, 'Hard': 3800, 'Deadly': 5700},  // 14
  {'Easy': 1400, 'Medium': 2800, 'Hard': 4300, 'Deadly': 6400},  // 15
  {'Easy': 1600, 'Medium': 3200, 'Hard': 4800, 'Deadly': 7200},  // 16
  {'Easy': 2000, 'Medium': 3900, 'Hard': 5900, 'Deadly': 8800},  // 17
  {'Easy': 2100, 'Medium': 4200, 'Hard': 6300, 'Deadly': 9500},  // 18
  {'Easy': 2400, 'Medium': 4900, 'Hard': 7300, 'Deadly': 10900}, // 19
  {'Easy': 2800, 'Medium': 5700, 'Hard': 8500, 'Deadly': 12700}, // 20
];

var monsters_xp_by_cr = {
  '0':     10,
  '1/8':   25,
  '1/4':   50,
  '1/2':   100,
  '1':     200,
  '2':     450,
  '3':     700,
  '4':     1100,
  '5':     1800,
  '6':     2300,
  '7':     2900,
  '8':     3900,
  '9':     5000,
  '10':    5900,
  '11':    7200,
  '12':    8400,
  '13':    10000,
  '14':    11500,
  '15':    13000,
  '16':    15000,
  '17':    18000,
  '18':    20000,
  '19':    22000,
  '20':    25000,
  '21':    33000,
  '22':    41000,
  '23':    50000,
  '24':    62000,
  '25':    75000,
  '26':    90000,
  '27':    105000,
  '28':    120000,
  '29':    135000,
  '30':    155000,
};


var players = [];
var monsters = {};
var xp_threshold = {};
var adjusted_xp = 0;
var monsters_by_cr = {};
var selected_monsters = [];

function difficulty(level, rating) {
  return difficulties[level][rating];
};

function getAllMonsters() {
  $.get( "5e-SRD-Monsters.json", function( data ) {
    console.log("data: ", data);
    monsters = data;
    processMonsters();
    updateDisplay();
  });
};

function addPlayerToEncounter(level) {
  players.push(level);
  console.log("addplayer: ", level);
  calculateXPThresholds();
  calculateAdjustedXp();
  updateDisplay();
};

function addMonsterToEncounter(name) {
  console.log("=== name: ", name);
  for (var i = 0; i < monsters.length; i++) {
    var monster = monsters[i];
    if (monster.name == name) {
      selected_monsters.push(monster);
      calculateXPThresholds();
      calculateAdjustedXp();
      updateDisplay();
    }
  }
}

function difficultyMultiplier(monster_count) {
  if (monster_count == 1)
    return 1;
  if (monster_count == 2)
    return 1.5;
  if (monster_count <= 6)
    return 2;
  if (monster_count <= 10)
    return 2.5;
  if (monster_count <= 14)
    return 3;
  return 4
};

function calculateXPThresholds() {
  var difficulty_levels = ['Easy', 'Medium', 'Hard', 'Deadly'];
  for (var i = 0; i < difficulty_levels.length; i++) {
    level = difficulty_levels[i];
    xp_threshold[level] = 0;
    for (var j = 0; j < players.length; j++) {
      var player = players[j];
      console.log("player: ", player, " level: ", level);
      xp_threshold[level] += difficulty(player, level);
    }
  }

  console.log("xp_threshold: ", xp_threshold);
  return xp_threshold;
}

function calculateAdjustedXp() {
  adjusted_xp = 0;
  for (var i = 0; i < selected_monsters.length; i++) {
    var monster = selected_monsters[i];
    challenge_rating = monster.challenge_rating;
    adjusted_xp += monsters_xp_by_cr[challenge_rating];
  }
  adjusted_xp *= difficultyMultiplier(selected_monsters.length)

  console.log("adjusted_xp: ", adjusted_xp);
  return adjusted_xp;
}

function getDifficultyRating(xp_threshold, adjusted_xp) {
  if (adjusted_xp <= xp_threshold['Easy'])
    return 'Easy';
  else if (adjusted_xp <= xp_threshold['Medium']) {
    return 'Medium';
  } else if (adjusted_xp <= xp_threshold['Hard']) {
    return 'Hard';
  }

  return 'Deadly';
}

function processMonsters() {
  monsters_by_cr = {};
  for (var i = 0; i < challenge_ratings.length; i++) {
    var cr = challenge_ratings[i];
    monsters_by_cr[cr] = {
      'monsters': [],
      'avg_xp': monsters_xp_by_cr[cr],
    }
  }

  console.log("monsters_by_cr: ", monsters_by_cr);
  for (var i = 0; i < monsters.length; i++) {
    var monster = monsters[i];
    console.log(monster);
    monsters_by_cr[monster.challenge_rating].monsters.push(monster);
  }
};

function updateDisplay() {
  displayPlayers();
  displayMonsters();
  displaySelectedMonsters();
}

function displayMonsters() {
  $('#monsters').html('');

  for (var i = 0; i < challenge_ratings.length; i++) {
      var cr = challenge_ratings[i];
      var cr_xp = monsters_xp_by_cr[cr];
      var calculated = adjusted_xp + cr_xp;
      console.log("==== cr_xp: ", cr_xp, " adjusted_xp: ", adjusted_xp, " calculated: ", calculated);
      var difficulty = getDifficultyRating(xp_threshold, calculated);
      var header = $('<h3> Challenge Rating: ' + cr + ', Difficulty: ' + difficulty + '</h3>');
      var container = $("<ul />");
      for (var j = 0; j < monsters_by_cr[cr].monsters.length; j++) {
        var monster = monsters_by_cr[cr].monsters[j];
        var input = $('<input />', { type: 'button', value: '+', id: 'add_monster', class: 'add_monster', name: monster.name});
        var list = $('<li id="id'+monster.name+'" name="name'+monster.name+'">' + monster.name + '</li>').append(input);
        container.append(list);
      }

      $('#monsters').append(header);
      $('#monsters').append(container);
  }
}

function displayPlayers() {
  $('#players').html('');

  var header = $('<h3> Players: ' + players.length + ', Difficulties: ' + JSON.stringify(xp_threshold) + '</h3>');
  var container = $("<ul />");
  for (var i = 0; i < players.length; i++) {
    var player = players[i];
    container.append('<li id="id' + player + '" name="name' + player + '">Level ' + player + '</li>');
  }

  $('#players').append(header);
  $('#players').append(container);
}

function displaySelectedMonsters() {
  $('#selected_monsters').html('');

  var header = $('<h3> Rating: ' + getDifficultyRating(xp_threshold, adjusted_xp) + ' ('+ adjusted_xp +')'+ '</h3>');
  var container = $("<ul />");
  for (var i = 0; i < selected_monsters.length; i++) {
    var monster = selected_monsters[i];
    container.append('<li id="id' + monster.name + '" name="name' + monster.name + '">' + monster.name + '</li>');
  }

  $('#selected_monsters').append(header);
  $('#selected_monsters').append(container);
}

getAllMonsters();

$(document).ready(function() {
  $("#add_player").click(function() {
    var level = $('#level option:selected').text();
    addPlayerToEncounter(level);
  });

  $("#monsters").on('click', '.add_monster', function(event) {
    console.log(event.target.name);
    addMonsterToEncounter(event.target.name);
  });
});
