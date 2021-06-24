var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
const { response  }= require('express')
var objectId = require('mongodb').ObjectID
module.exports={
    doSignup:(userData)=>{
        
            return new Promise(async(resolve,reject)=>
            {
                let response={}
                let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
                  if(user){
                      response.status=false
                        resolve(response)
                  }  else{
                    userData.password = await bcrypt.hash(userData.password,10 )
                    userData.confirmPassword = await bcrypt.hash(userData.confirmPassword,10)
                    db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                        response.status=true
                        resolve(data.ops[0],response)
                    }
                     )}
                  }
                
            )},

      doLogin:(userData)=>{
          return new Promise(async(resolve,reject)=>{
              let response = {}
              let user = await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
              if(user)
              { 
                  bcrypt.compare(userData.password,user.password).then((status)=>{
                      if(status){
                        response.user=user
                        response.status=true
                        resolve(response)
                      }
                    else
                    {
                        resolve({status:false})
                  
                    }
                  })
              }
              else
              {
                resolve({status:false})
                
              }
          })
      },

      updateUser:(userId,userdetails)=>{
        return new Promise((resolve,reject)=>{
                  db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{
                $set:{
                  firstName:userdetails.firstName,
                  lastName:userdetails.lastName,
                  Email:userdetails.Email,
                  address:userdetails.address,
                  phonenumber:userdetails.phonenumber,
                  city:userdetails.city,
                  country:userdetails.country,
                  postalcode:userdetails.postalcode
                }
            }).then((response)=>{
              resolve()
            })
        })
    
    },

    addToCart: (proId, userId )=>{
      return new Promise(async(resolve,reject)=>{
        let proObj = {
          item: objectId(proId),
          quantity: 1
        }
        let userCart = await db.get().collection(collection.CART).findOne({user: objectId(userId)})
        if(userCart){
          let productExist = userCart.products.findIndex( product => product.item == proId )
          console.log(productExist);
          if( productExist !=-1){
            console.log("-1");
            db.get().collection(collection.CART).updateOne({'products.item':objectId(proId)},
            {
              $inc:{'products.$.quantity':1}
            }).then(()=>{
              resolve()
            })
            }else{

            db.get().collection(collection.CART).updateOne({user: objectId(userId)},{
              $push:{products:proObj}
            }).then(()=>{
              resolve()
            })
            }
        }else{
          let cartObj={
            user:objectId(userId),
            products:[proObj]
          }
          db.get().collection(collection.CART).insertOne(cartObj).then(( response)=>{
            resolve()
          }
          )
        }
      })
    },

    getCartItems: (userId)=>{
      console.log(userId);
      return new Promise(async (resolve,reject)=>{

        let cartItems = await db.get().collection(collection.CART).aggregate([
          {
            $match:{user: objectId(userId)}
          }
          ,{
            $unwind:'$products'
          }
          ,
          {
            $project:{
              item:'$products.item',
              quantity:'$products.quantity'
            }
          },
          {
            $lookup:{
              from:collection.PRODUCT_COLLECTION,
              localField:'item',
              foreignField:'_id',
              as:'product'
            }
          },{
            $project:{
              item:1,quantity:1,product:{ $arrayElemAt:['$product',0]} 
            }
          }
        ]).toArray()
        resolve(cartItems)
      })
    },
    changeQuantity:(cartId,productId,count , quantity)=>{
     count = parseInt(count)
      return new Promise( async(resolve,reject)=>{
        if( count == -1 && quantity == 1){
          db.get().collection(collection.CART).updateOne({_id: objectId(cartId),'products.item':objectId(productId)},{
            $pull:{products:{item:objectId(productId)}}
          }).then((response)=>{
            resolve({productRemoved:true})
          })

        }else{
        db.get().collection(collection.CART).updateOne({_id: objectId(cartId),'products.item':objectId(productId)},
        {
          $inc:{'products.$.quantity':count}
        }).then((response)=>{
          resolve( true )
        })
      }
      })
    },
    removeCartProduct: ( cartId ,productId )=>{
      return new Promise(async(resolve,reject)=>{
        db.get().collection(collection.CART).updateOne({_id: objectId(cartId),'products.item':objectId(productId)},{
          $pull:{products:{item:objectId(productId)}}
        }).then((response)=>{
          resolve({productRemoved:true})
        })
      })
    },

    getTotalAmount:( userId )=>{
      return new Promise(async(resolve,reject)=>{
        let total = await db.get().collection(collection.CART).aggregate([
          {
            $match:{user: objectId(userId)}
          }
          ,{
            $unwind:'$products'
          }
          ,
          {
            $project:{
              item:'$products.item',
              quantity:'$products.quantity'
            }
          },
          {
            $lookup:{
              from:collection.PRODUCT_COLLECTION,
              localField:'item',
              foreignField:'_id',
              as:'product'
            }
          },{
            $project:{
              item:1,quantity:1,product:{ $arrayElemAt:['$product',0]} 
            }
          },
            {
              $group:{
                _id:null,
                total:{$sum:{$multiply:['$quantity', { $toInt:'$product.price'}]}}
              }
            }
    
        ]).toArray()
        console.log(total[0].total);
        if(total == undefined){
          resolve({cartStatus:false})
        }else{
          resolve(total[0].total)
        }
      })
    },
    getCartProduct:(userId)=>{
      return new Promise(async(resolve,reject)=>{
        let cart = await db.get().collection(collection.CART).findOne({user: objectId(userId)})
        resolve(cart.products)
      })
    },
    placeOrder:( orderDetails , userId , product, total,date)=>{
      return new Promise(async(resolve,reject)=>{
        let status = orderDetails.paymentMethod ==='COD'?"placed":"pending"
        let orderObj = {
          deliveryDetails:{
            address:orderDetails.address,
            pincode: orderDetails.pincode,
            phone:orderDetails.phone,
          },
          products:product,
          user: objectId(userId),
          status:status,
          total:total,
          date:date
        }

        db.get().collection(collection.ORDER).insertOne(orderObj).then((response)=>{
          console.log(userId);
          db.get().collection(collection.CART).removeOne({user: objectId(userId)})
          resolve()
        })

      })
    },
    getOrders: (userId)=>{
      return new Promise(async(resolve,reject)=>{
        let orders = db.get().collection(collection.ORDER).find({user: objectId(userId)}).toArray()
        resolve(orders)
      })
    },

    
}