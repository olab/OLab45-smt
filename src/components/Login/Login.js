import React, { useEffect, useState } from "react";
// import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  FormControl,
  Input,
  CircularProgress,
  InputLabel,
  Paper,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { LogError } from "../../utils/Logger";
// import log from "loglevel";
import styles from "./styles";
// import { config } from "../../config";
import { ReactComponent as LogoIcon } from "../../shared/assets/icons/olab4_logo.svg";
import { loginUserAsync } from "../../services/api";
var constants = require("../../services/constants");

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

let MOUNTED = false;

const useStateWrapper = (...args) => {
  const [val, setter] = useState(...args);
  return [val, (...args) => MOUNTED && setter(...args)];
};

const Login = ({ setCredentials, message, authActions, classes }) => {
  useEffect(() => {
    MOUNTED = true;
    return () => (MOUNTED = false);
  }, []);

  const [username, setUserName] = useStateWrapper("");
  const [password, setPassword] = useStateWrapper("");
  const [error, setError] = useStateWrapper({
    show: message != null,
    message: message,
  });
  const [inProgress, setInProgress] = useStateWrapper(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setError({ show: false });
  };

  const showError = (message) => {
    setError({ show: true, message: message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setInProgress(true);

    try {
      const data = await loginUserAsync({
        username,
        password,
      });

      if (!data) {
        throw new Error("Unable to Login");
      }

      if (data.error_code === 401) {
        showError(data.data);
      } else {
        if (data.data.authInfo) {
          setCredentials(data.data, username, constants.TOKEN_TYPE_NATIVE);
        } else {
          throw JSON.stringify(data, null, 2);
        }
      }
    } catch (error) {
      LogError(`loginUser() error: ${JSON.stringify(error, null, 2)})`);
      showError(error.message);
    }

    setInProgress(false);
  };

  return (
    <main className={classes.main}>
      {
        <Paper className={classes.paper}>
          <div
            style={{
              display: "block",
              marginBottom: "-20px",
              fontWeight: "bolder",
              fontSize: "18pt",
              color: "rgb(0, 137, 236)",
            }}
          >
            <center>
              <LogoIcon />
            </center>
            OLab4 SMT
          </div>
          {inProgress && (
            <div>
              <br />
              <CircularProgress color="inherit" />
            </div>
          )}
          {!inProgress && (
            <form onSubmit={handleSubmit}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="username">Username</InputLabel>
                <Input
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </FormControl>
              <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign in
              </Button>
            </form>
          )}
          <Snackbar
            open={error.show}
            autoHideDuration={5000}
            onClose={handleClose}
          >
            <Alert onClose={handleClose} severity="error">
              {error.message}
            </Alert>
          </Snackbar>
        </Paper>
      }
    </main>
  );
};

export default withStyles(styles)(Login);
