import React, { Component, useState, useEffect } from "react";
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

import "./common/index.scss";
import "./common/index.css";

import "react-image-gallery/styles/scss/image-gallery.scss";
import ImageGallery from "react-image-gallery";
import Details from "./ItemDetails/Details";
import DetailsTabs from "./ItemDetails/DetailsTabs";

class ProductDetail extends Component {
  state = {
    loading: false,
    error: null,
    formVisible: false,
    data: [],
    formData: {},
    images: [],
    imagesForGallery: [],
  };

  componentDidMount() {
    this.handleFetchItem();
    window.scrollTo(0, 0); // start from top page
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
        var mainImages = [];
        mainImages.push({
          original: res.data.image,
          thumbnail: res.data.image,
        });
        var imagesForDetailsGallery = [];
        imagesForDetailsGallery.push({
          src: res.data.image,
          thumbnail: res.data.image,
          thumbnailWidth: 320,
          caption: res.data.title,
          tags: [{value: "Jacket", title: "Jacket"}, {value: "Man", title: "Man"}],
        });

        this.setState({
          data: res.data,
          loading: false,
          images: mainImages,
          imagesForGallery: imagesForDetailsGallery,
        });
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
    const {
      data,
      error,
      loading,
      value,
      images,
      imagesForGallery,
    } = this.state;
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

    // Images for carousel and thumbnail need to be formated like this
    // const imagesdef = [{ original: "https://picsum.photos/id/1018/1000/600/",
    //                      thumbnail: "https://picsum.photos/id/1018/250/150/", }];

    return (
      <section style={{ marginTop: "10px", marginBottom: "200px" }}>
        <BreadcrumbSection />
        <Divider />
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
        <div className="collection-wrapper">
          <div className="row">
            <div className="col-lg-6 col-sm-10 col-xs-12">
              {images !== undefined && (
                <ImageGallery
                  items={images}
                  showFullscreenButton={false}
                  showPlayButton={false}
                  showNav={false}
                  thumbnailPosition="left"
                  showIndex={true}
                />
              )}
            </div>
            <div className="col-lg-4">
              <div className="product-right product-description-box">
                <h2 style={{ fontWeight: "bold" }}> {item.title} </h2>

                <Details
                  item={item}
                  value={value}
                  handleChange={this.handleChange}
                  handleAddToCart={this.handleAddToCart}
                />
              </div>
            </div>
          </div>
        </div>
        <div style={{marginLeft: '15px'}}>
          <div className="row">
            <div className="col-sm-12 col-lg-12">
              <DetailsTabs item={item} images={imagesForGallery} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(ProductDetail));
