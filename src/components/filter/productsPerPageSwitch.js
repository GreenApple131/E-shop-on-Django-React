import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager/categoryManager"

const ProductsPerPageSwitch = () => {
  const { changeProductsPerPage, productsPerPage } = useContext(
    CategoryManagerContext
  )
  return (
    <div style={{ marginBottom: `10px` }}>
      <div>Products Per Page {productsPerPage}</div>
      <button onClick={() => changeProductsPerPage(20)}>20</button>
      <button onClick={() => changeProductsPerPage(40)}>40</button>
      <button onClick={() => changeProductsPerPage(60)}>60</button>
    </div>
  )
}

export default ProductsPerPageSwitch
