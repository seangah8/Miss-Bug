import { bugService } from '../services/bug'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { useState } from 'react'
import { useEffect } from 'react'
import { FilterBugs } from '../cmps/FilterBugs.jsx'
import { userService } from '../services/user/user.service.js'


export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState({title: '', 
    minSeverity: 0, 
    label: 'All', 
    sortBy: 'createdAt',
    pageIdx: 0,
    creatorId: null
  })

  useEffect(() => {
    loadBugs()
  }, [filterBy])

  async function loadBugs() {
    const bugs = await bugService.query(filterBy)
    setBugs(bugs)
  }

  function onSetFilterBy(newFilterBy){
    setFilterBy(newFilterBy)
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Succesfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Error from onRemoveBug ->', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
      description: prompt('Bug description?'),
    }
    const labels = () => {
      const allowedLabels = ["critical", "need-CR", "dev-branch"]
      const labels = []
      
      while (true) {
        let label = prompt(`Label ${labels.length + 1} (Allowed: ${allowedLabels.join(", ")}):`)
        
        if (label === null || label === "") break
        
        if (!allowedLabels.includes(label)) {
          alert("Invalid label! Please enter one of: " + allowedLabels.join(", "))

        } else {
          if(!labels.includes(label))
            labels.push(label)
        }
      }
      return labels
    }
    bug.labels = labels()

    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      loadBugs()
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
      loadBugs()
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  return (
    <main className="main-layout">
      <h3>Bugs App</h3>
      <main>
        <FilterBugs filterBy={filterBy} onSetFilterBy={onSetFilterBy}/>
        {userService.getLoggedinUser() && <button onClick={onAddBug}>Add Bug ⛐</button>}
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
        <section className='page-picker'>
          <button disabled={filterBy.pageIdx <= 0}
          onClick={()=>onSetFilterBy(prev=>
            {return{...prev, pageIdx: prev.pageIdx-1}})}>{'<'}</button>
          <p>{`Page: ${filterBy.pageIdx}`}</p>
          <button 
          onClick={()=>onSetFilterBy(prev=>
            {return{...prev, pageIdx: prev.pageIdx+1}})}>{'>'}</button>
        </section>
      </main>
    </main>
  )
}
