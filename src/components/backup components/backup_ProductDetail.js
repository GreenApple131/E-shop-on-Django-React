import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";
import {
  Button,
  Breadcrumb,
  Card,
  Container,
  Dimmer,
  Divider,
  Grid,
  Form,
  Header,
  Icon,
  Image,
  Label,
  Loader,
  Message,
  Radio,
  Segment,
} from "semantic-ui-react";
import { productDetailURL, addToCartURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";

import "./elements/index.scss";
import "./elements/index.css";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Slider from "react-slick";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Icon
      name="arrow alternate circle right"
      style={{ ...style, background: "green" }}
      className={className}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <Icon
      name="arrow alternate circle left"
      style={{ ...style, background: "green" }}
      className={className}
      onClick={onClick}
    />
  );
}

function ImageCarousel(props) {
  const im = props.image;
  const renderSlides = () =>
    [1, 2].map((num) => (
      <div>
        <img src={props.image} />
      </div>
    ));
  const settings = {
    dots: true,
    thumbnails: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return <Slider {...settings}>{renderSlides()}</Slider>;
}

class ProductDetail extends Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
  };

  componentDidMount() {
    this.handleFetchItem();
  }

  handleToggleForm = () => {
    const { formVisible } = this.state;
    this.setState({
      formVisible: !formVisible,
    });
  };

  handleChangeColor = () => {
    // for change color selected size button
    const { black } = this.state;
    this.setState({
      black: !black,
    });
  };

  handleFetchItem = () => {
    const {
      match: { params },
    } = this.props;
    this.setState({ loading: true });
    this.props.fetchCart(); // update the cart count
    axios
      .get(productDetailURL(params.productSlug))
      .then((res) => {
        console.log(res.data);
        this.setState({ data: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleFormatData = (formData) => {
    // convert {colour: 1, size: 2} to [1,2] - they're all variations
    return Object.keys(formData).map((key) => {
      return formData[key];
    });
  };

  handleAddToCart = (slug) => {
    this.setState({ loading: true });
    const { formData } = this.state;
    const variations = this.handleFormatData(formData);

    console.log(variations);

    authAxios
      .post(addToCartURL, { slug, variations })
      .then((res) => {
        this.props.fetchCart(); // update the cart count

        this.setState({ loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
      });
  };

  handleChange = (e, { name, value }) => {
    // функція вже готова для приймання різних типів одягу (розмір, колір і т.д.). Лишилось реалізувати підтримку інштх типів в моделях Django і допилити у формі відображення
    this.setState({ value });
    const { formData } = this.state;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    this.setState({ formData: updatedFormData });
  };

  render() {
    const { data, error, loading, formData, value } = this.state;
    const item = data;

    const BreadcrumbSection = () => (
      <Breadcrumb>
        <Breadcrumb.Section>
          <Link to="/">
            <Icon link color="" name="home" />{" "}
          </Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section>
          <Link to={`/category/${item.category}`.toLowerCase()}>
            {item.category}
          </Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active>{item.title}</Breadcrumb.Section>
      </Breadcrumb>
    );

    return (
      <Container style={{ marginTop: "10px" }}>
        <BreadcrumbSection />
        {error && ( // if error then do smth after &&
          <Message
            error
            header="There was some errors with your submission"
            content={JSON.stringify(error)}
          />
        )}
        {loading && ( // if loading then do smth after &&
          <Segment>
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>

            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        )}
        <section>
          <div className="collection-wrapper">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 col-sm-10 col-xs-12  order-up">
                  <ImageCarousel image={item.image} />
                </div>
                <div className="col-lg-4">
                  <div className="product-right product-description-box">
                    <h2> {item.title} </h2>
                    <div className="border-product">
                      <h6 className="product-title">product details</h6>
                      <p>{item.description}</p>
                    </div>
                    <div className="single-product-tables border-product detail-section">
                      <table>
                        <tbody>
                          <tr>
                            <td>Febric:</td>
                            <td>Chiffon</td>
                          </tr>
                          <tr>
                            <td>Color:</td>
                            {/* <td>{item.variants[0].color}</td> */}
                          </tr>
                          <tr>
                            <td>Avalibility:</td>
                            <td>InStock</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="border-product">
                      <h6 className="product-title">share it</h6>
                      <div className="product-icon">
                        <ul className="product-social">
                          <li>
                            <a href="https://www.facebook.com/" target="_blank">
                            <Icon className='facebook'></Icon>
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://plus.google.com/discover"
                              target="_blank"
                            >
                              <Icon className='google plus'></Icon>
                            </a>
                          </li>
                          <li>
                            <a href="https://twitter.com/" target="_blank">
                              <Icon className="twitter"></Icon>
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.instagram.com/"
                              target="_blank"
                            >
                              <Icon className='instagram'></Icon>
                            </a>
                          </li>
                        </ul>
                        <button className="wishlist-btn">
                        <Icon className='heart'></Icon>
                          <span className="title-font">Add To WishList</span>
                        </button>
                      </div>
                    </div>
                    <div className="border-product">
                      <h6 className="product-title">100% SECURE PAYMENT</h6>
                      <div className="payment-card-bottom">
                        <ul>
                          <li>
                            <a href="#">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/visa.png`}
                                alt=""
                              />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/mastercard.png`}
                                alt=""
                              />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/paypal.png`}
                                alt=""
                              />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/american-express.png`}
                                alt=""
                              />
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/discover.png`}
                                alt=""
                              />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="product-right product-form-box">
                    {!item.discount_price && <h3>${item.price} </h3>}
                    {item.discount_price && (
                      <div>
                        <h4>
                          <del>${item.price}</del>
                          <span>
                            {Math.ceil(
                              100 - (item.discount_price * 100) / item.price
                            )}
                            % off
                          </span>
                        </h4>

                        <ul className="color-variant"></ul>
                        <div className="product-description border-product">
                          <h6 className="product-title">Time Reminder</h6>
                          <div className="timer">
                            <p id="demo">
                              <span>
                                25
                                <span className="padding-l">:</span>
                                <span className="timer-cal">Days</span>
                              </span>
                              <span>
                                22
                                <span className="padding-l">:</span>
                                <span className="timer-cal">Hrs</span>
                              </span>
                              <span>
                                13
                                <span className="padding-l">:</span>
                                <span className="timer-cal">Min</span>
                              </span>
                              <span>
                                57
                                <span className="timer-cal">Sec</span>
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="product-description border-product">
                      <h6 className="product-title size-text">
                        select size
                        <span>
                          <a
                            href=""
                            data-toggle="modal"
                            data-target="#sizemodal"
                          >
                            size chart
                          </a>
                        </span>
                      </h6>
                      <div
                        className="modal fade"
                        id="sizemodal"
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="exampleModalLabel"
                        aria-hidden="true"
                      >
                        <div
                          className="modal-dialog modal-dialog-centered"
                          role="document"
                        >
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5
                                className="modal-title"
                                id="exampleModalLabel"
                              >
                                Sheer Straight Kurta
                              </h5>
                              <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                              >
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>
                            <div className="modal-body">
                              <img
                                src={`${process.env.PUBLIC_URL}/assets/images/size-chart.jpg`}
                                alt=""
                                className="img-fluid"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="size-box">
                        <ul>
                          {item.size && // shows availiable sizes
                            item.size.map((s) => {
                              return (
                                <Form.Field
                                  key={s.id}
                                  control={Radio}
                                  label={s.size}
                                  name={s.name}
                                  value={s.id}
                                  checked={value === s.id}
                                  onChange={this.handleChange}
                                />
                              );
                            })}
                        </ul>
                      </div>
                      <span>{this.state.stock}</span>
                      <h6 className="product-title">quantity</h6>
                      <div className="qty-box">
                        <div className="input-group">
                          <span className="input-group-prepend">
                            <button
                              type="button"
                              className="btn quantity-left-minus"
                              data-type="minus"
                              data-field=""
                            >
                              <i className="fa fa-angle-left"></i>
                            </button>
                          </span>
                          <input
                            type="text"
                            name="quantity"
                            className="form-control input-number"
                          />
                          <span className="input-group-prepend">
                            <button
                              type="button"
                              className="btn quantity-right-plus"
                              data-type="plus"
                              data-field=""
                            >
                              <i className="fa fa-angle-right"></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="product-buttons">
                      <a className="btn btn-solid">add to cart</a>
                      <Link
                        to={`${process.env.PUBLIC_URL}/checkout`}
                        className="btn btn-solid"
                      >
                        buy now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Grid
          columns={2}
          divided
          style={{ marginTop: "5px", marginBottom: "10px" }}
        >
          <Grid.Row>
            <Grid.Column>
              <Card fluid>
                <Card.Content>
                  <Header textAlign="center" as="h1">
                    {item.title}
                  </Header>
                  <Image src={item.image} wrapped ui={true} />
                  <Card.Meta>
                    <React.Fragment>
                      {item.category}
                      {item.discount_price && ( // always show, not just when there is a discount
                        <Label
                          color={
                            item.label === "primary"
                              ? "blue"
                              : item.label === "secondary"
                              ? "green"
                              : "olive"
                          }
                        >
                          {item.label}
                        </Label>
                      )}
                    </React.Fragment>
                  </Card.Meta>
                  <br />
                  <Card.Description>
                    <Header as="b" textAlign="center">
                      Select Size:
                    </Header>
                    <br />
                    <br />
                    {item.size && ( // shows availiable sizes
                      <Form onSubmit={() => this.handleAddToCart(item.slug)}>
                        <Form.Group required inline>
                          {item.size.map((s) => {
                            return (
                              <Form.Field
                                key={s.id}
                                control={Radio}
                                label={s.size}
                                name={s.name}
                                value={s.id}
                                checked={value === s.id}
                                onChange={this.handleChange}
                              />
                            );
                          })}
                        </Form.Group>
                        <Divider />
                        <React.Fragment>
                          {item.discount_price && (
                            <Button
                              // color="black"
                              floated="left"
                            >
                              <small>
                                <strike>${item.price}</strike>
                              </small>{" "}
                              ${item.discount_price}
                            </Button>
                          )}
                          {!item.discount_price && (
                            <Label
                              basic
                              // color="black"
                              floated="left"
                              size="big"
                            >
                              ${item.price}
                            </Label>
                          )}
                          <Button
                            animated="vertical"
                            color="black"
                            floated="right"
                            type="submit"
                          >
                            <Button.Content hidden>
                              <Icon name="cart plus" />
                            </Button.Content>
                            <Button.Content type="submit" visible>
                              Add to cart
                            </Button.Content>
                          </Button>
                        </React.Fragment>
                      </Form>
                    )}
                  </Card.Description>
                </Card.Content>
                <Divider />
              </Card>
            </Grid.Column>
            <Grid.Column>
              <Header as="h2">Description</Header>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                pulvinar auctor urna vitae tincidunt. Nam ut vestibulum dolor,
                sit amet lobortis orci. Curabitur sollicitudin nisl sed feugiat
                vulputate. Vivamus eu vehicula leo, eleifend porta nunc. Sed nec
                turpis sit amet purus tincidunt bibendum vel vel ligula. Nulla
                consequat eu neque ac consequat. In tristique condimentum erat.
                Duis eu sapien viverra, finibus ex sed, egestas libero.
              </p>
              <p>
                Nullam lorem nisi, fringilla ac rhoncus viverra, accumsan eget
                tellus. Praesent elementum purus eget est molestie hendrerit.
                Aenean ac scelerisque nibh. Donec lobortis eros in ante
                condimentum euismod et eu metus. Proin consectetur id odio ut
                blandit. Cras vestibulum sagittis sapien non lobortis. Fusce
                rutrum nulla est, vel scelerisque purus bibendum vel. Vestibulum
                a odio finibus, tempor massa id, accumsan libero. Ut venenatis
                vel lorem ut fermentum. Aenean aliquam dolor pellentesque,
                pretium magna at, luctus velit. Pellentesque id consequat justo.
                Sed nec ligula in libero ultricies bibendum quis sit amet
                libero.
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
