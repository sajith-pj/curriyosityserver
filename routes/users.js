var express = require('express');
const productHealpers = require('../helpers/product-healpers');
const userHelpers = require('../helpers/user-helpers');
var router = express.Router();

/* GET users listing. */
const verifyLogin = (req,res,next)=>{
  if(req.session.user){
      next()
  }else{
    res.send({loggedIn:false})
  }
}

router.get('/', function(req, res) {
  let user = req.session.user;
   if(req.session.loggedIn){
   res.json(user)
   }else{
     res.send(false)
   }
});

router.post('/signup', function(req, res, ) {
  userHelpers.doSignup(req.body).then(( response )=>{
    res.send(response.status)
  })
});

router.get('/login', function(req, res) {
    if(req.session.loggedIn){
      res.send(req.session.loggedIn);

    }else{
      req.session.loggedIn = false
      res.send(req.session.loggedIn)

    }
});


router.post('/login', function(req, res) {
  userHelpers.doLogin(req.body).then(( response )=>{
    if(response.status){
      req.session.loggedIn = true
      req.session.user = response.user
    res.json(req.session.user)
    }
  })
});

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.send({logOut:true})
})


router.get('/products', (req, res)=>{
  if(req.query.category){
    let category = req.query.category

    if(category){
  productHealpers.getProductByCategory(category).then(( response)=>{
    res.send({products:response , user:req.session.user})
  })    
  }
}else{
  productHealpers.getAllProducts( ).then( ( response)=>{
    res.send({products:response ,user:req.session.user})
  })
}
})

router.get('/add-to-cart',verifyLogin,(req,res)=>{
    let proId = req.query.id
   userHelpers.addToCart( proId, req.session.user._id ).then(( response )=>{
    res.send(response)
   })
})

router.get('/cart', verifyLogin,async(req,res)=>{
 userHelpers.getCartItems( req.session.user._id ).then(( response )=>{
  res.send({products:response ,user:req.session.user})
 })
})

router.post( '/change-quantity',verifyLogin,(req, res)=>{
    let cartId = req.body.data.cartId
    let productId = req.body.data.productId
    let count = req.body.data.count
  let quantity = req.body.data.quantity
  userHelpers.changeQuantity ( cartId , productId, count ,quantity ).then(( response )=>{
    console.log(response);
       res.json(response)
  
    })
})

router.get('/get-total-amount',verifyLogin,async(req, res)=>{
  let total = await userHelpers.getTotalAmount( req.session.user._id )
  res.send({total:total})
})

router.post('/place-order',verifyLogin,async(req,res)=>{
  console.log(req.body);
    let products = await userHelpers.getCartProduct( req.session.user._id) 
    let total =  await userHelpers.getTotalAmount( req.session.user._id)
    let date = await new Date()
    userHelpers.placeOrder( req.body ,req.session.user._id,products, total ,date).then(( response )=>{
      res.json({orderStatus:true})
    })
    console.log(products);
})

router.post('/remove-cart-product',verifyLogin, (req,res)=>{
  userHelpers.removeCartProduct( req.body.cartId,req.body.productId).then(( response )=>{
    res.json(response)
  })
})


router.get('/orders',verifyLogin,(req,res)=>{
  userHelpers.getOrders( req.session.user._id).then(( response)=>{
    res.send({orderDetails:response,user:req.session.user})
  })
})

router.get('/orders',verifyLogin,(req,res)=>{
      res.send(req.session.user)
})


module.exports = router;
