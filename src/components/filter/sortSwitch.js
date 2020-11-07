import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager/categoryManager"
import { SORT_TYPES } from "./categoryManager/core/sortReducer"

const SortSwitch = () => {
  const { toggleSort, sortBy } = useContext(CategoryManagerContext)
  return (
    <div style={{ marginBottom: `10px` }}>
      <div>SortedBy: {sortBy}</div>
      <button onClick={() => toggleSort(SORT_TYPES.SORT_BY_RELEVANCE)}>
        Relevance
      </button>
      <button onClick={() => toggleSort(SORT_TYPES.SORT_BY_NEWEST)}>
        Newest
      </button>
      <button onClick={() => toggleSort(SORT_TYPES.SORT_BY_OLDEST)}>
        Oldest
      </button>
      <button onClick={() => toggleSort(SORT_TYPES.SORT_BY_PRICE_ASC)}>
        Sort By Price (ASC)
      </button>
      <button onClick={() => toggleSort(SORT_TYPES.SORT_BY_PRICE_DESC)}>
        Sort By Price (DESC)
      </button>
      <button onClick={() => toggleSort(SORT_TYPES.SORT_BY_TITLE_ASC)}>
        Title (ASC)
      </button>
      <button onClick={() => toggleSort(SORT_TYPES.SORT_BY_TITLE_DESC)}>
        Title (DESC)
      </button>
    </div>
  )
}

export default SortSwitch
