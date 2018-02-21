// src/containers/Lobby.js
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import fetchClassrooms from '../actions/classrooms/fetch'
import createClassroom from '../actions/classrooms/create'
import { connect as subscribeToWebsocket } from '../actions/websocket'
//import CreateClassroomButton from '../components/classrooms/CreateClassroomButton'
//import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Card, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
//import Paper from 'material-ui/Paper'
//import Menu from 'material-ui/Menu'
//import MenuItem from 'material-ui/MenuItem'
//import WatchClassroomIcon from 'material-ui/svg-icons/image/remove-red-eye'
//import JoinClassroomIcon from 'material-ui/svg-icons/social/person-add'

//import WaitingIcon from 'material-ui/svg-icons/image/timelapse'
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
  createClassroom (){

    let batchNumber = this.refs.batchNumber.input.value
    let startDate = this.refs.startDate.state.date
    let endDate = this.refs.endDate.state.date

    this.props.createClassroom({
       batchNumber ,
       startDate,
       endDate
    })
  }
  formatDate(date){

    var newDate = new Date(date);

    return new Intl.DateTimeFormat('en-GB').format(newDate)
  }

  renderClassroom = (classroom, index) => {
    //let ActionIcon = this.isJoinable(classroom) ? JoinClassroomIcon : WatchClassroomIcon
  //  if (this.isStudent(classroom)) ActionIcon = this.isPlayable(classroom) ? PlayClassroomIcon : WaitingIcon

    //if (!classroom.students[0].name) { this.props.fetchStudents(classroom) }
    //this.props.fetchStudents(classroom)
    // const title = classroom.students.map(p => (p.name || null))
    //   .filter(n => !!n)
    //   .join(' vs ')

    return (



        <Card className="classroom-card" key={index} onClick={this.goToClassroom(classroom._id)} >

          <CardTitle title={ classroom.batchNumber } />
          <CardText>
            { `Number of students : ${classroom.students.length}`}
            </CardText>
            <CardText>
            { `start date : ${this.formatDate(classroom.startDate)}` }
            </CardText>
            <CardText>
            { `end date : ${this.formatDate(classroom.endDate)}` }
            </CardText>

        </Card>

    )
  }

  render() {
    return (

      <div className="Lobby">

        <TextField  id="batch-number" ref="batchNumber" hintText="Classroom Name" floatingLabelText="Classroom name"/>
        <DatePicker id="start-date" ref="startDate" hintText="Start Date" floatingLabelText="Start Date"/>
        <DatePicker id="end-date" ref="endDate" hintText="End Date" floatingLabelText="End Date"/>

        <RaisedButton label="Create new Classroom" onClick={this.createClassroom.bind(this)}/>
        <h1>Classes : </h1>
        <div className="classes-container">
          {this.props.classrooms.map(this.renderClassroom)}
          </div>
        </div>
    )
  }
}

const mapStateToProps = ({ classrooms, currentUser }) => ({ classrooms, currentUser })

export default connect(mapStateToProps, { fetchClassrooms, subscribeToWebsocket, createClassroom,push })(Lobby)
