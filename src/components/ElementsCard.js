import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { fetchCart } from "../store/actions/cart";
import { authAxios } from "../utils";
import { addToCartURL } from "../constants";
import {
  Button,
  Card,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Loader,
  Message,
  Sidebar,
  Segment,
  Visibility,
} from "semantic-ui-react";

function ElementsCard(props) {
  const history = useHistory();

  const handleAddToCart = (slug) => {
    authAxios
      .post(addToCartURL, { slug })
      .then((res) => {
        props.fetchCart(); // update the cart count
      })
      .catch((err) => {
        console.log("Error in handleAddToCart");
      });
  };

  return (
    <Card.Group>
      {props.data.map((item) => {
        return (
          <React.Fragment key={item.id}>
            <Card style={{ width: "200px", height: "auto" }}>
              <Image
                src={item.image}
                style={{
                  width: "200px",
                  height: "237px",
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
        );
      })}
    </Card.Group>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ElementsCard);
