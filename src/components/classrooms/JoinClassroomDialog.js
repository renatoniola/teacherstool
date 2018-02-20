import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import joinClassroom from '../../actions/classrooms/join'

class JoinClassroomDialog extends PureComponent {
  static propTypes = {
    open: PropTypes.bool,
  }

  joinClassroom = () => {
    const { joinClassroom, classroom } = this.props
    joinClassroom(classroom)
  }

  render() {
    const { currentUser, open, isPlayer } = this.props

    if (isPlayer) return null

    const actions = [
      <Link to="/">
        <FlatButton
          label="No Thanks"
          primary={true} />
      </Link>,
      <RaisedButton
        label="Join Classroom"
        primary={true}
        keyboardFocused={true}
        onClick={this.joinClassroom}
      />,
    ]

    return (
      <div>
        <Dialog
          title="Join Classroom"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.handleClose}
        >
          Hey <strong>{currentUser.name || 'there'}!</strong> Would you like to join this classroom?
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = ({ currentUser, classrooms }, { classroomId }) => {
  const classroom = classrooms.filter((g) => (g._id === classroomId))[0]
  const isPlayer = classroom && classroom.players.filter((p) => (p.userId === currentUser._id)).length > 0

  return {
    classroom,
    currentUser,
    isPlayer,
    open: classroom && !isPlayer && classroom.players.length < 2
  }
}

export default connect(mapStateToProps, { joinClassroom })(JoinClassroomDialog)
