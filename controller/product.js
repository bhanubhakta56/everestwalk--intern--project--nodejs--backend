const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

const User = require("../models/user");
const Product = require("../models/product");

exports.addProduct =  asyncHandler(async(req, res, next) => {

    const product = new Product({
        name: req.body.productName,
        price: req.body.price,
        color: req.body.color,
        description: req.body.description,
        size: req.body.size,
        stock: req.body.price,
        material: req.body.material
    });

    const response = await product.save();
    if(!response){
        return next(new ErrorResponse("Error adding product"), 404);
    }
    res.status(201).json({success:true, message:"product added successfully", data:response}) 
});

//upload image
exports.productPhoto = asyncHandler(async(req, res, next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorResponse(`Product not found`, 404));
    }
    if(!req.files){
        return next(new ErrorResponse(`Please Upload a file`, 400));
    }

    const file = req.files.file;

     // Make sure the image is a photo and accept any extension of an image
    if (!file.mimetype.startsWith("image")) {
      return next(new ErrorResponse(`Please upload an image`, 400));
    }

    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
        new ErrorResponse(
            `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
            400
        )
        );
    }

    file.name = `photo_${product.id} ${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
          //console.err(err);
          return next(new ErrorResponse(`Problem with file upload`, 500));
        }
    
        //insert the filename into database
        await Product.findByIdAndUpdate(req.params.id, {photo:file.name});
        // Product.findByIdAndUpdate({_id:user._id},{$push:{photo:file.name}});// to store multiple photos
      });
      res.status(200).json({
        success: true,
        data: file.name,
      });

})

//----------------------------GET ALL PRODUCT WEB-------------------
exports.getAllProduct = asyncHandler(async(req, res, next)=>{
    const product = await Product.find()
    if(!product){
      return res.status(404).json({
        success: false,
        message:"data not found"
      });
    }
    res.status(201).json({
        success: true,
        count: product.length,
        data: product,
      });
});

//--------------------------SEARCH PRODUCT API-----------------------------
exports.searchProduct = asyncHandler(async(req, res, next)=>{
    const product = await Product.find({name:req.params.product})
    if(!product){
      return res.status(404).json({
        success: false,
        message:"data not found"
      });
    }
    res.status(201).json({
        success: true,
        count: product.length,
        data: product,
      });
});