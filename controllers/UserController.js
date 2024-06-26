const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const UserModel = require('../models/UserModel');
const mongoose = require("mongoose");

// Register a new user
const register = async (req, res) => {
      try {
            const { email } = req.body
            const userExist = Boolean(await UserModel.findOne({ email: email.trim() }))

            if (!userExist) {
                  const salt = await bcrypt.genSalt(10);
                  const passwordHash = await bcrypt.hash(req.body.password, salt);

                  const user = await UserModel.create(
                        {
                              ...req.body,
                              password: passwordHash
                        }
                  );

                  return res.status(201).send(
                        {
                              status: true,
                              message: "User created successfully!",
                              token: jwt.sign({
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                              }, process.env.JWT),
                              user
                        })
            }
            else {
                  return res.status(409).send({
                        status: false,
                        message: `User exist with ${email}`
                  })
            }
      }
      catch (err) {
            res.send({
                  status: false,
                  message: `Error in registration : ${err}`
            })
      }
}

// User Login
const login = async (req, res) => {
      try {
            const { email, password } = req.body
            const user = await UserModel.findOne({ email: email.trim() })
            const userWithoutPassword = await UserModel.findOne({ email: email.trim() }).select(" -password")
            const userExist = Boolean(user)

            if (!userExist) {
                  return res.status(401).json({
                        status: false,
                        message: `User doesn't exist`
                  })
            }

            const isPasswordValid = await bcrypt.compare(password, user.password)

            if (!user || !isPasswordValid) {
                  return res.status(401).json({
                        status: false,
                        message: "Invalid email or password"
                  })
            }

            const token = jwt.sign(
                  {
                        email: user.email,
                        name: user.name,
                        role: user.role
                  },
                  process.env.JWT,
                  {
                        expiresIn: '365d'
                  });

            res.status(200).json({
                  status: true,
                  message: "User logged in successfully!",
                  token: `Bearer ${token}`,
                  user: userWithoutPassword
            });
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// GET all users
const users = async (req, res) => {
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

// GET user by Id
const user = async (req, res) => {

      const { id } = req.params

      try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `User Id Incorrect`
                  })
            }

            const foundUser = await UserModel.findById(id).select(" -password")

            if (!foundUser) {
                  return res.status(404).json({
                        status: false,
                        message: `User not found`,
                  });
            }

            res.status(200).json({
                  status: true,
                  user: foundUser
            })
      }
      catch (err) {
            res.status(500).json({
                  status: false,
                  message: `${err}`
            })
      }
}

// Update user by Id
const update = async (req, res) => {

      const { id } = req.params
      const { password, newPassword } = req.body
      let userDetails = {}

      try {

            if (!mongoose.Types.ObjectId.isValid(id)) {
                  return res.status(404).json({
                        status: false,
                        message: `User Id incorrect`
                  })
            }

            const user = await UserModel.findById(id)
            const userExist = Boolean(user)

            if (!userExist) {
                  return res.status(401).json({
                        status: false,
                        message: `User doesn't exist`,
                  });
            }

            if (!password && newPassword) {
                  return res.status(401).json({
                        status: false,
                        message: "Please enter old password"
                  });
            }

            if (password && !newPassword) {
                  return res.status(401).json({
                        status: false,
                        message: `Please enter new password`
                  });

            }

            if (password && newPassword) {
                  const isPasswordValid = await bcrypt.compare(password, user.password)

                  if (!isPasswordValid) {
                        return res.status(401).json({
                              status: false,
                              message: "Incorrect password"
                        });
                  }

                  const salt = await bcrypt.genSalt(10);
                  const passwordHash = await bcrypt.hash(newPassword, salt);

                  userDetails = {
                        ...req.body,
                        password: passwordHash,
                        updatedAt: new Date()
                  }
            }

            else {
                  userDetails = {
                        ...req.body,
                        updatedAt: new Date()
                  }
            }

            let updatedUser = await UserModel.findByIdAndUpdate
                  (
                        id, userDetails,
                        {
                              new: true,
                              runValidators: true
                        }
                  ).select(" -password")

            res.status(201).json({
                  status: true,
                  message: "User updated successfully",
                  user: updatedUser
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

      const totalItems = await UserModel.find(filter).countDocuments();
      const items = await UserModel.find(filter)
            .skip((pageSize * (currentPage - 1)))
            .limit(pageSize)
            .sort({ [sortBy]: sortOrder })
            .select(" -password")

      const responseObject = {
            status: true,
            message: "User fetched Successfully",
            totalPages: Math.ceil(totalItems / pageSize),
            totalItems,
            users: items
      }

      if (items.length) {
            return res.status(200).json(responseObject);
      }

      else {
            return res.status(401).json({
                  status: false,
                  message: "Nothing found",
                  users: items
            });
      }
}

module.exports = {
      register,
      login,
      users,
      user,
      update
}