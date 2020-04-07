import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom'
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap';
import Auth from './Auth';
import { RequestConfig } from './Config';

import Home from './Home';
import Profile from './Profile';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import JogMain from './JogMain';
import JogManager from './JogManager';
import ChangePassword from './ChangePassword';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import UserManager from './UserManager';

import './App.css';
import './static/css/bootstrap.min.css';

class App extends Auth {

  constructor(props) {
    super(props);
    this.state = {
      user: {},
      RequestConfig: RequestConfig,
      authenticated: false
    };
  }

  componentWillMount() {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      this.authUser(authToken);
    }
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar inverse collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/">Jogotal</a>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              {
                this.state.authenticated ?
                  <div>
                    <Nav>
                      <LinkContainer to="/jogs/">
                       <NavItem eventKey={1}>Jogs</NavItem>
                      </LinkContainer>
                    </Nav>
                    {
                      this.isUserManager() ?
                      <Nav>
                        <LinkContainer to="/users/">
                         <NavItem eventKey={2}>Manage Users</NavItem>
                        </LinkContainer>
                      </Nav>
                      : ''
                    }
                    {
                      this.state.user && this.state.user.is_staff ?
                      <Nav>
                        <LinkContainer to="/jogsadmin/">
                         <NavItem eventKey={2}>Manage Jogs</NavItem>
                        </LinkContainer>
                      </Nav>: ''
                    }
                  </div>
                  :
                  <Nav pullRight>
                    <LinkContainer to="/login/">
                     <NavItem eventKey={1}>Login</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/signup/">
                     <NavItem eventKey={2}>Sign Up</NavItem>
                    </LinkContainer>
                  </Nav>
              }
              {
                this.state.authenticated ?
                <Nav pullRight>
                  <NavDropdown eventKey="1" title={this.state.user && this.state.user.username ? this.state.user.username : 'Loading..'} id="nav-dropdown">
                    <LinkContainer to="/profile/">
                      <MenuItem eventKey="1.1">Edit Profile</MenuItem>
                    </LinkContainer>
                    <LinkContainer to="/chgpwd/">
                      <MenuItem eventKey="1.1">Change Password</MenuItem>
                    </LinkContainer>
                    <MenuItem eventKey="1.2" onClick={this.removeAuth.bind(this)}>Log Out</MenuItem>
                  </NavDropdown>
                </Nav>: ''
              }
            </Navbar.Collapse>
          </Navbar>
          <Route exact path="/" render={(props) =>
            this.state.authenticated ?
              <Redirect to="/jogs"/>
            :
              <Home
                authenticate={this.authenticate.bind(this)}
                {...props}/>
          }/>
          {
            this.state.authenticated ?
              <div>
                <Route path="/jogs/" render={ (props) =>
                  <JogMain
                    RequestConfig={this.state.RequestConfig}
                    user={this.state.user}
                    {...props}/>
                }/>
                <Route path="/profile/" render={ (props) =>
                  <Profile
                    updateUser={this.updateUser.bind(this)}
                    RequestConfig={this.state.RequestConfig}
                    user={this.state.user}
                    {...props}/>
                }/>
                <Route path="/chgpwd/" render={ (props) =>
                  <ChangePassword
                    RequestConfig={this.state.RequestConfig}
                    user={this.state.user}
                    {...props}/>
                }/>
              </div>:
              <div>
                <Route path="/login/" render={ (props) =>
                  <LoginForm
                    authenticate={this.authenticate.bind(this)}
                    {...props}/>
                }/>
                <Route path="/signup/" render={ (props) =>
                  <SignUpForm
                    authenticate={this.authenticate.bind(this)}
                    {...props}/>
                }/>
                <Route path="/forgotpwd/" render={ (props) =>
                  <ForgotPassword
                    RequestConfig={this.state.RequestConfig}
                    {...props}/>
                }/>
                <Route path="/resetpwd/:uid/:token" render={ (props) =>
                  <ResetPassword
                    RequestConfig={this.state.RequestConfig}
                    {...props}
                  />
                }/>

              </div>
          }
          {
            this.state.authenticated && this.isUserManager() ?
              <Route path="/users/" render={ (props) =>
                <UserManager
                  RequestConfig={this.state.RequestConfig}
                  user={this.state.user}
                  {...props}/>
              }/>
              : ''
          }
          {
            this.state.authenticated && this.state.user.is_staff ?
              <Route path="/jogsadmin/" render={ (props) =>
                <JogManager
                  RequestConfig={this.state.RequestConfig}
                  user={this.state.user}
                  {...props}/>
              }/>
              : ''
          }
        </div>
      </Router>
    );
  }
}

export default App;
