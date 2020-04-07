import React, { Component } from 'react';
import logo from './static/img/logo.png';
import LoginForm from './LoginForm';

class Home extends Component {
    render() {
      return (
        <div className="App">
          <img src={logo} alt="Logo"/>;
          <div style={{marginTop: 10}}>
            <LoginForm
              {...this.props}/>
          </div>
        </div>
      )
    }
}

export default Home;
