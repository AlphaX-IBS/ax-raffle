import React, { PureComponent } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavbarBrand
} from "reactstrap";
import { NavLink, withRouter } from "react-router-dom";
import TopBar from "./../TopBar/index";

class RaffleHeader extends PureComponent {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  goHome = () => {
    const { history } = this.props;
    history.push("/home");
  };

  render() {
    return (
      <header className="wow fadeIn" data-wow-duration="1.5s">
        <Navbar light expand="md">
          <NavbarToggler onClick={this.toggle} />
          <NavbarBrand onClick={this.goHome}>
            <img src="img/logo.png" alt="" />
          </NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mr-auto" navbar>
              <NavItem>
                <NavLink to="/home" className="nav-link">
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/play" className="nav-link">
                  Play Online
                </NavLink>
              </NavItem>
              {/* <NavItem>
                <NavLink to="/contact" className="nav-link">
                  Contact
                </NavLink>
              </NavItem> */}
              {/* <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  Options
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>Option 1</DropdownItem>
                  <DropdownItem>Option 2</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem>Reset</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown> */}
            </Nav>
          </Collapse>
          <TopBar /> {/* Topbar will be used for notification area*/}
        </Navbar>
      </header>
    );
  }
}

export default withRouter(RaffleHeader);
