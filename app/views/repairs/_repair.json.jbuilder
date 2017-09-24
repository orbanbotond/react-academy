json.extract! repair, :id, :complete, :name, :user_id, :approved, :starts_at, :created_at, :updated_at
json.comments repair.comments, :created_at, :comment, :id
json.url repair_url(repair, format: :json)
