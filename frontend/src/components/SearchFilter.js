import React, { Component, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Input,
  Icon,
  Item,
  Label,
  List,
} from "semantic-ui-react";
import { productListURL } from "../constants";
import FilterResults from "react-filter-search";

class SearchFilterBar extends Component {
  state = {
    data: [],
    value: "",
  };

  async componentDidMount() {
    this.setState({ loading: true });

    // this.props.fetchCart(); // update the cart count

    const res = await axios
      .get(productListURL)
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  }
  handleChange = (event) => {
    const { value } = event.target;
    this.setState({ value });
  };
  render() {
    const { data, value } = this.state;
    return (
      <div>
        <Input
          size="mini"
          fluid
          onChange={this.handleChange}
          placeholder="Search what do you want..."
          value={value}
          style={{
            name: "search",
            circular: true,
            link: true,
            marginTop: "7px",
            // marginBottom: "-10px",
            // marginRight: "10px",
            width: "auto",
          }}
        />
        <Divider />

        <SearchFilterResults  />
      </div>
    );
  }
}

export class SearchFilterResults extends Component {

  render() {
  const { data, value } = this.props;
  return (
    <FilterResults
      value={value}
      data={data}
      renderResults={(results) => (
        <Grid
          doubling
          columns={5}
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          {results.map((item) => {
            return (
              <Grid.Column key={item.id}>
                <Card style={{ width: "300px", height: "420px" }}>
                  <Image
                    src={item.image}
                    style={{
                      width: "220px",
                      height: "257px",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "noRepeat",
                    }}
                    wrapped
                    ui={true}
                    as="a"
                    onClick={() =>
                      this.props.history.push(`/products/${item.id}`)
                    }
                  />
                  <Card.Content>
                    <Item.Header
                      as="a"
                      onClick={() =>
                        this.props.history.push(`/products/${item.id}`)
                      }
                    >
                      {item.title}
                    </Item.Header>
                    <Card.Meta>
                      {item.category} {"  "}
                      {item.discount_price && ( // always show, not just when there is a discount
                        <Label color="violet">discount</Label>
                      )}
                    </Card.Meta>
                    <Card.Description>Rating...</Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <React.Fragment>
                      {item.discount_price && (
                        <Header
                          floated="left"
                          color="violet"
                          style={{ marginTop: "10px" }}
                        >
                          <small>
                            <strike>
                              <span>${item.price}</span>
                            </strike>
                          </small>{" "}
                          ${item.discount_price}
                        </Header>
                      )}
                      {!item.discount_price && (
                        <Header
                          color="black"
                          floated="left"
                          size="medium"
                          style={{ marginTop: "7px" }}
                        >
                          ${item.price}
                        </Header>
                      )}
                      <Button
                        animated="vertical"
                        color="black"
                        floated="right"
                        onClick={() => this.handleAddToCart(item.slug)}
                      >
                        <Button.Content hidden>Buy</Button.Content>
                        <Button.Content visible>
                          <Icon name="cart plus" />
                        </Button.Content>
                      </Button>
                    </React.Fragment>
                  </Card.Content>
                </Card>
              </Grid.Column>
            );
          })}
        </Grid>
      )}
    />
  );
}
}

export default SearchFilterBar;
