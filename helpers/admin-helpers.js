var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
const { response  }= require('express')
var objectId = require('mongodb').ObjectID

module.exports={
        doLogin:(adminData)=>{
          return new Promise(async(resolve,reject)=>{
              let loginStatus =false
              let response = {}
              let admin = await db.get().collection(collection.ADMIN).findOne({email:adminData.email})
            
              if(admin)
              { 
                  bcrypt.compare(adminData.password,admin.password).then((status)=>{
                      if(status){
                        response.admin=admin
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

    getAllUsers:()=>{
      return new Promise(async(resolve,reject)=>{
          let user=await db.get().collection(collection.USER_COLLECTION).find().toArray()
          resolve(user)
      })
},
  changePassword:( adminId,password)=>{
    return new Promise(async(resolve,reject)=>{
      let oldPassword =  await bcrypt.hash(password.password,10)
      let newPassword =  await bcrypt.hash(password.newPassword,10)
           db.get().collection(collection.ADMIN).updateOne({_id:objectId(adminId)},{
            $set:{
              password: newPassword
            }
          }).then(( response )=>{
            resolve()
          })
    })
  },
  getOrders: ()=>{
    return new Promise(async(resolve,reject)=>{
      let orders = db.get().collection(collection.ORDER).find().toArray()
      resolve(orders)
    })
  },
  getOrderedProduct:(orderId)=>{
    return new Promise(async(resolve,reject)=>{
      let cartItems = await db.get().collection(collection.ORDER).aggregate([
        {
          $match:{_id: objectId(orderId)}
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
  }

}