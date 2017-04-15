Rails.application.routes.draw do
  resources :encounters

  get 'design', to: 'encounters#design', as: :design
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'encounters#design'
end
