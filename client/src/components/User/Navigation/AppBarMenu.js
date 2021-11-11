import React from 'react';
import { MenuItem } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import {ListItemText} from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
// import LinkButton from '../LinkButton/LinkButton'
// import CustomIconButton from '../CustomAppBar/CustomIconButton/CustomIconButton';
// import {Routes, ReportTypes} from '../../constants';
// import FontAwesome from 'react-fontawesome';

import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 250;


const styles = theme => ({
    navIconHide: {
        display: 'block',
        [theme.breakpoints.up('xl')]: {
            display: 'none'
        }
    },

    drawerPaper: {
        width: drawerWidth,
        left: 0,
        [theme.breakpoints.up('lg')]: {
            width: drawerWidth
        }
    }
});

const menuItemLinks = [
    {
        text: "All reports",
        path: "/"
    }
    ,
    {
        text: "All reports",
        path: "/"
    },
    {
        text: "All reports",
        path: "/"
    },
    {
        text: "All reports",
        path: "/"
    }
]


class AppBarMenu extends React.Component {

    state = {
        open: false
    }

    handleRequestClose = event => {
        this.setState({ open: false });
    }

    handleDrawerToggle = () => {
        this.setState({ open: !this.state.open });
    }

    getMenuItem(menuPath, text, key) {
        const {path} = this.props

        return <MenuItem
            onClick={this.handleRequestClose}
            selected={menuPath === path}
            key={key}
            to={menuPath}
            component={<div>Button</div>}>
            <ListItemText primary={text}> </ListItemText>
            
        </MenuItem>
    }

    getMenuItems() {
        return menuItemLinks.map((menuItem, key) => this.getMenuItem(menuItem.path, menuItem.text, key))
    }

    render() {
        const { classes } = this.props;

        const drawer = (
            <div>
                <Toolbar className={classes.drawerHeader} >
                    <Typography variant="title" color="inherit">Reports</Typography>
                </Toolbar>
                <List>{this.getMenuItems()}</List>
            </div>
        )

        return (
            <div>
                {/* <CustomIconButton
                    iconName='bars'
                    aria-label="open drawer"
                    onClick={this.handleDrawerToggle}
                    className={classes.navIconHide}> */}
                    <Hidden xlUp>
                        <Drawer
                            variant="temporary"
                            anchor='left'
                            open={this.state.open}
                            classes={{
                                paper: classes.drawerPaper
                            }}
                            onClose={this.handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true
                            }}>
                            {drawer}
                        </Drawer>
                    </Hidden>
                {/* </CustomIconButton>*/}
                <Hidden lgDown> 
                    <Drawer
                        variant="permanent"
                        open
                        classes={{
                            paper: classes.drawerPaper
                        }}>
                        {drawer}
                    </Drawer>
                </Hidden>
            </div>
        )
    }

   
}
export default withStyles(styles)(AppBarMenu);