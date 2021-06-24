var db = require('../config/connection')
var collection = require('../config/collections')
const response = require('express')
var objectId = require('mongodb').ObjectID
module.exports = {

    addProduct: (product) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
                resolve(data.ops[0])
        
        })
        })


    },
    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            let count = await db.get().collection(collection.PRODUCT_COLLECTION).count()
            
            resolve(product,count)
        
        })
    
    }
    ,
    deleteProduct: (proId) => {
        return new Promise(async (resolve, reject) => {

            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(proId) }).then((response) => {
                resolve(response)
            })

        })
    },

    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            console.log(proId);
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id:  objectId(proId) }).then((product) => {
                resolve(product)
            })
        })
    },

    updateProduct: (proId, productdetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({ _id: objectId(proId) }, {
                $set: {
                    productName: productdetails.productName,
                    category: productdetails.category,
                    description: productdetails.description,
                    price: productdetails.price,
                    filename: productdetails.filename,
                    contentType:productdetails.contentType,
                    base64: productdetails.base64
                }
            }).then(() => {
                resolve()
            })
       
        })
    },
    getProductByCategory:( categoryValue ) => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find({category:categoryValue}).toArray()
            let count = await db.get().collection(collection.PRODUCT_COLLECTION).count()
            
            resolve(product,count)
        
        })
    
    }
    ,
    getSearchProduct: (search) => {
        console.log(search);
        return new Promise(async (resolve, reject) => {
           
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find({productname:{$regex:search, $options: '$i'}}).toArray()
           console.log(product);
           resolve(product)
        })
    
    }



}