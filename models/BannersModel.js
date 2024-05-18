const mongoose = require("mongoose")

const bannerSchema = new mongoose.Schema({
      title: {
            type: String,
            required: true,
            enum: ['slider', 'product', 'application', 'support', 'about', 'news', 'videos', 'contact']
      },
      link: {
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

module.exports = mongoose.model("Banner", bannerSchema)