const express = require('express')
const req = require('express/lib/request')
const app = express()
const mongoose = require('mongoose')
const ShortUrl=require('./models/shorturl')

mongoose.connect('mongodb://localhost/urlShotner',{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('Database connected!')).catch(err=>console.log(err))


app.set('view engine','ejs')
app.use(express.urlencoded({extended:false}))

app.get('/',async (req,res)=>{
    const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls:shortUrls})
})

app.post('/shorturls',async (req,res)=>{
    await ShortUrl.create({full:req.body.fullurl})
    console.log('created!!')
    res.redirect('/')
})

app.get('/:shortUrl', async (req,res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if (shortUrl==null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()
    res.redirect(shortUrl.full)
})
app.listen(process.env.PORT||5000)

