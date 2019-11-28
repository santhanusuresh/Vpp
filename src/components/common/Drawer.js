import React, { Component } from 'react';
import { ListItem, List,Drawer } from '@material-ui/core';

class Drawer extends Component {
    state = { 
        open:false
     }
    render() {

        const {open}=this.state;

        return (
            <Drawer anchor="right" open={open}>
                <List>
                    <ListItem>
                        List
                    </ListItem>
                </List>
            </Drawer>
        );
    }
}

export default Drawer;