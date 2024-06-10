import { PureComponent } from "react";
import React from "react";
// import { Routes, Route, useLocation } from "react-router-dom";
// import logo from './logo.svg';
import Login from "../Login/Login";
// import log from "loglevel";
import useToken from "./useToken";
import './App.css';
var constants = require("../../services/constants");

class App extends PureComponent {
  constructor(props) {
    super(props);

    const { authActions } = new useToken();
    const tokenType = authActions.getTokenType();

    this.state = {
      authActions: authActions,
      token: authActions.getToken(),
      tokenType: authActions.getTokenType(),
      externalPlay: tokenType === constants.TOKEN_TYPE_EXTERNAL,
      anonymousPlay: tokenType === constants.TOKEN_TYPE_ANONYMOUS,
      directPlayError: null,
      isMounted: false,
    };

    this.setCredentials = this.setCredentials.bind(this);    
  }

  setCredentials = (authInfo, userName, tokenType) => {
    const { authActions } = this.state;
    authActions.setToken(authInfo, tokenType);
    this.setState({
      token: authActions.getToken(),
      tokenType: authActions.getTokenType(),
    });
  };

  render() {

    let {
      token,
      authActions,
    } = this.state;

    if (!token) {
      return (
        <Login setCredentials={this.setCredentials} authActions={authActions} />
      );
    }
  }
}

/*
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}
*/

export default App;
