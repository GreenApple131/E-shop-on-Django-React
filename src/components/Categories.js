import React, { Component } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Header,
  Image,
  Icon,
  Item,
  Label,
  Loader,
  Menu,
  Segment,
} from "semantic-ui-react";
import { SearchFilterResults } from "./SearchResult";
import { productListURL } from "../constants";

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

export default class CategorieChoose extends Component {
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

  render() {
    const { data } = this.state;
    const categoryChoose = this.props.match.params.categoryChoose;
    return (
      <React.Fragment>
        {/* categoryChoose={this.props.location.state.searchValue} */}
        <Container>
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
          <GetItemsByCategory data={data} categoryChoose={categoryChoose} />
        </Container>
      </React.Fragment>
    );
  }
}

function GetItemsByCategory(props) {
  const history = useHistory();

  const getItems = props.categoryChoose;

  return (
    <Card.Group>
      {props.data.map(
        (item) =>
          item.category ===
            getItems.replace(/^./, getItems[0].toUpperCase()) && (
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
                  onClick={() => history.push(`/products/${item.slug}`)}
                />
                <Card.Content>
                  <Item.Header
                    as="a"
                    onClick={() => history.push(`/products/${item.slug}`)}
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
  );
}
