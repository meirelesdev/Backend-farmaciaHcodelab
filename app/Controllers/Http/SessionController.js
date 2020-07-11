'use strict'

const User = use('App/Models/User')

class SessionController {

    async store({ request, response, auth }) {
        const { email, password } = request.all()
        const user = await User.findByOrFail(request.only(['email']))

        const token = await auth.attempt(email, password)

        return { token, user }
    }
}

module.exports = SessionController
