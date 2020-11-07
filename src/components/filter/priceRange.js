import React, { useContext, useState } from "react"
import { Slider } from "@material-ui/core"
import { CategoryManagerContext } from "./categoryManager/categoryManager"

import styles from "./priceRange.module.css"

const PriceRange = () => {
  const { setPriceRange, priceRange, initialPriceRange } = useContext(
    CategoryManagerContext
  )
  const [range, setRange] = useState([
    initialPriceRange[0],
    initialPriceRange[1],
  ])

  const handleChangeCommitted = (event, priceRange) => {
    console.log("end drag")
    let min = priceRange[0] || 0
    let max = priceRange[1] || 0
    setPriceRange(min, max)
  }

  const handleChange = (event, priceRange) => {
    setRange(priceRange)
  }

  return (
    <div>
      Price Range
      <div>
        <div>From: {range[0]}</div>
        <div>To: {range[1]}</div>
      </div>
      <Slider
        onChangeCommitted={handleChangeCommitted}
        value={range}
        // value={priceRange}
        min={initialPriceRange[0]}
        max={initialPriceRange[1]}
        onChange={handleChange}
        valueLabelDisplay="off"
        aria-labelledby="range-slider"
        // getAriaValueText={this.valuetext}
        // valueLabelFormat={this.valuetext}
        classes={{
          root: styles.root,
          track: styles.track,
          thumb: styles.thumb,
          valueLabel: styles.valueLabel,
        }}
      />
    </div>
  )
}

export default PriceRange
