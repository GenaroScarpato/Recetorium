const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dkpwnkhza', // Tu cloud name
  api_key: '125547778269676', // Tu API Key
  api_secret: 'VorqH6OGUj3sVMWYfpHCRbxUhsU', // Reemplaza con tu API Secret
});

module.exports = cloudinary;