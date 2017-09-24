class Repair < ApplicationRecord
  belongs_to :user, optional: true
  has_many :comments, dependent: :destroy
end
