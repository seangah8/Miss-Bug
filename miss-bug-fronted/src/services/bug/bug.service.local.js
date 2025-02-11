import { storageService } from '../async-storage.service.js'

const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    getById,
    save,
    remove,
}

async function query(filter = {}) {
    // Normal Filtering
    const PAGE_SIZE = 3
    let bugsToDisplay = await storageService.query(STORAGE_KEY)

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

    return bugsToDisplay
}

async function getById(bugId) {
    return storageService.get(STORAGE_KEY, bugId)
}

async function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}


async function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}