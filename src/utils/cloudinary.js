const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dftes9ppl',
  api_key: '477845519433917',
  api_secret: 'Q1eaeyPWTR7oUAQ-7PWlvmqkyjw'
});

module.exports = cloudinary;