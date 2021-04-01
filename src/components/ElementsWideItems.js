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
} from "semantic-ui-react";
import "./elements/filter.css";

function ElementsWideItems(props) {
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
    <React.Fragment key={props.id}>
      <Item>
        <Item.Image
          size="small"
          src={props.image}
          style={{
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "noRepeat",
          }}
          as="a"
          onClick={() => history.push(`/products/${props.slug}`)}
        />
        <Item.Content>
          <Item.Header
            as="a"
            onClick={() => history.push(`/products/${props.slug}`)}
          >
            {props.title}
          </Item.Header>
          <Item.Meta>
            {props.category} {"  "}
            {
              props.discount_price && <Label color="violet">discount</Label> // always show, not just when there is a discount
            }
          </Item.Meta>
          <Item.Description>{props.description}</Item.Description>
          <Item.Description>Rating...</Item.Description>

          <Item.Extra style={{ marginTop: -27 }}>
            <React.Fragment>
              <Button
                floated="right"
                animated="vertical"
                color="black"
                onClick={() => handleAddToCart(props.slug)}
                style={{ marginRight: "9%" }}
              >
                <Button.Content hidden>Buy</Button.Content>
                <Button.Content visible>
                  <Icon name="cart plus" />
                </Button.Content>
              </Button>
              {props.discount_price && (
                <Header
                  floated="right"
                  color="violet"
                  style={{ marginTop: "10px" }}
                >
                  <small>
                    <strike>
                      <span>${props.price}</span>
                    </strike>
                  </small>{" "}
                  ${props.discount_price}
                </Header>
              )}
              {!props.discount_price && (
                <Header
                  floated="right"
                  size="medium"
                  style={{ marginTop: "8px" }}
                >
                  ${props.price}
                </Header>
              )}
            </React.Fragment>
          </Item.Extra>
        </Item.Content>
      </Item>
    </React.Fragment>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ElementsWideItems);
