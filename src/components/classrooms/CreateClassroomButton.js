// src/components/classrooms/CreateClassroomButton.js
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'
//import StarIcon from 'material-ui/svg-icons/action/favorite'
import createClassroom from '../../actions/classrooms/create'

class CreateClassroomButton extends PureComponent {
  static propTypes = {
    signedIn: PropTypes.bool,
    batchNumber : PropTypes.string.isRequired,
    startDate : PropTypes.instanceOf(Date).isRequired,
    endDate : PropTypes.instanceOf(Date).isRequired
  }

  render() {
    if (!this.props.signedIn) return null

    return (
      <div className="CreateClassroomButton">
        <RaisedButton
          label="Create Classroom"
          primary={true}
          onClick={this.props.createClassroom({ "title " : "yooo"})}
           />
      </div>
    )
  }
}

const mapStateToProps = ({ currentUser }) => ({
  signedIn: !!currentUser && !!currentUser._id,
})

export default connect(mapStateToProps, { createClassroom })(CreateClassroomButton)
