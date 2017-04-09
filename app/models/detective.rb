class Detective

  def self.get_by_challenge_rating(cr, src = nil)
    self.search('challenge_rating', cr)
  end

  def self.search(key, value, type, src = nil)

    if (src.nil?) do
      file = File.read('public/5e-SRD-Monsters.json')
      src = JSON.parse(file)
    end

    needle = []
    for monster in src
      if (monster[key] == value)
        needle << monster
    end

    return needle
  end
end
