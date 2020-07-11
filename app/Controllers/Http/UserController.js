'use strict'

const User = use('App/Models/User')

class UserController {
    async store({ request, response }) {
        const data = request.only(['username', 'email', 'password'])

        const user = await User.create(data)
        
        response.send(user)
    }
    async index(){
        const users = await User.all()

        return users
    }
    async show([params, response ]){
        const user = await User.findOrFail(params.id)

        response.send(user)
    }

    async destroy ({ params, auth, response }) {

        const user = await User.findOrFail(params.id)

        if(user.id !== auth.user.id){
            response.status(401).send({ error: 'Não Autorizado'})
        }
        await user.delete()

    }
}

module.exports = UserController