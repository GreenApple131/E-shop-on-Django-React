import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
// import { Formik, Field, Form } from "formik";
import {
  Button,
  Card,
  Divider,
  Form,
  Header,
  Icon,
  Image,
  Label,
  Radio,
} from "semantic-ui-react";

import "../common/index.css";
import "../elements/radio.css";
import "../elements/detail.css";

class Details extends Component {
  render() {
    const { item, value, handleAddToCart, handleChange } = this.props;

    return (
      <React.Fragment>
        <div className="product-right">
          <Label basic color="green">
            In stock
          </Label>
          <Divider />
          {!item.discount_price && <h2>${item.price} </h2>}
          {item.discount_price && (
            <div>
              <h4>
                <del>${item.price}</del>
                <span>
                  {Math.ceil(100 - (item.discount_price * 100) / item.price)}%
                  off
                </span>
                <h3>${item.discount_price} </h3>
              </h4>
            </div>
          )}
        </div>
        <div className="product-description border-product">
          <div className="size-box" style={{ marginBottom: "70px" }}>
            <Header as="b" textAlign="center">
              Select Size:
            </Header>
            <br />
            <br />
            {item.size && ( // shows availiable sizes
              <Form onSubmit={() => handleAddToCart(item.slug)}>
                <div>
                  <Form.Group inline>
                    {item.size.map((s) => {
                      return (
                        <Form.Field>
                          <input
                            className="radio-button"
                            role="button"
                            key={s.id}
                            type="radio"
                            name={s.name}
                            value={s.id}
                            id={s.size}
                            // checked={value === s.id}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                          />
                          <label for={s.size} className="radio-button-label">
                            {s.size}
                          </label>
                        </Form.Field>
                      );
                    })}
                  </Form.Group>
                </div>
                <Divider style={{ marginTop: "-10px" }} />
                <React.Fragment>
                  <Button animated="vertical" color="black" type="submit">
                    <Button.Content hidden>
                      <Icon name="cart plus" />
                    </Button.Content>
                    <Button.Content type="submit" visible>
                      ADD TO CART
                    </Button.Content>
                  </Button>
                  <Button animated="vertical" color="black" type="submit">
                    <Button.Content hidden>
                      <Icon name="cart plus" />
                    </Button.Content>
                    <Button.Content type="submit" visible>
                      BUY NOW
                    </Button.Content>
                  </Button>
                </React.Fragment>
              </Form>
            )}
          </div>
        </div>

        <div className="border-product">
          <h6 className="product-title">short description</h6>
          <div className="product-icon">{this.props.item.description}</div>
        </div>

        <div className="border-product">
          <h6 className="product-title">share it</h6>
          <div className="product-icon">
            <ul className="product-social">
              <li>
                <a href="https://www.facebook.com/" target="_blank">
                  <Icon className="facebook"></Icon>
                </a>
              </li>
              <li>
                <a href="https://plus.google.com/discover" target="_blank">
                  <Icon className="google plus"></Icon>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank">
                  <Icon className="twitter"></Icon>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank">
                  <Icon className="instagram"></Icon>
                </a>
              </li>
            </ul>
            <button className="wishlist-btn">
              <Icon className="heart"></Icon>
              <span className="title-font">Add To WishList</span>
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Details;
