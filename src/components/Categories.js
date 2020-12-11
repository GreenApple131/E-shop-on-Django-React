import React, { Component, useState, useEffect } from "react";
import { connect } from "react-redux";
import { Link, useHistory, useParams } from "react-router-dom";
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
import { addToCartURL, productListCategoryURL } from "../constants";
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

function CategorieChoose()  {
  const history = useHistory();

  let { categoryChoose } = useParams();   // get the category

  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const chosenCategory = categoryChoose.replace(/^./, categoryChoose[0].toUpperCase());

  useEffect(() => {
    axios
      .get(productListCategoryURL(chosenCategory))
      .then((res) => {
        setData(res.data.results);
      })
      .catch((err) => {
        setError(err);
      });
  }, [categoryChoose]);  // when category changes, starts useEffect
  
  const handleAddToCart = (slug) => {
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        this.props.fetchCart(); // update the cart count
      })
      .catch((err) => {
        console.log("Error in handleAddToCart");
      });
  };

    const BreadcrumbSection = () => (
      <Breadcrumb>
        <Breadcrumb.Section>
          <Link to="/">
            <Icon link color="black" name="home" />{" "}
          </Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active>
          {chosenCategory}
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
            {chosenCategory}
            {/* xxx.replace(/^./, xxx[0].toUpperCase())   -  capitalize first character */}
          </Header>
          <Divider />
        </Container>
        <Container>
          {/* <GetItemsByCategory data={data} categoryChoose={categoryChoose} /> */}
          <Card.Group>
            {data.map(
              (item) =>
                item.category === chosenCategory && (
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
                          history.push(`/products/${item.slug}`)
                        }
                      />
                      <Card.Content>
                        <Item.Header
                          as="a"
                          onClick={() =>
                            history.push(`/products/${item.slug}`)
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
                            onClick={() => handleAddToCart(item.slug)}
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

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(CategorieChoose);
