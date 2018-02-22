import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton'
import DeleteIcon from 'material-ui/svg-icons/action/delete'
import AssignmentIcon from 'material-ui/svg-icons/action/assignment'
import ColorLabel from '../colorlabel/ColorLabel'
import FlatButton from 'material-ui/FlatButton';
import './student-card.css'

class StudentCard extends PureComponent {

  static propTypes = {
    studentId:PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    lastColorCode: PropTypes.string,
    name: PropTypes.string.isRequired,
    evalStudent : PropTypes.func.isRequired
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
          { this.props.lastColorCode ? <ColorLabel label={ this.props.lastColorCode } day={this.props.lastDay}></ColorLabel> : '' }
        </CardText>

        <CardActions>

          <IconButton tooltip='delete student' iconStyle={{fill: '#f96e64',width:32,height:32}} onClick={this.deleteStudent.bind(this)}><DeleteIcon /></IconButton>
          <IconButton tooltip='see evalutions' iconStyle={{fill: '#f5c531',width:32,height:32}} onClick={this.props.evalStudent.bind(this,this.props.studentId)}><AssignmentIcon /></IconButton>
        </CardActions>
      </Card>
    )
  }
}

export default StudentCard
