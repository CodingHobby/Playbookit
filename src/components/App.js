import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import firebase from 'firebase'
import Spinner from 'react-spinner'

import './styles/App.css'
import './styles/Inputs.css'
import './styles/Auth.css'
import './styles/Error.css'

import Fiddle from './Fiddle'
import Login from './Login'
import Nav from './Nav'
import Playbook from './Playbook'
import Profile from './Profile'
import Register from './Register'


export default class App extends Component {
	// Set the initial state (no user)
	constructor(props) {
			super(props)

			this.state = {
				user: undefined
			}
	}

	// As soon as the component is mounted add an event listener for changes in the auth state and set the component's state to the new user
	componentDidMount() {
    firebase.auth()
			.onAuthStateChanged(user => {
				this.setState({user})
			})
  }

  render() {
		// Grab the user from the state
		const {user} = this.state;
		return (
			user === undefined ?
			<Spinner/> :
			// Return a router, so that we can switch between pages
      <Router>
        <div className="App">
					{/* Navigation with links to different pages */}
          <Nav/>
					{/* Switch is important for pattern-matching in the routes: it will match the first route it finds, so that's why the seem like they're in a weird order */}
					<div className="content">
          <Switch>
            <Route path="/login" component={Login} user={user}/>
            <Route path="/register" component={Register} user={user}/>
            <Route path="/:user/:playbook/:fiddle" component={Fiddle} user={user}/>
            <Route path="/:user/:playbook/" component={Playbook} user={user}/>
            <Route path="/:user" component={Profile} user={user}/>
						{/* Are we logged in? If we are then we want to render our home page, otherwise we want to render the login page */}
            <Route path="/" render={() => (
							user ?
								<Profile owner={user} editable/> :
								<Redirect to="/login"/>
						)}/>
          </Switch>
					</div>
        </div>
      </Router>
    )
  }
}
