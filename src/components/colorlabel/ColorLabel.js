import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
//import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton'
import CircleIcon from 'material-ui/svg-icons/av/fiber-manual-record'
import { formatDate } from '../../utils/UtilsLib'

import './color-label.css'

class ColorLabel extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired

  }

  render() {

    const { label ,day } = this.props
    //const { formatDate } = UtilsLib

    let color = ''

    switch(label.toLowerCase()) {
        case 'green':
            color = 'green'
            break;
        case 'yellow':
            color = 'yellow'
            break;
        case 'red':
            color = 'red'
            break;
        default:
            color = ''
    }

    return (



        <IconButton iconStyle={{fill: color,width:32,height:32}}
            tooltip={formatDate(day)}
            tooltipPosition="bottom-center">
            <CircleIcon  />
        </IconButton>

    )
  }

}

export default ColorLabel
