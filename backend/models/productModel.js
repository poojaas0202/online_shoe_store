import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    _id: false, // Exclude _id field for subdocuments
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    gender: { type : String , required: true},
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    stock: {
      type: {
        '7': { type: Number, default: 0 },
        '8': { type: Number, default: 0 },
        '9': { type: Number, default: 0 },
        '10': { type: Number, default: 0 },
        // Add more sizes as needed
      },
      _id: false, 
      required: true,
      default: {
        '7': 0,
        '8': 0,
        '9': 0,
        '10': 0,
        // Default stock for each size
      },
    },
    colors: [colorSchema],
    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
