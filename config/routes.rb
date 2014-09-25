Rails.application.routes.draw do
  root 'home#index'
  get '/search', to: 'home#search', defaults: {format: :json}
end
