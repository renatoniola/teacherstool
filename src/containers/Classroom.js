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
import ColorLabel from '../components/colorlabel/ColorLabel'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
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
  state = {
    open: false,
    studentEvaluations : []

  };
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
  handleOpen = (studentId) => {
    this.setState({open: true});

    const student = this.props.classroom.students.filter((s) => (s._id === studentId))[0]
    this.setState({
      studentName : student.name,
      studentEvaluations : student.evaluations

    })


  };

  handleClose = () => {
    this.setState({open: false});
  };
  saveStudent = () => {
    this.handleClose()
  }

  saveStudentAndNext = () => {
    this.saveStudent()
  }
  render() {
    const { classroom } = this.props

    if (!classroom) return null

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onClick={this.saveStudent}
      />,
      <FlatButton
        label="Save and next"
        primary={true}
        keyboardFocused={true}
        onClick={this.saveStudentAndNext}
      />,
    ];

    const studentEvaluations = this.state.studentEvaluations.map( (item, index ) => {
       return <ColorLabel label={ item.colorCode } day={item.day} key={index}></ColorLabel>
    })
    let deleteStudent = (studentId) => {
       this.props.deleteStudent(classroom._id,studentId)
    }
    // const title = classroom.students.map(p => (p.name || null))
    //   .filter(n => !!n)
    //   .join(' vs ')

    const students = classroom.students.map( (student,index) => {
      console.log(student)
      let colorCode=''
      let day = ''
      //console.log(student.evaluations[student.evaluations.length-1].colorCode)
      if(student.evaluations.length > 0) {
          colorCode = student.evaluations[student.evaluations.length-1].colorCode
          day = student.evaluations[student.evaluations.length-1].day

          return <StudentCard
                  key={index}
                  studentId={student._id}
                  className="student-card"
                  name={student.name}
                  photo={student.photo}
                  lastColorCode={ colorCode }
                  lastDay = {day}
                  deleteStudent={deleteStudent}
                  evalStudent={this.handleOpen}/>
      }
         return <StudentCard
                 key={index}
                 studentId={student._id}
                 className="student-card"
                 name={student.name}
                 photo={student.photo}

                 deleteStudent={deleteStudent}
                 evalStudent={this.handleOpen}/>
    })

    const studentsRates = this.calculateStudentsSRates(classroom.students);




    return (
      <div className="classroom">

          <Dialog
              title={this.state.studentName}
              actions={actions}
              modal={true}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
            >

            { studentEvaluations }

            <TextField
              hintText="Leave a remark"

              floatingLabelText="Remark"
              multiLine={true}
              rows={8}
            />

        </Dialog>

        <h1>Students in class : { classroom.batchNumber }</h1>
        <ColorBar colorArray={studentsRates} />


        <TextField  ref="name" hintText="Student name" floatingLabelText="Student name"/><br/>
        <TextField  ref="photo" hintText="Photo url" floatingLabelText="photo url"/><br/>


        <RaisedButton label="Create Student" onClick={this.createNewStudent.bind(this)}/><br/>


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
