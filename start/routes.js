'use strict'


const Route = use('Route')
// Rota para cadastro de usuarios
Route.post('users/new', 'UserController.store')


// Rotas para administração controlar usuarios
Route.group(()=>{
    Route.resource('users', 'UserController').apiOnly()
}).prefix('admin').middleware('auth')

//Duas rotas liberadas para usuarios
Route.get('products', 'ProductController.index')
Route.get('/products/:id', 'ProductController.show')
Route.get('products/image/:id', 'ProductController.getPhoto')

// rotas de produtos trancadas para administrador
Route.group(()=>{
    Route.resource('products', 'ProductController').apiOnly()
}).prefix('admin')
// Rotas para administrar Contatos
Route.group(()=>{
    Route.resource('contacts', 'ContactController').apiOnly()
  }).prefix('admin')

// Rota de Autenticação
Route.post('sessions', 'SessionController.store')
Route.delete('admin/users/:id', 'UserController.destroy')

