import React from 'react'

type Props = {
  handleSearch: (term: string) => void;
  handleLocation: (location: string) => void;
  handleMinSalary: (minSalary: number) => void;
  handleMaxSalary: (maxSalary: number) => void;
}

const Filters = (props: Props) => {
  return (
    <div className="p-4 rounded-md bg-neutral-900 mb-4">
      <div className="flex flex-col mb-2">
        <label htmlFor="searchTerm">Search...</label>
        <input type="input" id="searchTerm" placeholder="Machine learning" className="p-2 bg-neutral-800 rounded-sm"/>
      </div>

      <div className="flex w-full gap-2">
        <div className="w-full">
          <label htmlFor="location">Location</label>
          <input type="input" id="location" placeholder="Manchester" className="p-2 w-full bg-neutral-800 rounded-sm"/>
        </div>

        <div>
          <label htmlFor="minSalary">Minimum Salary</label>
          <input type="number" id="minSalary" className="p-2 bg-neutral-800 rounded-sm"/>
        </div>

        <div>
          <label htmlFor="maxSalary">Maximum Salary</label>
          <input type="number" id="maxSalary" className="p-2 bg-neutral-800 rounded-sm"/>
        </div>
      </div>
    </div>
  )
}

export default Filters
