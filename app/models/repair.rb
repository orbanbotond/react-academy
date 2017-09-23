class Repair < ApplicationRecord
  belongs_to :user, optional: true
end
