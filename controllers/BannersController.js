const BannerModel = require('../models/BannersModel')

const createBanner = async (req, res) => {
      try {

            const { link } = req.body

            const isAlreadyUploaded = Boolean(await BannerModel.findOne({ link }))

            if (isAlreadyUploaded) {
                  return res.status(409).send({
                        status: false,
                        message: `Image already exist with ${link}`
                  })
            }

            const banner = await BannerModel.create(req.body)

            return res.status(201).send(
                  {
                        status: true,
                        message: "Banner created successfully!",
                        banner
                  })
      }
      catch (err) {
            res.send({
                  status: false,
                  message: `${err}`
            })
      }
}

const getBanners = async (req, res) => {
      try {
            await search(req, res)
      }
      catch (err) {
            res.send({
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

      const totalItems = await BannerModel.find(filter).countDocuments();
      const items = await BannerModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })
            .lean()

      if (!items.length) {
            return res.status(404).json({
                  status: false,
                  message: "Nothing found",
                  banners: items
            });
      }

      const responseObject = {
            status: true,
            message: "Banners fetched Successfully",
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems,
            banners: items
      }

      if (items.length) {
            return res.status(200).json(responseObject);
      }
}

module.exports = {
      createBanner,
      getBanners
}