import React, { useContext } from "react"
import { CategoryManagerContext } from "./categoryManager/categoryManager"

const Products = () => {
  const { products } = useContext(CategoryManagerContext)
  const productList =
    products.map((product, index) => {
      return (
        <div key={index} style={{ marginBottom: `20px` }}>
          <div style={{ fontWeight: `600`, fontSize: `20px` }}>
            {product.title}
          </div>
          <div style={{ margin: `5px 0` }}>DATE: {product.date}</div>
          <div style={{ margin: `5px 0` }}>SKU: {product.sku}</div>
          {product.offer ? <div style={{ margin: `5px 0` }}>Offer</div> : null}
          <div style={{ margin: `5px 0` }}>Price: {product.price}</div>
          <div style={{ margin: `5px 0` }}>
            Size:{" "}
            {product.size &&
              product.size.map((size, index) => {
                return (
                  <span key={index} style={{ padding: `0 3px` }}>
                    {size.value}
                  </span>
                )
              })}
          </div>
          <div
            style={{ display: `flex`, alignItems: `center`, margin: `5px 0` }}
          >
            Color:{" "}
            {product.color &&
              product.color.map((color, index) => {
                return (
                  <span
                    key={index}
                    style={{
                      margin: `0 5px`,
                      width: `20px`,
                      height: `20px`,
                      display: `inline-block`,
                      backgroundColor: color.value,
                    }}
                  />
                )
              })}
          </div>
        </div>
      )
    }) || null
  return (
    <div
      style={{
        display: `grid`,
        gridTemplateColumns: `1fr 1fr`,
        gridGap: `20px 50px`,
      }}
    >
      {productList}
    </div>
  )
}

export default Products
