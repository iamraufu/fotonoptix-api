const express = require('express');
const app = express();
var cors = require('cors');
const { connectDB } = require('./database/connection');
const UserRoutes = require('./routes/UserRoutes')
const CategoryRoutes = require('./routes/CategoryRoutes')
const SubcategoryRoutes = require('./routes/SubcategoryRoutes')
const ApplicationRoutes = require('./routes/ApplicationRoutes')

require('dotenv').config()

app.use(cors(), express.json({ limit: '50mb' }))

const port = process.env.PORT || 8000;

app.use((req, res, next) => {
      console.log(req.path, req.method);
      next();
});

app.get('/health', (req, res) => {
      res.status(200).json({
            status: true,
            message: "OK"
      })
})

app.use("/api/user", UserRoutes) // User API
app.use("/api/category", CategoryRoutes) // Category API
app.use("/api/subcategory", SubcategoryRoutes) // Subcategory API
app.use("/api/application", ApplicationRoutes) // Application API

connectDB()

app.listen(port, () => {
      console.log(`MongoDB connected and backend is running on port ${port}!`);
});