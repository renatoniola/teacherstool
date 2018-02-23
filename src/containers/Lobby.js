import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import fetchClassrooms from '../actions/classrooms/fetch'
import createClassroom from '../actions/classrooms/create'
import { connect as subscribeToWebsocket } from '../actions/websocket'
import {Card, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';

import './Lobby.css'

class Lobby extends PureComponent {
  componentWillMount() {
    this.props.fetchClassrooms()
    this.props.subscribeToWebsocket()
  }

  goToClassroom = classroomId => event => this.props.push(`/classroom/${classroomId}`)

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

    let newDate = new Date(date);

    return new Intl.DateTimeFormat('en-GB').format(newDate)
  }

  renderClassroom = (classroom, index) => {

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

        <TextField  ref="batchNumber" hintText="Classroom Name" floatingLabelText="Classroom name"/>
        <DatePicker ref="startDate" hintText="Start Date" floatingLabelText="Start Date"/>
        <DatePicker ref="endDate" hintText="End Date" floatingLabelText="End Date"/>

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
