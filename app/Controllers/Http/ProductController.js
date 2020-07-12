'use strict'

const Product = use('App/Models/Product')
const Helpers = use('Helpers')
const fs = use('fs')
const readFile = Helpers.promisify(fs.readFile)
const deleteFile = Helpers.promisify(fs.unlink)

const uploadDir = 'Products'

class ProductController {
  
  async index ({ response }) {
  
    const products = await Product.all()
  
    response.send(products)
  
  }

  async store ({ request, response }) {
    
    const dataProduct = request.only(['name', 'description', 'oldprice', 'price', 'category'])
    
    const fileProduct = request.file('file', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    if(!fileProduct){
      response.status(400).json({error: 'Arquivos Requerido!'})
      return
    }

    const name = `${Date.now()}.${fileProduct.extname}`

    await fileProduct.move(Helpers.resourcesPath(uploadDir), {
      name,
      overwrite: true
    })

    if(!fileProduct.moved()) {
      response.status(400).json({error: fileProduct.error()})
      return
    }
    dataProduct.urlimg = `${uploadDir}/${name}`

    const product = await Product.create(dataProduct)
    
    response.send(product)

  }
  async getPhoto({ params, response }) {
    
    const product = await Product.findOrFail(params.id)
    
  
    const content = await readFile(Helpers.resourcesPath(product.urlimg))
    
    response.header('Content-type', 'image/*').send(content)  

}

  async show ({ params, response }) {
    
    const product = await Product.findOrFail(params.id)

    response.send(product)
    
  }

  async update ({ params, request, response }) {
    
    const product = await Product.findOrFail(params.id)

    const dataProduct = request.only(['name', 'description', 'oldprice', 'price', 'category'])
  
    dataProduct.url = product.url

    const newPhoto = request.file('file', {
      maxSize: '2mb',
      allowedExtensions: ['jpg', 'png', 'jpeg']
    })

    if(newPhoto){
      
      await deleteFile(Helpers.resourcesPath(product.urlimg))

      const name = `${Date.now()}.${newPhoto.extname}`

      await newPhoto.move(Helpers.resourcesPath(uploadDir), {
        name,
        overwrite: true
      })
      if(!newPhoto.moved()){
        response.status(400).json({error: newPhoto.error()})
        return
      }
      dataProduct.urlimg = `${uploadDir}/${name}`
    }

    product.merge(dataProduct)
  
    product.save()

    response.send(product)

  }

  async destroy ({ params, response }) {
  
    const product = await Product.findOrFail(params.id)
    
    await deleteFile(Helpers.resourcesPath(product.urlimg))

    await product.delete()

    response.send('Produto Apagado.')

  }
}

module.exports = ProductController
