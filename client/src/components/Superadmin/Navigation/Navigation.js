import React from 'react';
import classes from './Navigation.module.css';
import { NavLink, useHistory } from 'react-router-dom';
import {
    Grow,
    Popper,
    Paper,
    MenuList,
    MenuItem,
    Button,
    ClickAwayListener
} from "@material-ui/core";
import DrawerLab from '../Drawer/Drawer';

const Navigation = (props) => {

    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const history = useHistory()

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    }

    return (
        <div className={classes.wrapper}>
            <div className={classes.multi_color_border}></div>
            <div className={classes.top_nav}>
                <DrawerLab />
                <div>
                    <Button
                        ref={anchorRef}
                        aria-controls={open ? "menu-list-grow" : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        <span className={classes.right}>Superadmin</span>
                    </Button>
                    <Popper
                        open={open}
                        anchorEl={anchorRef.current}
                        role={1}
                        transition
                        disablePortal
                    >
                        {({ TransitionProps, placement }) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === "bottom" ? "center top" : "center bottom",
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                        <MenuList
                                            className={classes.menu}
                                            autoFocusItem={open}
                                            id="menu-list-grow"
                                        >
                                            <MenuItem onClick={() => {
                                                history.push('/superadmin/curBets')
                                                handleToggle()
                                            }}>
                                               <i className="fab fa-stack-exchange"></i>&nbsp;Current Bets
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                history.push('/superadmin/matchHistory')
                                                handleToggle()
                                            }}>
                                               <i className="fas fa-history"></i>&nbsp;Match history
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                history.push('/superadmin/changePassword')
                                                handleToggle()
                                            }}>
                                                <i className="fas fa-key"></i>&nbsp;Change Password
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                localStorage.removeItem('a_token')
                                                localStorage.removeItem('Super_IP')
                                                history.push('/superadmin/login')
                                            }}>
                                                <i className="fas fa-sign-out-alt"></i>&nbsp;Logout
                                            </MenuItem>
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </div>
            </div>
            <div className={classes.bottom_nav}>
                <ul>
                    <li><NavLink to={props.match.url + '/message'} activeClassName={classes.active}>Message</NavLink></li>
                    <li><NavLink to={props.match.url + '/registerAdmin'} activeClassName={classes.active}>Create</NavLink></li>
                    <li><NavLink to={props.match.url + '/series'} activeClassName={classes.active}>Series</NavLink></li>
                    <li><NavLink to={props.match.url + '/matches'} activeClassName={classes.active}>Matches</NavLink></li>
                    <li><NavLink to={props.match.url} exact activeClassName={classes.active}>Settle</NavLink></li>
                </ul>
            </div>
        </div>
    );
}
export default Navigation