import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { fetchOneClassroom } from '../actions/classrooms/fetch'
import  createStudent  from '../actions/students/create'
import  createEvaluation  from '../actions/students/newEvaluation'
import  deleteStudent  from '../actions/students/delete'
//import doTurn from '../actions/classrooms/doTurn'
import { connect as subscribeToWebsocket } from '../actions/websocket'
//import JoinClassroomDialog from '../components/classrooms/JoinClassroomDialog'
//import TurnButton from '../components/classrooms/TurnButton'
import StudentCard from '../components/students/studentCard'
import ColorLabel from '../components/colorlabel/ColorLabel'
import { RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import CircleIcon from 'material-ui/svg-icons/av/fiber-manual-record'
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle'
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
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
    studentEvaluations : [],
    remarkError : '',
    colorCodeError : '',
    emptyDayError : '',
    filterValue : 'all'

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
      studentEvaluations : student.evaluations,
      studentPhoto : student.photo,
      studentId : studentId

    })


  };

  handleClose = () => {
    this.setState({open: false , colorCodeError : '', remarkError : ''});
  };

  saveStudent = () => {

    const remark = this.refs.remark.getValue()
    const day = this.refs.evalDate.refs.input.props.value
    const colorCode = this.refs.evaluation.state.selected

    if( colorCode === '' ){
      console.log(colorCode)

       this.setState({
          colorCodeError : 'color label is mandatory'
       })

    }else{
           if ( day === ''){
            this.setState({

              emptyDayError : 'date for evaluation is mandatory',
              colorCodeError :''
            })
          }else{
            this.setState({

              emptyDayError : ''

            })
            if ( (colorCode === 'red' || colorCode === 'yellow')  && remark === ''){
              this.setState({
                 remarkError : 'Remark is mandatory if label is red or yellow'
              })
            }else{

            let newEvaluation = {
               colorCode ,
               remark ,
               day
            }

             this.props.createEvaluation(this.props.classroom._id,this.state.studentId,newEvaluation)
             this.handleClose()

          }

        }
      }
}
  saveStudentAndNext = () => {

    this.saveStudent()

  }
  filterChange(e){
    this.setState({
      filterValue : e.target.value
    })
  }
  randomStudent(){

    let studentsFilterd = this.props.classroom.students.filter(student => student.evaluations.length > 0);

    let reds = studentsFilterd.filter(student => student.evaluations[student.evaluations.length-1].colorCode === 'red');
    let yellows = studentsFilterd.filter(student => student.evaluations[student.evaluations.length-1].colorCode === 'yellow');
    let greens = studentsFilterd.filter(student => student.evaluations[student.evaluations.length-1].colorCode === 'green');

    console.log(reds,yellows,greens)

    let randomNumber = (Math.floor(Math.random() * 100) + 1)

    if( randomNumber > 0 && randomNumber <= 49){
       console.log(reds[Math.floor(Math.random() * reds.length-1) + 1], 'reds')
    }else if ( randomNumber > 49 && randomNumber <= 67){
       console.log(randomNumber , 'greens')
    }else{
       console.log(randomNumber , 'yellow')
    }
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

          if( this.state.filterValue === 'all' || this.state.filterValue === colorCode )
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
         if( this.state.filterValue === 'all' ){
         return <StudentCard
                 key={index}
                 studentId={student._id}
                 className="student-card"
                 name={student.name}
                 photo={student.photo}

                 deleteStudent={deleteStudent}
                 evalStudent={this.handleOpen}/>
               }
    })

    const studentsRates = this.calculateStudentsSRates(classroom.students);




    return (
      <div className="classroom">
         <RaisedButton label="Ask a Question" onClick={this.randomStudent.bind(this)}/><br/>
          <Dialog
              title={this.state.studentName}
              actions={actions}
              modal={true}
              open={this.state.open}
              onRequestClose={this.handleClose}
              autoScrollBodyContent={true}
            >

            <div id="container" className="flexChild columnParent">

               <div id="columnChild18109" className="flexChild rowParent selected">
                   <div id="rowChild26638" className="flexChild"><img src={this.state.studentPhoto} /></div>

                   <div id="rowChild46232" className="flexChild">{ studentEvaluations }
                   <DatePicker  errorText={this.state.emptyDayError} ref="evalDate" hintText="Evaluatiion Date" floatingLabelText="Evaluation Date"/>
                   </div>
               </div>

               <div id="columnChild77698" className="flexChild rowParent">
                 <div id="rowChild67036" className="flexChild">
                 <RadioButtonGroup  ref="evaluation" name="evaluation" >

                     <RadioButton
                       value="green"

                       checkedIcon={<CheckCircleIcon style={{fill: 'green'}} />}
                       uncheckedIcon={<CircleIcon style={{fill: 'green'}} />}

                     />
                     <RadioButton
                       value="yellow"

                       checkedIcon={<CheckCircleIcon style={{fill: '#f5c531'}} />}
                       uncheckedIcon={<CircleIcon style={{fill: '#f5c531'}} />}

                     />
                     <RadioButton
                       value="red"

                       checkedIcon={<CheckCircleIcon style={{fill: 'red'}} />}
                       uncheckedIcon={<CircleIcon style={{fill: 'red'}} />}

                     />
                   </RadioButtonGroup>
                   <span className="error">{this.state.colorCodeError}</span>
                 </div>

                 <div id="rowChild94145" className="flexChild">
                 <TextField ref="remark"
                   hintText="Leave a remark"

                   floatingLabelText="Remark"
                   multiLine={true}
                   errorText={this.state.remarkError}
                   rows={8}
                 />
                 </div>
             </div>
             </div>

       </Dialog>

        <h1>Students in class : { classroom.batchNumber }</h1>
        <ColorBar colorArray={studentsRates} />


        <TextField  ref="name" hintText="Student name" floatingLabelText="Student name"/><br/>
        <TextField  ref="photo" hintText="Photo url" floatingLabelText="photo url"/><br/>


        <RaisedButton label="Create Student" onClick={this.createNewStudent.bind(this)}/><br/>



        <RadioButtonGroup onChange={this.filterChange.bind(this)} defaultSelected="all" className="filter-color" ref="filterColor" name="filterColor" >

            <RadioButton className="radio"
              value="all"
              label="show all"

              checkedIcon={<CheckCircleIcon style={{fill: 'grey'}} />}
              uncheckedIcon={<CircleIcon style={{fill: 'grey'}} />}

            />
            <RadioButton className="radio"
              value="green"
              label="show greens"
              checkedIcon={<CheckCircleIcon style={{fill: 'green'}} />}
              uncheckedIcon={<CircleIcon style={{fill: 'green'}} />}

            />
            <RadioButton className="radio"
              value="yellow"
              label="show yellows"
              checkedIcon={<CheckCircleIcon style={{fill: '#f5c531'}} />}
              uncheckedIcon={<CircleIcon style={{fill: '#f5c531'}} />}


            />
            <RadioButton className="radio"
              value="red"
              label="show reds"
              checkedIcon={<CheckCircleIcon style={{fill: 'red'}} />}
              uncheckedIcon={<CircleIcon style={{fill: 'red'}} />}

            />
          </RadioButtonGroup>
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
  deleteStudent,
  createEvaluation
  //fetchStudents,
  //doTurn
})(Classroom)
