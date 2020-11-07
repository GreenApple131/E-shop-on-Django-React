import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager/categoryManager"

const ClearFiltersButton = () => {
  const { resetActiveFilters, isResetFiltersActive } = useContext(
    CategoryManagerContext
  )
  return (
    <div>
      {isResetFiltersActive() ? (
        <button
          className={"btn btn-danger"}
          onClick={resetActiveFilters}
          style={{ marginBottom: `20px` }}
        >
          Clear Filters
        </button>
      ) : null}
    </div>
  )
}

export default ClearFiltersButton
