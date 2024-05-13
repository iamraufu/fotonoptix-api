const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
      name: {
            type: String,
            unique: true,
            trim: true,
            required: true
      },
      category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
            required: true
      },
      subcategory: {
            type: mongoose.Types.ObjectId,
            ref: "Subcategory",
            required: true
      },
      description: {
            type: String,
            trim: true,
            required: true
      },
      features: {
            type: Array,
            of: String,
            required: true
      },
      specificationDocument: {
            type: String,
            // required: true
      },
      manualDocument: {
            type: String,
            // required: true
      },
      image: {
            type: Array,
            of: String,
            required: true
      },
      schematicDiagram: {
            type: String,
            // required: true
      },
      applications: {
            type: Array,
            of: String,
            required: true
      },
      isDeleted: {
            type: Boolean,
            default: false,
      },
      specifications: {
            type: [
                  {
                        model: {
                              type: String,
                              unique: true,
                              trim: true,
                              // required: true
                        },
                        outputPower: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        operatingMode: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        polarizationState: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        powerRange: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        beamQuality: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        powerInstability: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        centerWavelength: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        spectralWidth: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        pwmTurnOnTime: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        spotEllipticity: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        maxModulation: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        redLight: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        outputMethod: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        cableLength: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        coreDiameter: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        cableRadius: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        workingVoltage: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        powerConsumption: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        controlMethod: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        environmentTemperature: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        humidity: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        coolingMethod: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        waterTemperature: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        waterFlow: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        waterPressure: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        outerDiameter: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        size: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        },
                        weight: {
                              type: String,
                              trim: true,
                              // required: true,
                              // default: ""
                        }
                  }
            ],
            required: true,
      }
})

module.exports = mongoose.model("Product", productSchema)