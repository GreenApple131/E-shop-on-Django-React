import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Divider,
  Header,
  Image,
  Icon,
  Item,
  Label,
  Menu,
} from "semantic-ui-react";
import CategoryFilter from "./CategoryFilter";
import { addToCartURL, productListURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";

import "./elements/filterSidebar.css";


class MyApp extends React.Component {

    constructor() {
      super();
      this.state = {
        filterName: "",
        filterCity: "",
        friends: [
          {id: 1, name: "Carl", city: "New York"},
          {id: 2, name: "Anna", city: "New York"},
          {id: 3, name: "Carl", city: "Sydney"}
        ]
      };
    }
    
    changeFilterName = (e) => {
      this.setState({filterName: e.target.value});
    }
    
    changeFilterCity = (e) => {
      this.setState({filterCity: e.target.value});
    }
    
    render() {
      let friends = this.state.friends.slice();
      if(this.state.filterName) {
        friends = friends.filter(item => item.name.toLowerCase() == this.state.filterName.toLowerCase());
      }
      if(this.state.filterCity) {
        friends = friends.filter(item => item.city.toLowerCase() == this.state.filterCity.toLowerCase());
      }
      return(
        <div>
          <label for="name">Name: </label>
          <input id="name" onChange={this.changeFilterName} value={this.state.filterName} />
          <label for="city">City: </label>
          <input id="city" onChange={this.changeFilterCity} value={this.state.filterCity} />
          <ul>
            {friends.map(item => <li key={item.id}>{item.name + " - " + item.city}</li>)}
          </ul>
        </div>
      );
    }
  }



class AllItems extends Component {
  state = {
    data: [],
    categoryChoose: "",
  };

  async componentDidMount() {
    this.setState({ loading: true });

    const res = await axios
      .get(productListURL)
      .then((res) => {
        this.setState({ data: res.data });
      })
      .catch((err) => {
        this.setState({ error: err });
      });
  }

  handleAddToCart = (slug) => {
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.fetchCart(); // update the cart count
      })
      .catch((err) => {
        console.log("Error in handleAddToCart");
      });
  };

  render() {
    const { data } = this.state;
    const BreadcrumbSection = () => (
      <Breadcrumb>
        <Breadcrumb.Section>
          <Link to="/">
            <Icon link color="black" name="home" />{" "}
          </Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active>
          All Items
        </Breadcrumb.Section>
      </Breadcrumb>
    );
    return (
      <React.Fragment>
        {/* categoryChoose={this.props.location.state.searchValue} */}
        <Container style={{ marginTop: "10px" }}>
          <BreadcrumbSection />
          <Header
            style={{
              margin: 10,
              fontFamily: "monospace",
              fontSize: 32,
              marginTop: "30px",
              marginBottom: "10px",
            }}
          > All Items
            {/* xxx.replace(/^./, xxx[0].toUpperCase())   -  capitalize first character */}
          </Header>
          <Divider />
        </Container>
        <MyApp />
        <Container>
          {/* <GetItemsByCategory data={data} categoryChoose={categoryChoose} /> */}
          <Card.Group>
            {data.map(
              (item) =>
                 (
                  <React.Fragment key={item.id}>
                    <Card style={{ width: "220px", height: "auto" }}>
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
                          this.props.history.push(`/products/${item.slug}`)
                        }
                      />
                      <Card.Content>
                        <Item.Header
                          as="a"
                          onClick={() =>
                            this.props.history.push(`/products/${item.slug}`)
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
                  </React.Fragment>
                )
            )}
          </Card.Group>
        </Container>

        <CategoryFilter />
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(AllItems);
