class CreateRepairs < ActiveRecord::Migration[5.1]
  def change
    create_table :repairs do |t|
      t.boolean :complete, default: false
      t.string :name
      t.references :user, foreign_key: true
      t.boolean :approved, default: false
      t.datetime :starts_at

      t.timestamps
    end
  end
end
