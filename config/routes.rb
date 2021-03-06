Rails.application.routes.draw do
  resources :repairs do
    put 'start', on: :member
  end

  resources :comments, only: [:create, :show]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'main#index'

  resources :users do
    get 'login', on: :collection
    post 'register', on: :collection
  end

end
