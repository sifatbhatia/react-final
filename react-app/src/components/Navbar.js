import React from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
} from './NavbarElements';

const Navbar = () => {
    return (
        <>
            <Nav>
                <Bars />

                <NavMenu>
                <NavLink to='/' activeStyle>
                        Home
                    </NavLink>
                    <NavLink to='/todos' activeStyle>
                        Todo
                    </NavLink>
                
                
                </NavMenu>
            
            </Nav>
        </>
    );
};

export default Navbar;
