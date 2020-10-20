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
import { localhost, productDetailURL, addToCartURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";

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

    const BreadcrumbExampleSection = () => (
      <Breadcrumb>
        <Breadcrumb.Section link>
          <Link to="/">Home</Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        {item.category_type === "M" ? (
          <Breadcrumb.Section link>
            <Link to={"/men"}>Men's</Link>
          </Breadcrumb.Section>
        ) : (
          <Breadcrumb.Section link>
            <Link to={"/women"}>Women's</Link>
          </Breadcrumb.Section>
        )}
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section link>
          <Link to={`/${item.category_type}/${item.category}`.toLowerCase()}>{item.category}</Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active>{item.title}</Breadcrumb.Section>
      </Breadcrumb>
    );

    return (
      <Container style={{ marginTop: "50px" }}>
        <BreadcrumbExampleSection />
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
                            <Button color="black" floated="left">
                              <small>
                                <strike>${item.price}</strike>
                              </small>{" "}
                              ${item.discount_price}
                            </Button>
                          )}
                          {!item.discount_price && (
                            <Label basic color="black" floated="left" size="big">
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
              <Header as="h3">Description</Header>
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
              {/* {data.variations &&
                data.variations.map((v) => {
                  return (
                    <React.Fragment key={v.id}>
                      <Header as="h3">{v.name}</Header>
                      <Item.Group divided>
                        {v.item_variations.map((iv) => {
                          return (
                            <Item key={iv.id}>
                              {iv.attachment && (
                                <Item.Image
                                  size="tiny"
                                  src={`${localhost}${iv.attachment}`}
                                />
                              )}
                              <Item.Content verticalAlign="middle">
                                {iv.value}
                              </Item.Content>
                            </Item>
                          );
                        })}
                      </Item.Group>
                    </React.Fragment>
                  );
                })} */}
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
