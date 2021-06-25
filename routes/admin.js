var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');
const productHealpers = require('../helpers/product-healpers');
var fs =  require('fs')

var multer = require('multer');
const { emitKeypressEvents } = require('readline');

var storage = multer.diskStorage({
  
    destination: function (req, file, cb) {
      cb(null, 'public/images/product-images/')
    },
    filename: function (req, file, cb) {
            const ext =  file.mimetype.split('/')[1]
      cb(null, file.fieldname + '-' + Date.now()+`.${ext}`)
    }
  })
var upload =  multer({ storage: storage})


const verifyLogin = (req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
      res.send({loggedIn:false})
    }
}


router.post('/login',(req,res)=>{
    adminHelpers.doLogin( req.body ).then( response =>{
        req.session.admin = response.admin
        req.session.loggedIn = true
        res.send(response)
    })
})


router.get('/products',verifyLogin,(req,res)=>{
    productHealpers.getAllProducts().then( (response)=>{
      res.json(response)      
    })

 })




 router.get('/add-product',verifyLogin,(req,res)=>{
    res.send({loggedIn:true})
 })

 router.get('/edit-product',verifyLogin,(req,res)=>{
    productHealpers.getProductDetails(req.query.proId ).then( product =>{
      res.send(product)
    })
})

router.post('/update-product',verifyLogin, upload.single('file'),(req,res)=>{
  let  file =  req.file
  let   image =  fs.readFileSync(file.path)
  let encodedImg =  image.toString('base64')
  var  product = {
        productName: req.body.productName,
        category: String(req.body.category).toLowerCase(),
        price: req.body.price,
        description: req.body.description,
        filename: file.originalname,
        contentType: file.mimetype,
        base64: encodedImg
    }
  let proId  = req.body.id
  productHealpers.updateProduct(proId , product).then( () =>{
    res.send({updated: true})
  })
})


router.get('/delete-product',verifyLogin,(req,res)=>{
  productHealpers.deleteProduct(req.query.proId ).then( (response) =>{
     if(response){
       res.send({deleted:true})
     } 
  })
})

router.get('/change-password',verifyLogin,(req,res)=>{

})

router.post('/change-password',verifyLogin,(req,res)=>{
   adminHelpers.changePassword( req.session.admin._id , req.body ).then( ()=>{
     res.send({changePassword:true})
   })
})

router.post('/add-product',verifyLogin,upload.single("file"),(req,res)=>{
  let  file =  req.file
  let   image =  fs.readFileSync(file.path)
  let encodedImg =  image.toString('base64')
  let product = {
    productName: req.body.productName,
    category: String(req.body.category).toLowerCase(),
    price: req.body.price,
    description: req.body.description,
    filename: file.originalname,
    contentType: file.mimetype,
    base64: encodedImg
  }

 productHealpers.addProduct( product ).then( id =>{
    if(id){
      res.send({success:true})
    }
 })
})

router.get('/orders',verifyLogin,(req,res)=>{
      adminHelpers.getOrders().then( response =>{
        
      res.send(response)
      })
})

router.post('/ordered-products',verifyLogin,(req,res)=>{
    adminHelpers.getOrderedProduct( req.body.orderId ).then( response =>{
      res.send(response)
    })
})

router.get('/logout',(req,res)=>{
    req.session.destroy()
    res.send({logOut:true})
 })
 


module.exports = router;
