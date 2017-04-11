class CreateEncounters < ActiveRecord::Migration[5.0]
  def change
    create_table :encounters do |t|

      t.timestamps
    end
  end
end
