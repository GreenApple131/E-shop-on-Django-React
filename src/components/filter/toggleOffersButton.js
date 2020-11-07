import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager/categoryManager"

const ToggleOffersButton = () => {
  const { toggleOffers, showOffers } = useContext(CategoryManagerContext)
  return (
    <div>
      <button
        className={"btn btn-primary"}
        onClick={toggleOffers}
        style={{ marginBottom: `20px` }}
      >
        {showOffers ? "View All" : "View Deals & Offers"}
      </button>
    </div>
  )
}

export default ToggleOffersButton
