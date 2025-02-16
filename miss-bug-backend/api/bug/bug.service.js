import { makeId, readJsonFile, writeJsonFile } from "../../services/util.service.js"
import { loggerService } from "../../services/logger.service.js"

export const bugService = {
    query,
    getBug,
    remove,
    save,
}

const bugs = readJsonFile('./data/bugs.json')
const PAGE_SIZE = 3


async function query(filter){
    let bugsToDisplay = bugs

    // Normal Filtering

    if (filter.title) {
        const regExp = new RegExp(filter.title, 'i')
        bugsToDisplay = bugsToDisplay.filter(bug => regExp.test(bug.title))
    }

    if(filter.minSeverity){
        bugsToDisplay = bugsToDisplay.filter(bug => bug.severity >= filter.minSeverity)
    }

    if(filter.label && filter.label !== 'All'){
        bugsToDisplay = bugsToDisplay.filter(bug => 
            bug.labels.some(label => label === filter.label))
    }

    // Sortings

    if(filter.sortBy){
        switch (filter.sortBy){

            case "title":
                bugsToDisplay.sort((a, b) => 
                    a.title.localeCompare(b.title))
                break

            case "severity":
                bugsToDisplay.sort((a, b) => 
                    a.severity - b.severity)
                break

            case "createdAt":
                bugsToDisplay.sort((a, b)=>
                    a.createdAt - b.createdAt)
                break
            
            default:
                loggerService.error(`Sorting type invalid - ${filter.sortBy}`)
        }
    }

    // Page Filter

    if (Number.isInteger(filter.pageIdx)) {
        const startIdx = filter.pageIdx * PAGE_SIZE
        bugsToDisplay = bugsToDisplay.slice(startIdx, startIdx + PAGE_SIZE)
    }



    // Profile filter
    if(filter.creatorId){
        bugsToDisplay = bugsToDisplay.filter(bug=> 
            bug.creator._id === filter.creatorId)
    }

    try{
        return bugsToDisplay
    } catch(err){
        loggerService.error(`Couldn't get bugs ${bugToSave._id || bugToSave.title} Because: ${err}`)
        throw err
    }
}

async function getBug(bugId){
    try{
        const bug = bugs.find(bug=>bug._id === bugId)
        if(!bug) throw `Bad bug id ${bugId}`
        return bug
    } catch(err){
        loggerService.error(`Couldn't get bug ${bugToSave._id || bugToSave.title} Because: ${err}`)
        throw err
    }
}

async function remove(bugId, loggedinUser){
    try{

        const idx = bugs.findIndex(bug=>bug._id===bugId)
        if(idx === -1) throw `Bad bug id ${bugId}`

        if (!loggedinUser.isAdmin && bugs[idx]?.creator?._id !== loggedinUser._id) 
            throw 'Only creator can remove bug'
        bugs.splice(idx,1)

        await writeJsonFile('./data/bugs.json', bugs)
        return
    } catch(err){
        loggerService.error(`Couldn't remove bug ${bugToSave._id || bugToSave.title} Because: ${err}`)
        throw err
    }
}

async function save(bugToSave, loggedinUser) { 
    try {
        
        if (bugToSave._id) {
            const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (idx === -1) throw `Bad bug id ${bugToSave._id}`
            if (!loggedinUser.isAdmin && bugs[idx]?.creator?._id !== loggedinUser._id) 
                throw 'Only creator can update bug'
            bugs[idx] = { ...bugs[idx], ...bugToSave }
        } 

        else {
            bugToSave._id = makeId()
            bugToSave.createdAt = Date.now()
            bugToSave.creator = {_id: loggedinUser._id, fullname: loggedinUser.fullname}
            bugs.push(bugToSave)
        }

        await writeJsonFile('./data/bugs.json', bugs)
        return bugToSave
    } catch (err) {
        loggerService.error(`Couldn't save bug ${bugToSave._id || bugToSave.title} Because: ${err}`)
        throw err
    }
}
