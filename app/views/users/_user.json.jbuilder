json.extract! user, :id, :created_at, :updated_at, :name, :admin
json.url user_url(user, format: :json)
