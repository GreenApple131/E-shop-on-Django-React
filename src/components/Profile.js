import React, { Component } from "react";
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

export default class Profile extends Component {
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

    return (
      <React.Fragment>
        <div className=" grid" style={{ margin: 20 }}>
          <div className="main">
            <Menu vertical>
              <Menu.Item
                name="billing address"
                active={activeItem === "billing address"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="marked items"
                active={activeItem === "marked items"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="shipping history"
                active={activeItem === "shipping history"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="todo management"
                active={activeItem === "todo management"}
                onClick={this.handleItemClick}
              />
              <Menu.Item
                name="products management"
                active={activeItem === "products management"}
                onClick={this.handleItemClick}
              />
            </Menu>
          </div>
          <div className='side'>
            <Header textAlign="center" as='h2' style={{marginLeft: -120}}>Profile</Header>
            <Divider />

            {activeItem === "billing address" ? (
              <p>billing address form</p>
            ) : activeItem === "marked items" ? (
              <p>marked items</p>
            ) : activeItem === "shipping history" ? (
              <p>shipping history</p>
            ) : activeItem === "todo management" ? (
              <CRUDTodo />
            ) : activeItem === "products management" ? (
              <CRUDProduct />
            ) : null}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
