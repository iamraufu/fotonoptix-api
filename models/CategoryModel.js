const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
      name: {
            type: String,
            trim: true,
            immutable: true,
            required: true
      },
      banner: {
            type: String,
            default: ""
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

module.exports = mongoose.model("Category", categorySchema)