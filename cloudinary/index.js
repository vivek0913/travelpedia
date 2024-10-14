const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params:{
        folder: 'YelpCamp',
        allowedFormats : ['jpeg', 'png', 'jpg']
        
    }
});

module.exports = {
    cloudinary,
    storage
}




/*
async function uploadImage(imagePath) {
    try {
        const result = await cloudinary.uploader.upload(imagePath, {
            folder: 'YelpCamp', // Optional: Folder name in Cloudinary
            allowed_formats: ['jpeg', 'png', 'jpg'], // Optional: Allowed file formats
        });

        console.log("Upload successful!", result);
        return result;  // The result contains URL, public_id, etc.
    } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        throw error;  // Handle the error appropriately
    }
}

// Example usage
uploadImage('/users/macbook/downloads/1721799740699_1.jpg');

*/