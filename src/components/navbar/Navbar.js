import React, { Component } from 'react';
import {AppBar, Toolbar, Typography} from '@material-ui/core';

class Navbar extends Component {
    state = {  }
    render() {
        return (
            <div style={{backgroundColor:'black'}}>
            <AppBar>
                <Toolbar>
                    <Typography>
                        Three lines
                    </Typography>
                </Toolbar>
            </AppBar>
            </div>
        );
    }
}

export default Navbar;