import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './color-label.css'

class ColorLabel extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired

  }

  render() {

    const { label } = this.props

    let labelStyle = ''

    switch(label.toLowerCase()) {
        case 'green':
            labelStyle = 'label green'
            break;
        case 'yellow':
            labelStyle = 'label yellow'
            break;
        case 'red':
            labelStyle = 'label red'
            break;
        default:
            labelStyle = ''
    }

    return (
      <div>
        <div className={labelStyle}></div>
      </div>
    )
  }

}

export default ColorLabel
