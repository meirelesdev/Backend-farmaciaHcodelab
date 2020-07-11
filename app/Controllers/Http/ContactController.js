'use strict'

const Contact = use('App/Models/Contact')

class ContactController {
  
  async index () {

    return await Contact.all()

  }

  async store ({ request }) {

    const data = request.only(['name', 'phone','email', 'message', 'answered'])

    const contact = await Contact.create(data)

    return contact

  }

  async show ({ params, response }) {

        const contact = await Contact.findOrFail(params.id)

        response.send(contact)
  }

  async update ({ params, request, response }) {
        
    const contact = await Contact.findOrFail(params.id)

        const data = request.only(['name', 'phone','email', 'message', 'answered'])

        contact.merge(data)

        await contact.save()

        response.send(contact)

  }

   async destroy ({ params, response }) {

    const contact = await Contact.findOrFail(params.id)

      await contact.delete()

      response.send("Contato deletado.")
  
    }
}

module.exports = ContactController
