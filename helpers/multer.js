const multer = require('multer');
const multerConfig =multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'/public/images/product-images/')
    },
    filename: (req,file,cb)=>{
        const ext = file.mimetype.split('/')[1]
        cb(null,`file-id.${ext}`)
    }
})
const upload =  multer({
    dest:'public/images/product-images',
    storage:multerConfig
})

exports.uploadFile = upload.single('file')

exports.upload = (req,res)=>{
}