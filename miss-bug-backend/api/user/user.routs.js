import express from 'express'
import { addUser, getUser, getUsers, removeUser, updateUser } from './user.controller.js';
import { log } from '../../middlewares/log.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.get('/:userId', log, getUser)
router.delete('/:userId', log, removeUser)
router.post('/', log, addUser)
router.put('/:userId', log, updateUser)

export const userRoutes = router