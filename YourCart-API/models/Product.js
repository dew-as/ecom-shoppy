const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPercentage: { type: Number, required: true },
  rating: { type: Number, required: true },
  stock: { type: Number, required: true },
  tags: [{ type: String }],
  brand: { type: String, required: true },
  warrantyInformation: { type: String, required: true },
  shippingInformation: { type: String, required: true },
  availabilityStatus: { type: String, required: true },
  reviews: [
    {
      rating: { type: Number, required: true },
      comment: { type: String, required: true },
      date: { type: Date, default: Date.now },
      reviewerName: { type: String, required: true },
      reviewerEmail: { type: String, required: true }
    }
  ],
  returnPolicy: { type: String, required: true },
  minimumOrderQuantity: { type: Number, required: true },
  images: [{ type: String }],
  thumbnail: { type: String }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
