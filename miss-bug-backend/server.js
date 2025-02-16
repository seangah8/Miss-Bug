import express from 'express'
import cors from 'cors'
import { loggerService } from './services/logger.service.js'

import { bugRoutes } from './api/bug/bug.routs.js'
import { userRoutes } from './api/user/user.routs.js'
import { authRoutes } from './api/auth/auth.routs.js'

import cookieParser from 'cookie-parser'


const app = express()

// Cors - connect front
const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}


//* App Configuration
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


//* Routes
app.use('/api/bug', bugRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)




// Open Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
	loggerService.info('Up and running on ' + `http://localhost:${PORT}`)
})

