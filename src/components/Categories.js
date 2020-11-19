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

export class Categories extends Component {
  state = {
    data: [],
  };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });

    this.props.history.push(`/${name}`.toLowerCase());
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu vertical size="massive" style={{ marginTop: "60px" }}>
        <Menu.Item>
          <Header as="h2">Catalog</Header>
          <Menu.Header>Men's clothes</Menu.Header>

          <Menu.Menu>
            {this.props.data.map(
              (item) =>
                item.category_type === "Men" && (
                  <Menu.Item
                    key={item.id}
                    name={item.category}
                    active={activeItem === item.title}
                    onClick={this.handleItemClick}
                  />
                )
            )}
          </Menu.Menu>
        </Menu.Item>

        <Menu.Item>
          <Menu.Header>Women's clothes</Menu.Header>

          <Menu.Menu>
            {this.props.data.map(
              (item) =>
                item.category_type === "Women" && (
                  <Menu.Item
                    key={item.id}
                    name={item.category}
                    active={activeItem === item.title}
                    onClick={this.handleItemClick}
                  />
                )
            )}
          </Menu.Menu>
        </Menu.Item>
      </Menu>
    );
  }
}

class CategorieChoose extends Component {
  state = {
    data: [],
    categoryChoose: "",
  };

  async componentDidMount() {
    this.setState({ loading: true });

    // this.props.fetchCart(); // update the cart count

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
    const categoryChoose = this.props.match.params.categoryChoose;
    const BreadcrumbSection = () => (
      <Breadcrumb>
        <Breadcrumb.Section>
          <Link to="/">
            <Icon link color="black" name="home" />{" "}
          </Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active>
          {categoryChoose.replace(/^./, categoryChoose[0].toUpperCase())}
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
          >
            {categoryChoose.replace(/^./, categoryChoose[0].toUpperCase())}
            {/* xxx.replace(/^./, xxx[0].toUpperCase())   -  capitalize first character */}
          </Header>
          <Divider />
        </Container>
        <Container>
          {/* <GetItemsByCategory data={data} categoryChoose={categoryChoose} /> */}
          <Card.Group>
            {data.map(
              (item) =>
                item.category ===
                  categoryChoose.replace(
                    /^./,
                    categoryChoose[0].toUpperCase()
                  ) && (
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

export default connect(null, mapDispatchToProps)(CategorieChoose);
