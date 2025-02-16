import { useEffect, useState } from "react"
import { userService } from "../services/user"
import { useNavigate } from "react-router"
import { bugService } from "../services/bug"
import { BugList } from "../cmps/BugList"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service"

export function Profile(){

    const navigate = useNavigate()
    const [loggedinUser, setLoggedinUser] = useState(null)
    const [userBugs, setUserBugs] = useState(null)
    

    useEffect(()=>{
        loadUser()
        loadBugs()
    },[])

    async function loadUser(){
        if(userService.getLoggedinUser()){
            const user = await userService.getById(userService.getLoggedinUser()._id)
            setLoggedinUser(user)
        }
        else navigate('/')
    }

    async function loadBugs(){
        const filter = {title: '', 
            minSeverity: 0, 
            label: 'All', 
            sortBy: 'createdAt',
            pageIdx: undefined,
            creatorId: userService.getLoggedinUser()._id
        }

        console.log(filter)
          
        const bugs = await bugService.query(filter)
        setUserBugs(bugs)
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            console.log('Deleted Succesfully!')
            setUserBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
            showSuccessMsg('Bug removed')
        } catch (err) {
            console.log('Error from onRemoveBug ->', err)
            showErrorMsg('Cannot remove bug')
        }
    }


    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        try {

            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setUserBugs(prevBugs => prevBugs.map((currBug) =>
            currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }
    




    if(!loggedinUser) return <h2>Need To Login To See Your Profile</h2>
    if(!userBugs) return <h2>Loading...</h2>
    
    return(
        <section className="profile">
            <h2>{`Profile of ${loggedinUser.fullname}`}</h2>
            <br/>
            <h3>{`Username: ${loggedinUser.username}`}</h3>
            <h3>{`Full Name: ${loggedinUser.fullname}`}</h3>
            <br/>
            <h3>Your Bugs: </h3>
            <BugList bugs={userBugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        </section>
    )
}