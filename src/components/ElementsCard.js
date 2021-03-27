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
import './elements/filter.css'

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
    <React.Fragment key={props.id}>
      <Card className='cards-desktop' style={{ width: "200px", height: "auto" }}>
        <Image className='cards-image-desktop'
          src={props.image}
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
          onClick={() => history.push(`/products/${props.slug}`)}
        />
        <Card.Content>
          <Item.Header
            as="a"
            onClick={() => history.push(`/products/${props.slug}`)}
          >
            {props.title}
          </Item.Header>
          <Card.Meta>
            {props.category} {"  "}
            {
              props.discount_price && <Label color="violet">discount</Label> // always show, not just when there is a discount
            }
          </Card.Meta>
          <Card.Description>Rating...</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <React.Fragment>
            {props.discount_price && (
              <Header
                floated="left"
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
                // color="black"
                floated="left"
                size="medium"
                style={{ marginTop: "7px" }}
              >
                ${props.price}
              </Header>
            )}
            <Button
              animated="vertical"
              color="black"
              floated="right"
              onClick={() => handleAddToCart(props.slug)}
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
}


const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(ElementsCard);
