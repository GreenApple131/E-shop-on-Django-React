import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Menu,
} from "semantic-ui-react";

import CRUDTodo from "./ItemCRUD/CRUDTodo.js";
import CRUDProduct from "./ItemCRUD/CRUDProduct.js";

import "./elements/example.css";
import "./common/index.css";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItem: "billing address",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0); // start from top page
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    const { isAuthenticated } = this.props;
    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }


    return (
      <React.Fragment>
        <div className=" grid" style={{ margin: 20 }}>
          <div className="main">
            <Menu pointing secondary vertical>
              <Menu.Item
                name="Billing address"
                active={activeItem === "Billing address"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Marked items"
                active={activeItem === "Marked items"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Shipping history"
                active={activeItem === "Shipping history"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Todo management"
                active={activeItem === "Todo management"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="Products management"
                active={activeItem === "Products management"}
                onClick={this.handleItemClick}
              />
            </Menu>
          </div>
          <div className='side'>
            <Header textAlign="center" as='h2' style={{margin: 0}}>{activeItem}</Header>
            <Divider />

            {activeItem === "Billing address" ? (
              <p>billing address form</p>
            ) : activeItem === "Marked items" ? (
              <p>marked items</p>
            ) : activeItem === "Shipping history" ? (
              <p>shipping history</p>
            ) : activeItem === "Todo management" ? (
              <CRUDTodo />
            ) : activeItem === "Products management" ? (
              <CRUDProduct />
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Profile);