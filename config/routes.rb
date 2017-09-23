Rails.application.routes.draw do
  resources :repairs
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'main#index'

  resources :users do
    get 'login', on: :collection
  end

end
