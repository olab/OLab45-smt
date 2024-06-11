// @flow
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { MenuItem, Menu, Button } from '@material-ui/core';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';

class NavigationBar extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      anchorElPermissionsMenu: null,
    };
  }

  render() {

    const { anchorEl, anchorElPermissionsMenu } = this.state;
    const { classes } = this.props;

    // eslint-disable-next-line no-unused-vars
    const processEnv = process.env;    
    return (
      <>
        <Button
          className={classes.link}
          component={Link}
          to={`/users`}
        >
          Users
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          // onClose={this.handleClose}
          // className={classes.mapMenu}
        >
        </Menu>
        <Button
            aria-controls="menu"
            aria-haspopup="true"
            // onClick={this.handleToolsClick}
            // className={classes.button}
          >
            Permissions
            <ExpandMoreIcon />
          </Button>   
          <Menu
            anchorEl={anchorElPermissionsMenu}
            keepMounted
            open={Boolean(anchorElPermissionsMenu)}
            onClose={this.handleClose}
            className={classes.menu}
          >
            <MenuItem
              // onClick={this.handleClickHelp}
              // className={classes.menuItem}
            >
              Groups
            </MenuItem>
            <MenuItem
              // onClick={this.handleClickAbout}
              // className={classes.menuItem}
            >
              Roles
            </MenuItem>
            <MenuItem
              // onClick={this.handleClickAbout}
              // className={classes.menuItem}
            >
              Access
            </MenuItem>            
          </Menu>               
      </>
    );
  }
}

export default NavigationBar;
