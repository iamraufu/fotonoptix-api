const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema({
      name: {
            type: String,
            trim: true,
            unique: true,
            required: true
      },
      description: {
            type: String,
            trim: true,
            required: true
      },
      relatedProducts: {
            type: Array,
            Of: mongoose.Types.ObjectId,
            ref: "Product",
            default: []
      },
      image: {
            type: String,
            required: true
      },
      icon: {
            type: String,
            required: true
      },
      isDeleted: {
            type: Boolean,
            default: false,
      },
      createdAt: {
            type: Date,
            default: new Date(),
            immutable: true
      },
      updatedAt: {
            type: Date,
            default: null
      }
})

module.exports = mongoose.model("Application", applicationSchema)