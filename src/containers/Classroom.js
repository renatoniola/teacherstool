import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOneClassroom, fetchStudents } from '../actions/classrooms/fetch'
//import doTurn from '../actions/classrooms/doTurn'
import { connect as subscribeToWebsocket } from '../actions/websocket'
import JoinClassroomDialog from '../components/classrooms/JoinClassroomDialog'
import TurnButton from '../components/classrooms/TurnButton'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
 import './classroom.css'

const studentShape = PropTypes.shape({
  userId: PropTypes.string.isRequired,
  symbol: PropTypes.string,
  name: PropTypes.string
})

const StudentCard = (props) => (
  <Card className="student-card">
    <CardHeader
      title={ props.name }
      subtitle="Subtitle"
      avatar={ props.photo }
    />

    <CardText>
      { props.lastColorCode }
    </CardText>
    
  </Card>
);

class Classroom extends PureComponent {
  static propTypes = {
    fetchOneClassroom: PropTypes.func.isRequired,
    fetchStudents: PropTypes.func.isRequired,
    subscribeToWebsocket: PropTypes.func.isRequired,
    classroom: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,

      students: PropTypes.arrayOf(studentShape).isRequired,

      updatedAt: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
    }),
    currentStudent: studentShape,

  }

  componentWillMount() {

    const { classroom, fetchOneClassroom, subscribeToWebsocket } = this.props
    const { classroomId } = this.props.match.params

    if (!classroom) { fetchOneClassroom(classroomId) }
    subscribeToWebsocket()
  }



  componentWillReceiveProps(nextProps) {
    const { classroom } = nextProps

    // if (classroom && !classroom.students[0].name) {
    //   this.props.fetchStudents(classroom)
    // }
  }

  // doTurnWithClassroomId = (weapon) => () => {
  //   return this.props.doTurn(weapon, this.props.classroom._id)
  // }

  render() {
    const { classroom } = this.props

    if (!classroom) return null

    // const title = classroom.students.map(p => (p.name || null))
    //   .filter(n => !!n)
    //   .join(' vs ')

    const students = classroom.students.map( student => {
      return <StudentCard className="student-card" name={student.name} photo={student.photo} lastColorCode={ student.evaluations[student.evaluations.length-1].colorCode}/>
    })
    return (
      <div className="classroom">
        <h1>Students in class : { classroom.batchNumber }</h1>
        {/*<p>{title}</p> */}
        <div className="students-container">{ students }</div>



      </div>
    )
  }
}

const mapStateToProps = ({ currentUser, classrooms }, { match }) => {
  const classroom = classrooms.filter((g) => (g._id === match.params.classroomId))[0]
//  const currentStudent = classroom && classroom.students.filter((p) => (p.userId === currentUser._id))[0]
  return {

    classroom

  }
}

export default connect(mapStateToProps, {
  subscribeToWebsocket,
  fetchOneClassroom,
  //fetchStudents,
  //doTurn
})(Classroom)
