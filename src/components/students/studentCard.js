import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import './student-card.css'

class StudentCard extends PureComponent {
  static propTypes = {
    photo: PropTypes.string.isRequired,
    lastColorCode: PropTypes.string,
    name: PropTypes.string.isRequired,
  }
  render() {

    return (
      <Card className="student-card">
        <CardHeader
          title={ this.props.name }
          avatar={ this.props.photo }
        />

        <CardText>
          { this.props.lastColorCode }
        </CardText>

      </Card>
    )
  }
}

export default StudentCard
