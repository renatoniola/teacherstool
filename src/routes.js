// src/routes.js
import React, { Component } from 'react'
import { Route } from 'react-router-dom'

import {
  Lobby,
  Classroom,
  SignIn,
//  SignUp
} from './containers'

export default class Routes extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={Lobby} />
        <Route path="/classroom/:classroomId" component={Classroom} />
        <Route path="/sign-in" component={SignIn} />

      </div>
    )
  }
}
