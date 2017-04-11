class Volo
  # Character level	CR for two monsters per character	CR for one monster per character	CR for one monster per two characters	CR for one monster per four characters
  # 1	              Too hard	                        1/4	                              1/2                                   1
  # 2	              1/8	                              1/4	                              1                                     3
  # 3	              1/4	                              1	                                2                                     4
  # 4	              1/2	                              1	                                3                                     5
  # 5	              1	                                2	                                4                                     6
  # 6	              1	                                2	                                5                                     7
  # 7	              1	                                3	                                5                                     8
  # 8	              2	                                3	                                6                                     9
  # 9	              2	                                4	                                7                                     10
  # 10	            2	                                4	                                7                                     11
  # 11	            3	                                5	                                8                                     12
  # 12	            3	                                5	                                9                                     13
  # 13	            3	                                5	                                10                                    14
  # 14	            4	                                6	                                11                                    15
  # 15	            4	                                6	                                11                                    16
  # 16	            4	                                7	                                12                                    17
  # 17	            4	                                8	                                13                                    18
  # 18	            5	                                8	                                14                                    19
  # 19	            5	                                9	                                15                                    20
  # 20	            6	                                10	                              16                                    21


  def self.monsters_xp_by_cr()
    {
      "0" => 10,
      "1/8" => 25,
      "1/4" => 50,
      "1/2" => 100,
      "1" => 200,
      "2" => 450,
      "3" => 700,
      "4" => 1100,
      "5" => 1800,
      "6" => 2300,
      "7" => 2900,
      "8" => 3900,
      "9" => 5000,
      "10" => 5900,
      "11" => 7200,
      "12" => 8400,
      "13" => 10000,
      "14" => 11500,
      "15" => 13000,
      "16" => 15000,
      "17" => 18000,
      "18" => 20000,
      "19" => 22000,
      "20" => 25000,
      "21" => 33000,
      "22" => 41000,
      "23" => 50000,
      "24" => 62000,
      "25" => 75000,
      "26" => 90000,
      "27" => 105000,
      "28" => 120000,
      "29" => 135000,
      "30" => 155000,
    }
  end

  def self.difficulties()
    [
      {'Easy' => 0,    'Medium' =>  0,   'Hard' => 0,    'Deadly' => 0},     # 0
      {'Easy' => 25,   'Medium' => 50,   'Hard' => 75,   'Deadly' => 100},   # 1
      {'Easy' => 50,   'Medium' => 100,  'Hard' => 150,  'Deadly' => 200},   # 2
      {'Easy' => 75,   'Medium' => 150,  'Hard' => 225,  'Deadly' => 400},   # 3
      {'Easy' => 125,  'Medium' => 250,  'Hard' => 375,  'Deadly' => 500},   # 4
      {'Easy' => 250,  'Medium' => 500,  'Hard' => 750,  'Deadly' => 1100},  # 5
      {'Easy' => 300,  'Medium' => 600,  'Hard' => 900,  'Deadly' => 1400},  # 6
      {'Easy' => 350,  'Medium' => 750,  'Hard' => 1100, 'Deadly' => 1700},  # 7
      {'Easy' => 450,  'Medium' => 900,  'Hard' => 1400, 'Deadly' => 2100},  # 8
      {'Easy' => 550,  'Medium' => 1100, 'Hard' => 1600, 'Deadly' => 2400},  # 9
      {'Easy' => 600,  'Medium' => 1200, 'Hard' => 1900, 'Deadly' => 2800},  # 10
      {'Easy' => 800,  'Medium' => 1600, 'Hard' => 2400, 'Deadly' => 3600},  # 11
      {'Easy' => 1000, 'Medium' => 2000, 'Hard' => 3000, 'Deadly' => 4500},  # 12
      {'Easy' => 1100, 'Medium' => 2200, 'Hard' => 3400, 'Deadly' => 5100},  # 13
      {'Easy' => 1250, 'Medium' => 2500, 'Hard' => 3800, 'Deadly' => 5700},  # 14
      {'Easy' => 1400, 'Medium' => 2800, 'Hard' => 4300, 'Deadly' => 6400},  # 15
      {'Easy' => 1600, 'Medium' => 3200, 'Hard' => 4800, 'Deadly' => 7200},  # 16
      {'Easy' => 2000, 'Medium' => 3900, 'Hard' => 5900, 'Deadly' => 8800},  # 17
      {'Easy' => 2100, 'Medium' => 4200, 'Hard' => 6300, 'Deadly' => 9500},  # 18
      {'Easy' => 2400, 'Medium' => 4900, 'Hard' => 7300, 'Deadly' => 10900}, # 19
      {'Easy' => 2800, 'Medium' => 5700, 'Hard' => 8500, 'Deadly' => 12700}, # 20
    ]
  end

  def self.difficulty(level, rating=nil)
    return self.difficulties[level] if !rating
    return self.difficulties[level][rating]
  end

  def self.difficulty_multiplier(monster_count)
    return 1   if monster_count == 1
    return 1.5 if monster_count == 2
    return 2   if monster_count <= 6
    return 2.5 if monster_count <= 10
    return 3   if monster_count <= 14
    return 4
  end

  def self.get_by_challenge_rating(cr, src=nil)
    self.search('challenge_rating', cr, src)
  end

  def self.search(key, value, src=nil)

    if src.nil? then
      file = File.read('public/5e-SRD-Monsters.json')
      src = JSON.parse(file)
    end

    needle = []
    src.each do |monster|
      needle << monster if monster[key] == value
    end

    return needle
  end

  ###
  # Generate Encounter.
  ###

  def self.calculate_xp_threshold(players, difficulty)
    xp_threshold = 0
    players.each do |player|
      xp_threshold = xp_threshold + self.difficulty(player, difficulty)
    end
    return xp_threshold
  end

  def self.generate_encounter(players, difficulty, encounter_size)
    xp_threshold = self.calculate_xp_threshold(players, difficulty)
    monsters_crs = self.get_monster_crs(encounter_size, xp_threshold)

    puts "xp_threshold: #{xp_threshold}, monsters_crs: #{monsters_crs}"

    result = []
    monsters_crs.each do |cr|
      result << self.get_by_challenge_rating(cr).sample
    end

    return result
  end

  def self.get_monster_crs(encounter_size, xp_threshold)
    adjusted_monster_xp = (xp_threshold / self.difficulty_multiplier(encounter_size)).to_i
    puts "adjusted_monster_xp: #{adjusted_monster_xp}"

    monsters_cr = []
    self.monsters_xp_by_cr.each do |monster_cr, xp|
      monsters_cr << monster_cr if xp <= adjusted_monster_xp
    end

    puts "monsters_cr: #{monsters_cr}, encounter_size: #{encounter_size}"
    return [monsters_cr.last] * encounter_size
  end
end
