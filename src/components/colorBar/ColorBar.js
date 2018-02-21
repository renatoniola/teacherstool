import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './color-bar.css'

class ColorBar extends PureComponent {
  static propTypes = {
    colorArray: PropTypes.arrayOf(Number).isRequired

  }

  calculatePercentage(rate , total){
    console.log(rate , total)
    return `${Math.floor(rate/total*100)}%`
  }

  render() {

    const { colorArray } = this.props

    const total = colorArray.reduce( (accumulator, currentValue) => { return accumulator + currentValue })

    return (
      <div className="bar-container">
        <div className="colorbar green-bar" style={{ width : this.calculatePercentage(colorArray[0],total) }}></div>
        <div className="colorbar yellow-bar" style={{ width : this.calculatePercentage(colorArray[1],total) }}></div>
        <div className="colorbar red-bar" style={{ width : this.calculatePercentage(colorArray[2],total) }}></div>
      </div>
    )
  }

}

export default ColorBar
