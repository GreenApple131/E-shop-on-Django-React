import React, { Component } from "react";
import { Divider, Grid, Header, Menu } from "semantic-ui-react";

import FetchProducts from './FetchProducts.js';

import "./elements/example.css";

export default class Profile extends Component {
  constructor(props){
    super(props);
    this.state = {
      activeItem: "billing address",
      createNewItem: {
        title: '',
        description: '',
        // slug: '',
      }
    }
    
  }


  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <React.Fragment>
        <Grid container columns={2} divided>
          <Grid.Row>
            <Grid.Column width={6}>
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
                  name="add new product"
                  active={activeItem === "add new product"}
                  onClick={this.handleItemClick}
                />
              </Menu>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header>Profile</Header>
              <Divider />
              {activeItem === "billing address" ? (
                <p>billing address form</p>
              ) : activeItem === "marked items" ? (
                <p>marked items</p>
              ) : activeItem === "add new product" ? (
                <React.Fragment>
                  <Header>
                    Add new item
                  </Header>
                <FetchProducts />
                </React.Fragment>
              ) : (
                <p>shipping history</p>
              )}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}



class AddNewItem extends Component {

  render() {

    return(
      <>
      Item
      </>
    );
  }
}