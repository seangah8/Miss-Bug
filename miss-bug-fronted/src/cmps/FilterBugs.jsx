import { useState } from 'react'

export function FilterBugs({ filterBy, onSetFilterBy }) {

    const [filterToEdit, setFilterToEdit] = useState({...filterBy})


    function onSubmitFilter(event) {
        event.preventDefault()
        onSetFilterBy(filterToEdit)
    }

    function handleChange({ target }) {
        let { value, name: field } = target
        switch (target.type) {
            case 'number': 
                value = +value
                break
        }
        setFilterToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
    }

    const labels = ["critical", "need-CR", "dev-branch"]
    const sorts = ["createdAt", 'title', 'severity']
    const {title, minSeverity, label, sortBy} = filterToEdit

    return (
        <section className="filter-by">
            <h3>Filter Bugs</h3>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Title: </label>
                <input type="txt" 
                    value={title} 
                    id="title" 
                    name="title" 
                    onChange={handleChange}/>

                <label htmlFor="minSeverity">Min Severity: </label>
                <input type="number" 
                    value={minSeverity} 
                    id="minSeverity" 
                    name="minSeverity" 
                    onChange={handleChange}/>


                <label htmlFor="label">Label: </label>
                <select id="label" value={label} name="label" onChange={handleChange}>
                    <option value={'All'}>All</option>
                    {
                        labels.map(label=><option key={label} value={label}>
                            {label}
                        </option>)
                    }
                </select>

                <label htmlFor="sortBy">Sort By: </label>
                <select id="sortBy" value={sortBy} name="sortBy" onChange={handleChange}>
                    {
                        sorts.map(sort=><option key={sort} value={sort}>
                            {sort}
                        </option>)
                    }
                </select>

                <button>Submit</button>
            </form>

        </section>
    )

}