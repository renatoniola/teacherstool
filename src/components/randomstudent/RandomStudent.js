import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Dialog from 'material-ui/Dialog';

import RaisedButton from 'material-ui/RaisedButton';


import './random-student.css'

class RandomStudent extends PureComponent {

  static propTypes = {

  }
  state = {
    name : '',
    photo : '',
    open:false
  }
  genRandomNumber(length){
     return Math.floor(Math.random() * length-1) + 1
  }
  randomStudent(reds,greens,yellows){
    let name = ''
    let photo= ''
    let empty = false

    let randomNumber = this.genRandomNumber(101)

    if( randomNumber > 0 && randomNumber <= 49){
        if( reds.length > 0) {
        let randStudReds = this.genRandomNumber(reds.length)
         name = reds[randStudReds].name
         photo = reds[randStudReds].photo
       }else{
         empty = true
       }

    }else if ( randomNumber > 49 && randomNumber <= 67){
      if( greens.length > 0) {
        let randStudGreens = this.genRandomNumber(greens.length)
        name  = greens[randStudGreens].name
        photo  = greens[randStudGreens].photo

      }else{
        empty = true
      }
    }else{
      if( yellows.length > 0) {
        let randStudYellows = this.genRandomNumber(yellows.length)
        name  = yellows[randStudYellows].name
        photo  = yellows[randStudYellows].photo
      }else{
        empty = true
      }
    }

    if(empty) {
      this.randomStudent(reds,greens,yellows)
    }else{
      this.setState({
        name ,
        photo,
        open: true
      })
    }


  }

  handleOpen = (studentId) => {
    let studentsFilterd = this.props.classroom.students.filter(student => student.evaluations.length > 0);

    let reds = studentsFilterd.filter(student => student.evaluations[student.evaluations.length-1].colorCode === 'red');
    let yellows = studentsFilterd.filter(student => student.evaluations[student.evaluations.length-1].colorCode === 'yellow');
    let greens = studentsFilterd.filter(student => student.evaluations[student.evaluations.length-1].colorCode === 'green');

    this.randomStudent(reds,greens,yellows)


  };

  handleClose = () => {
    this.setState({open: false , name: '', photo : '' });
  };

  render() {
    const actions = [
      <RaisedButton
        label="OK"
        primary={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <div>
       <Dialog
          title={this.state.name}
          actions={actions}
          modal={true}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <img src={this.state.photo}/>
        </Dialog>
        <RaisedButton label="Ask a Question" onClick={this.handleOpen.bind(this)}/><br/>
      </div>
    )
  }
}

export default RandomStudent
