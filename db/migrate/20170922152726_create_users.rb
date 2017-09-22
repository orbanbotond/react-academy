class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :name
      t.boolean :admin
      t.text :password_hash

      t.timestamps
    end
  end
end