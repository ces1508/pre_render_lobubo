const express = require('express')
const request = require('request')
const API = 'http://localhost:80/api/app'
const URL = 'https://dimo.shop'
const DEFAULT = {
  image: 'https://s3-us-west-2.amazonaws.com/lobubo/images/lobubo_face.jpg',
  description: 'Atrae cientos de visitantes a tu negocio o emprendimiento',
  name: 'Dimo',
  url: 'https://dimo.shop'
}
const DefaultCoordinates = {
  latitude: 4.708829,
  longitude: -74.054164,
  radius:1000
}

const app = express()
app.set('view engine', 'pug')


function buildPayload (data, url) {
  let fullUrl = `${URL}${url}`
  if (data) {
    return {
      name: data.attributes.seoTitle,
      image: data.attributes['image-data'].original.url || DEFAULT.image,
      description: data.attributes.seoDescription,
      url: fullUrl
    }
  }
  DEFAULT.url = fullUrl
  return { ...DEFAULT }
}

app.get('/', (req, res) => {
  DEFAULT.name = 'Dimo.shop | Compra online moda, tecnologia, mascotas, alimentos y más.',
  DEFAULT.description = 'Dimo tu centro comercial en línea, encuentra marcas 100% colombianas con enviós a todo Colombia. Encuentra moda, tecnología, restaurantes, supermecados.'
  res.render('index', buildPayload(null, req.url))
})
app.get('/mobile', (req, res) => {
  DEFAULT.name = 'Dimo.shop | Compra desde tu celular moda, tecnologia, alimentos y más.'
  DEFAULT.description = 'Dimo tu centro comercial en línea, encuentra marcas 100% colombianas con enviós a todo Colombia. Encuentra moda, tecnología, restaurantes, supermecados.'
  res.render('index', buildPayload(null, req.url))
})
app.get('/productos', (req, res) => {
  DEFAULT.name = 'Dimo.shop | Encuenta moda, tecnología, deportes, belleza y más.'
  DEFAULT.description ='Dimo encuentra todo lo que estabas buscando en moda, tecnoloía, belleza, cuidado personal, accesorios de mascota y más, en una solo sitio web. Conoce más'
  res.render('index', buildPayload(null, req.url))
})
app.get('/restaurantes', (req, res) => {
  DEFAULT.name = 'Dimo.shop | Restaurantes a domicilio | Deliciosa comida a tu mesa'
  DEFAULT.description = 'Te llevamos hasta la puerta de tu casa u oficna tu comida favorita en Dimo te recomendamos los mejores platos. Dimo.shop tu centro comercial en línea.'
  res.render('index', buildPayload(null, req.url))
})

app.get('/restaurante/:brand/menu/:id', (req, res) => {
  let { id } = req.params
  request(`${API}/menus/${id}`, (err, response, body) => {
    if (err) {
      return res.render('index', buildPayload(null, req.url))
    }
    let { data } = JSON.parse(body)
    DEFAULT.image = data.banner_img.url
    DEFAULT.name = data.seo_title
    DEFAULT.description = data.seo_description
    DEFAULT.url = `${req.url}`
    res.render('index', buildPayload(null, req.url))
  })
})
app.get('/productos/categoria/:id', (req, res) => {
  let { id } = req.params
  request(`${API}/categories/${id}`, (err, response, body) => {
    if (err) {
      return res.render('index', buildPayload(null, req.url))
    }
    let { data } = JSON.parse(body)
    DEFAULT.image = data.image.url
    DEFAULT.name = data.seo_title
    DEFAULT.description = data.seo_description
    DEFAULT.url = `${req.url}`
    res.render('index', buildPayload(null, req.url))
  })
})

app.get('/restaurante/:id', (req, res) => {
  let { id } = req.params
  request(`${API}/brands/${id}?latitude=${DefaultCoordinates.latitude}&longitude=${DefaultCoordinates.longitude}&radius=${DefaultCoordinates.radius}`, (err, response, body) => {
    if (err) {
      return res.render('index', buildPayload(null, req.url))
    }
    let { data } = JSON.parse(body)
    data.attributes['image-data'] = data.attributes.logo
    res.render('index', buildPayload(data, req.url))
  })
})
app.get('/tienda/:id', (req, res) => {
  let { id } = req.params
  request(`${API}/brands/${id}`, (err, response, body) => {
    if (err) {
      return res.render('index', buildPayload(null, req.url))
    }
    let { data } = JSON.parse(body)
    data.attributes['image-data'] = data.attributes.logo
    res.render('index', buildPayload(data, req.url))
  })
})
app.get('/restaurante/:brand/comidas/:id', (req, res) => {
  let { id } = req.params
  request(`${API}/products/${id}`, (err, response, body) => {
    if (err) {
      return res.render('index', buildPayload(null, req.url))
    }
    let { data } = JSON.parse(body)
    res.render('index', buildPayload(data, req.url))
  })
})

app.get('/ecommerce/product/:id', (req, res) => {
  let { id } = req.params
  request(`${API}/products/${id}`, (err, response, body) => {
    if (err) {
      return res.render('index', buildPayload(null, req.url))
    }
    let { data } = JSON.parse(body)
    res.render('index', buildPayload(data, req.url))
  })
})
app.get('/store/:id', (req, res) => {
  let { id } = req.params
  request(`${API}/brands/${id}`, (err, response, body) => {
    if (err) {
      return res.render('index', buildPayload(null, req.url))
    }
    let { data } = JSON.parse(body)
    data.attributes['image-data'] = data.attributes.logo
    res.render('index', buildPayload(data, req.url))
  })
})
app.get('*', (req, res) => {
  res.render('index', buildPayload(null, req.url))
})
app.listen(3101, err => {
  if (err) {
    console.log(`error launching server ${e.message}`)
    throw err
  }
  console.log('server listening')
})

