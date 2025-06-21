import express from "express"
import cors from 'cors'
import { connectDB } from "./config/db.js"
import userRouter from "./routes/userRoute.js"
import foodRouter from "./routes/foodRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import settingsRouter from "./routes/settingsRoutes.js"
import promoRouter from "./routes/promoRoutes.js"
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// app config
const app = express()
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json())
app.use(cors())

// db connection
connectDB()

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/food", foodRouter)
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/settings", settingsRouter)
app.use("/api/promo", promoRouter)

app.get("/", (req, res) => {
    res.send("API Working")
});

app.listen(port,'0.0.0.0', () => console.log(`Server started on http://localhost:${port}`))
