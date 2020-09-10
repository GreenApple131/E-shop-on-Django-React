import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import {
  Button,
  Card,
  Container,
  Grid,
  Icon,
  Image,
  Header,
  Item,
  Label,
  Loader,
  Menu,
  Message,
  Divider,
  Segment,
} from "semantic-ui-react";

class Profile extends Component {
  state = { activeItem: "billing address" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <React.Fragment container>
        <Grid container columns={2} divided>
          <Grid.Row>
            <Grid.Column width={6}>
              <Menu inverted pointing vertical>
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
              </Menu>
            </Grid.Column>
            <Grid.Column width={10}>
              <Header>Profile</Header>
              <Divider />
              {activeItem === "billing address" ? (
                <p>billing address form</p>
              ) : activeItem === "marked items" ? (
                <p>marked items</p>
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

export default Profile;
