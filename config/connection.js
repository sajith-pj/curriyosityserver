const mongoClient= require('mongodb').MongoClient
const state={
    db: null
}

module.exports.connect=function(done){
    const dbname='restaurent'
    const url=`mongodb+srv://curryosity:<curryosity>@cluster0.whxhu.mongodb.net/${dbname}?retryWrites=true&w=majority||process.env.MONGODB_URI || mongodb://localhost:27017`

    mongoClient.connect(url,{useUnifiedTopology: true},(err,data)=>{
          
        if(err) return done(err)
    
     state.db=data.db(dbname)
          done()
    })
    
}
module.exports.get=function(){
    return state.db
}