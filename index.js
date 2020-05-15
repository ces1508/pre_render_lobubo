const express = require('express')
const request = require('request')
const API = 'https://dimo.app/api/app'
const DEFAULT = {
  image: 'https://s3-us-west-2.amazonaws.com/lobubo/images/lobubo_face.jpg',
  description: 'Atrae cientos de visitantes a tu negocio o emprendimiento',
  name: 'Dimo',
  url: 'https://dimo.app'
}


const app = express()
app.set('view engine', 'pug')


function buildPayload (data, url) {
  let fullUrl = `${DEFAULT.url}${url}`
  if (data) {
    return {
      name: data.attributes.name,
      image: data.attributes['image-data'].original.url || DEFAULT.image,
      description: data.attributes.description,
      price: data.attributes.price,
      url: fullUrl
    }
  }
  return { ...DEFAULT, fullUrl }
}
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

