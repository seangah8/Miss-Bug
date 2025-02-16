import { loggerService } from "../../services/logger.service.js"
import { bugService } from "./bug.service.js"
import { authService } from "../auth/auth.service.js"


export async function getBugs(req, res) {


    const { title, minSeverity, label, sortBy, pageIdx, creatorId } = req.query
    const filterBy = {
        title,
        minSeverity: +minSeverity,
        label,
        sortBy,
        pageIdx: +pageIdx,
        creatorId,
    }



    try {
        const bugs = await bugService.query(filterBy)
    	res.send(bugs)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get bugs`)
    }
}

export async function getBug(req, res) {

    const { bugId } = req.params

    // Cookies Part --------

    let visitedBugs = req.cookies.visitedBugs? JSON.parse(req.cookies.visitedBugs) : []

    if(visitedBugs.length >= 3 && !visitedBugs.includes(bugId)){
        loggerService.info('User Ask For Bug After Limit')
        return res.status(401).send('Wait for a bit')
    }


    visitedBugs = visitedBugs.includes(bugId) 
    ?  JSON.stringify(visitedBugs)
    :  JSON.stringify([...visitedBugs, bugId])
    res.cookie('visitedBugs', visitedBugs, { maxAge: 1000 * 7 })
    console.log('User visited at the following bugs:', visitedBugs)

    //  ----------------

    try {
        const bug = await bugService.getBug(bugId)
        res.send(bug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't get bug`)
    }
}

export async function addBug(req, res) {
    const { title, severity, description, labels } = req.body
    const bugToSave = { title, severity: +severity, description, labels}

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
    	res.send(savedBug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function updateBug(req, res) {
    const {_id, title, severity, description } = req.body
    const bugToSave = {_id, title, severity: +severity, description}

    try {
        const savedBug = await bugService.save(bugToSave, req.loggedinUser)
    	res.send(savedBug)
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't save bug`)
    }
}

export async function removeBug(req, res) {
    const { bugId } = req.params
    try {
        await bugService.remove(bugId, req.loggedinUser)
        res.send('Bug Deleted')
    } catch (err) {
        loggerService.error(err.message)
        res.status(400).send(`Couldn't remove bug`)
    }
}