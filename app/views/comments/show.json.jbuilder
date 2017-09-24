json.extract! @comment, :id, :created_at, :updated_at, :comment, :repair_id
json.url user_url(@comment, format: :json)
