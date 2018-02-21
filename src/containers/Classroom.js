import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOneClassroom } from '../actions/classrooms/fetch'
import  createStudent  from '../actions/students/create'
import  deleteStudent  from '../actions/students/delete'
//import doTurn from '../actions/classrooms/doTurn'
import { connect as subscribeToWebsocket } from '../actions/websocket'
//import JoinClassroomDialog from '../components/classrooms/JoinClassroomDialog'
//import TurnButton from '../components/classrooms/TurnButton'
import StudentCard from '../components/students/studentCard'
import TextField from 'material-ui/TextField';

import RaisedButton from 'material-ui/RaisedButton';
//import FlatButton from 'material-ui/FlatButton';
import ColorBar from '../components/colorBar/ColorBar'
import './classroom.css'

const studentShape = PropTypes.shape({
  name: PropTypes.string


})



class Classroom extends PureComponent {
  static propTypes = {
    fetchOneClassroom: PropTypes.func.isRequired,
    //fetchStudents: PropTypes.func.isRequired,
    subscribeToWebsocket: PropTypes.func.isRequired,
    classroom: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      //teacherId: PropTypes.string.isRequired,

      students: PropTypes.arrayOf(studentShape).isRequired,

      updatedAt: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    })

  }

  componentWillMount() {

    const { classroom, fetchOneClassroom, subscribeToWebsocket } = this.props
    const { classroomId } = this.props.match.params

    if (!classroom) { fetchOneClassroom(classroomId) }
    subscribeToWebsocket()
  }



  // componentWillReceiveProps(nextProps) {
  //   const { classroom } = nextProps
  //
  //    if (classroom && !classroom.students[0].name) {
  //      this.props.fetchStudents(classroom)
  //    }
  // }

  // doTurnWithClassroomId = (weapon) => () => {
  //   return this.props.doTurn(weapon, this.props.classroom._id)
  // }

  createNewStudent(){
    let name = this.refs.name.input.value
    let photo = this.refs.photo.input.value


    this.props.createStudent({
      name,
      photo,
      evaluations : []
    },this.props.classroom._id)
  }

  calculateStudentsSRates(students){
    let ratesArray = [0,0,0]

    for(let i=0;i < students.length ; i++){

      if( students[i].evaluations.length > 0){
        let lastColorCode = students[i].evaluations[students[i].evaluations.length-1].colorCode

         if( lastColorCode === 'green'){
            ratesArray[0]++;
         }
         if( lastColorCode === 'yellow'){
            ratesArray[1]++;
         }
         if( lastColorCode === 'red'){
            ratesArray[2]++;
         }
     }

    }
    return ratesArray
  }
  render() {
    const { classroom } = this.props

    if (!classroom) return null

    let deleteStudent = (studentId) => {
       this.props.deleteStudent(classroom._id,studentId)
    }
    // const title = classroom.students.map(p => (p.name || null))
    //   .filter(n => !!n)
    //   .join(' vs ')

    const students = classroom.students.map( (student,index) => {
      console.log(student)
      let colorCode=''
      //console.log(student.evaluations[student.evaluations.length-1].colorCode)
      if(student.evaluations.length > 0) {
          colorCode = student.evaluations[student.evaluations.length-1].colorCode
          return <StudentCard key={index} studentId={student._id} className="student-card" name={student.name} photo={student.photo} lastColorCode={ colorCode } deleteStudent={deleteStudent}/>
      }
         return <StudentCard key={index} studentId={student._id} className="student-card" name={student.name} photo={student.photo} deleteStudent={deleteStudent} />
    })
    const studentsRates = this.calculateStudentsSRates(classroom.students);



    return (
      <div className="classroom">
        <h1>Students in class : { classroom.batchNumber }</h1>
        <ColorBar colorArray={studentsRates} />


        <TextField  ref="name" hintText="Student name" floatingLabelText="Student name"/><br/>
        <TextField  ref="photo" hintText="Photo url" floatingLabelText="photo url"/><br/>


        <RaisedButton label="Save Student" onClick={this.createNewStudent.bind(this)}/><br/>


        {/*<p>{title}</p> */}
        <div className="students-container">{ students }</div>



      </div>
    )
  }
}

const mapStateToProps = ({ currentUser, classrooms }, { match }) => {
  const classroom = classrooms.filter((g) => (g._id === match.params.classroomId))[0]
  // green , yellow , red


//  const currentStudent = classroom && classroom.students.filter((p) => (p.userId === currentUser._id))[0]
  return {

    classroom

  }
}

export default connect(mapStateToProps, {
  subscribeToWebsocket,
  fetchOneClassroom,
  createStudent,
  deleteStudent
  //fetchStudents,
  //doTurn
})(Classroom)
