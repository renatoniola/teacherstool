// src/containers/Lobby.js
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import fetchClassrooms, { fetchStudents } from '../actions/classrooms/fetch'
import { connect as subscribeToWebsocket } from '../actions/websocket'
import CreateClassroomButton from '../components/classrooms/CreateClassroomButton'
import Paper from 'material-ui/Paper'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import WatchClassroomIcon from 'material-ui/svg-icons/image/remove-red-eye'
import JoinClassroomIcon from 'material-ui/svg-icons/social/person-add'

import WaitingIcon from 'material-ui/svg-icons/image/timelapse'
import './Lobby.css'

class Lobby extends PureComponent {
  componentWillMount() {
    this.props.fetchClassrooms()
    this.props.subscribeToWebsocket()
  }

  goToClassroom = classroomId => event => this.props.push(`/classroom/${classroomId}`)

  // isJoinable(classroom) {
  //   return classroom.students.length < 2 &&
  //     !this.isStudent(classroom)
  // }

  // isStudent(classroom) {
  //   if (!this.props.currentUser) { return false }
  //   return classroom.students.map(p => p.userId)
  //     .indexOf(this.props.currentUser._id) >= 0
  // }

  // isPlayable(classroom) {
  //   return this.isStudent(classroom) && classroom.students.length === 2
  // }

  renderClassroom = (classroom, index) => {
    //let ActionIcon = this.isJoinable(classroom) ? JoinClassroomIcon : WatchClassroomIcon
  //  if (this.isStudent(classroom)) ActionIcon = this.isPlayable(classroom) ? PlayClassroomIcon : WaitingIcon

    //if (!classroom.students[0].name) { this.props.fetchStudents(classroom) }
    //this.props.fetchStudents(classroom)
    // const title = classroom.students.map(p => (p.name || null))
    //   .filter(n => !!n)
    //   .join(' vs ')

    return (
      <MenuItem
        key={index}
        onClick={this.goToClassroom(classroom._id)}
        students={classroom.students}
        primaryText={ `${classroom.batchNumber} (${classroom.students.length})`} />
    )
  }

  render() {
    return (
      <div className="Lobby">
        <h1>Classes : </h1>
        <CreateClassroomButton />
        <Paper className="paper">
          <Menu>
            {this.props.classrooms.map(this.renderClassroom)}
          </Menu>
        </Paper>
      </div>
    )
  }
}

const mapStateToProps = ({ classrooms, currentUser }) => ({ classrooms, currentUser })

export default connect(mapStateToProps, { fetchClassrooms, subscribeToWebsocket, fetchStudents, push })(Lobby)
