const mongoClient= require('mongodb').MongoClient
const state={
    db: null
}
//||process.env.MONGODB_URI || mongodb://localhost:27017`

module.exports.connect=function(done){
   const url=`mongodb+srv://curryosity:curryosity@cluster0.whxhu.mongodb.net/restaurant?retryWrites=true&w=majority`
    //const url='process.env.MONGODB_URI||mongodb://localhost:27017'
    
    mongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology: true },(err,data)=>{
        const dbname='restaurant'
          
        if(err) return done(err)
    
     state.db=data.db(dbname)
          done()
    })
    
}
module.exports.get=function(){
    return state.db
}