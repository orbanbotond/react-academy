class CreateRepairs < ActiveRecord::Migration[5.1]
  def change
    create_table :repairs do |t|
      t.boolean :complete
      t.string :name
      t.references :user, foreign_key: true
      t.boolean :approved
      t.datetime :starts_at

      t.timestamps
    end
  end
end
