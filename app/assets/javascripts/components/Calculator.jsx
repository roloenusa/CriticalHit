class Calculator extends React.Component {
  static challengeRatings() {
    return [
      '0','1/8','1/4','1/2',
      '1','2','3','4','5','6','7','8','9','10',
      '11','12','13','14','15','16','17','18','19','20',
      '21','22','23','24','25','26','27','28','29','30'
    ];
  };

  static difficulties() {
    return [
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
  }

  static monsterXpByCr() {
    return {
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
      '30':    155000
    }
  };

  static getDifficulty(level, rating) {
    return difficulties()[level][rating];
  };

  static difficultyMultiplier(monsterCount) {
    if (monsterCount == 1)
      return 1;
    if (monsterCount == 2)
      return 1.5;
    if (monsterCount <= 6)
      return 2;
    if (monsterCount <= 10)
      return 2.5;
    if (monsterCount <= 14)
      return 3;
    return 4
  };

  static calculateXPThresholds(players) {
    var difficultyLevels = ['Easy', 'Medium', 'Hard', 'Deadly'];
    var xpThreshold = {};
    difficultyLevels.map((level) => {
      xpThreshold[level] = 0;
      players.map((player) => {
        xpThreshold[level] += difficulty(player, level);
      })
    });
    return xpThreshold;
  }

  static calculateAdjustedXp(monsters) {
    var adjustedXp = 0;
    monsters.map((monster) => {
      var cr = monster.challenge_rating;
      adjustedXp += this.monsters_xp_by_cr()[cr];
    });

    adjustedXp *= difficultyMultiplier(monsters.length)
    return adjustedXp;
  }

  static getDifficultyRating(xpThreshold, adjustedXp) {
    if (adjustedXp < xpThreshold['Easy'])
      return 'Trivial';
    else if (adjustedXp < xpThreshold['Medium']) {
      return 'Easy';
    } else if (adjustedXp < xpThreshold['Hard']) {
      return 'Medium';
    } else if (adjustedXp < xpThreshold['Deadly']) {
      return 'Hard';
    }

    return 'Deadly';
  }
}
