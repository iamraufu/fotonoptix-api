const mongoose = require("mongoose");
const ApplicationModel = require('../models/ApplicationsModel')

// Create a application
const create = async (req, res) => {
      try {
            const { name } = req.body
            const applicationExist = Boolean(await ApplicationModel.findOne({ name }))

            if (!applicationExist) {
                  const application = await ApplicationModel.create(req.body)

                  return res.status(201).send(
                        {
                              status: true,
                              message: "Application created successfully!",
                              application
                        })
            }
            else {
                  return res.status(409).send({
                        status: false,
                        message: `Application exist with ${name}`
                  })
            }
      }
      catch (err) {
            res.send({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET all applications
const applications = async (req, res) => {
      try {
            await search(req, res)
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET application by Id
const application = async (req, res) => {

      const { id } = req.params

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Application Id Incorrect`
                  })
            }

            const foundApplication = await ApplicationModel.findById(id)

            if (!foundApplication) {
                  return res.status(404).json({
                        status: false,
                        message: `Application not found`,
                  });
            }

            res.status(200).json({
                  status: true,
                  application: foundApplication
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

const search = async (req, res) => {

      let filter = {
            isDeleted: false
      };

      if (req.query.filterBy && req.query.value) {
            filter[req.query.filterBy] = req.query.value;
      }

      const pageSize = +req.query.pageSize || 10;
      const currentPage = +req.query.currentPage || 1;
      const sortBy = req.query.sortBy || '_id';
      const sortOrder = req.query.sortOrder || 'desc'; // asc or desc

      const totalItems = await ApplicationModel.find(filter).countDocuments();
      const items = await ApplicationModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })

      const responseObject = {
            status: true,
            message: "Application fetched Successfully",
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems,
            applications: items
      }

      if (items.length) {
            return res.status(200).json(responseObject);
      }

      else {
            return res.status(401).json({
                  status: false,
                  message: "Nothing found",
                  applications: items
            });
      }
}

// Update application by Id
const update = async (req, res) => {

      const { id } = req.params
      let applicationDetails = {}

      try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `Application Id incorrect`
                  })
            }

            const application = await ApplicationModel.findById(id)
            const applicationExist = Boolean(application)

            if (!applicationExist) {
                  return res.status(401).json({
                        status: false,
                        message: `Application doesn't exist`,
                  });
            }

            else {
                  applicationDetails = {
                        ...req.body,
                        updatedAt: new Date()
                  }
            }

            const updatedApplication = await ApplicationModel.findByIdAndUpdate
                  (
                        id, applicationDetails,
                        {
                              new: true,
                              runValidators: true
                        }
                  )

            res.status(201).json({
                  status: true,
                  message: "Application updated successfully",
                  application: updatedApplication
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

module.exports = {
      create,
      applications,
      application,
      update
}