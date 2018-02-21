import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'

import FlatButton from 'material-ui/FlatButton';
import './student-card.css'

class StudentCard extends PureComponent {

  static propTypes = {
    studentId:PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    lastColorCode: PropTypes.string,
    name: PropTypes.string.isRequired,
  }

  deleteStudent(){

    this.props.deleteStudent(this.props.studentId)
  }
  render() {

    return (
      <Card className="student-card">
        <CardHeader
          title={ this.props.name }
        />
        <CardMedia>
          <img src={ this.props.photo } />
        </CardMedia>
        <CardText>
          { this.props.lastColorCode }
        </CardText>

        <CardActions>

          <IconButton onClick={this.deleteStudent.bind(this)}><DeleteIcon /></IconButton>
        </CardActions>
      </Card>
    )
  }
}

export default StudentCard
