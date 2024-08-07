const mongoose = require("mongoose")

const subcategorySchema = new mongoose.Schema({
      name: {
            type: String,
            trim: true,
            required: true
      },
      category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true
      },
      image: {
            type: String,
            default: "",
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

module.exports = mongoose.model("Subcategory", subcategorySchema)