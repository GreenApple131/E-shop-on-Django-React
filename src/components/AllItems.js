import React, { Component, useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormGroup,
  InputLabel,
  Select,
  Slider,
  TextField,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";

import { connect } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Container,
  Divider,
  Header,
  Icon,
} from "semantic-ui-react";
import CategoryFilter from "./CategoryFilter";
import { addToCartURL, productListURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";
import { ItemsCards } from "./ElementsCard";

import "./elements/filterSidebar.css";

import styles from "./elements/Filters.module.css";
import productStyles from "./elements/Products.module.css";
import productCardStyles from "./elements/ProductCard.module.css";
import allItemsStyles from "./elements/AllItems.module.css";

function AllFilters() {
  const [products, setProducts] = useState(dummydata);

  const [search, setSearch] = useState("");
  const [price, setPrice] = useState([0, 2000]);
  const [category, setCategory] = useState("");
  const [color, setColor] = useState({
    blue: false,
    red: false,
    yellow: false,
    white: false,
    black: false,
    green: false,
    grey: false,
    orange: false,
  });
  const [colorArray, setColorArray] = useState([]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const handleColor = (e) => {
    if (e.target.checked) {
      setColorArray([...colorArray, e.target.value]);
    } else {
      colorArray.splice(colorArray.indexOf(e.target.value), 1);
    }

    setColor({ ...color, [e.target.name]: e.target.checked });

    console.log(filteredProducts);
    console.log(color);
  };

  const handlePrice = (event, newValue) => {
    setPrice(newValue);
  };

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search) &&
      item.category.includes(category) &&
      (item.color === "white" || item.color === "black") &&
      item.price > price[0] &&
      item.price < price[1]
  );

  return (
    <div className={allItemsStyles.container}>
      <MyFilters
        search={search}
        price={price}
        category={category}
        color={color}
        handleSearch={handleSearch}
        handlePrice={handlePrice}
        handleCategory={handleCategory}
        handleColor={handleColor}
      />
      <Products data={filteredProducts} />
    </div>
  );
}

const MyFilters = ({
  search,
  category,
  color,
  price,
  handleSearch,
  handlePrice,
  handleCategory,
  handleColor,
}) => {
  return (
    <Card variant="outlined" className={styles.cardContainer}>
      <CardContent style={{ height: "100%" }}>
        <Typography variant="h5" color="primary" align="left">
          Filter
        </Typography>
        <div className={styles.filterContainer}>
          <Search
            className={styles.flexItem}
            search={search}
            handleSearch={handleSearch}
          />
          <Category
            className={styles.flexItem}
            category={category}
            handleCategory={handleCategory}
          />
          <Price
            className={styles.flexItem}
            price={price}
            handlePrice={handlePrice}
          />
          <Color
            className={styles.flexItem}
            color={color}
            handleColor={handleColor}
          />
        </div>
      </CardContent>
    </Card>
  );
};

class AllItems extends Component {
  state = {
    data: [],
    categoryChoose: "",
  };

  async componentDidMount() {
    this.setState({ loading: true });

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
    const BreadcrumbSection = () => (
      <Breadcrumb>
        <Breadcrumb.Section>
          <Link to="/">
            <Icon link color="black" name="home" />{" "}
          </Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider icon="right chevron" />
        <Breadcrumb.Section active>All Items</Breadcrumb.Section>
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
            {" "}
            All Items
            {/* xxx.replace(/^./, xxx[0].toUpperCase())   -  capitalize first character */}
          </Header>
          <Divider />
        </Container>

        {/*  */}
        <AllFilters />
        {/*  */}

        <Container>
          {/* <GetItemsByCategory data={data} categoryChoose={categoryChoose} /> */}
          <ItemsCards data={data} />
        </Container>

        <CategoryFilter />
      </React.Fragment>
    );
  }
}

const Category = ({ category, handleCategory }) => {
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-helper-label">Category</InputLabel>
      <Select
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={category}
        onChange={handleCategory}
      >
        <MenuItem value="">
          <em>Category</em>
        </MenuItem>
        <MenuItem value="Upperwear">Upperwear</MenuItem>
        <MenuItem value="Lowerwear">Lowerwear</MenuItem>
        <MenuItem value="Footwear">Footwear</MenuItem>
      </Select>
      <FormHelperText>Filter by Category</FormHelperText>
    </FormControl>
  );
};

const Price = ({ price, handlePrice }) => {
  return (
    <div>
      <FormLabel component="legend">Filter by Price</FormLabel>
      <Slider
        value={price}
        onChange={handlePrice}
        min={0}
        max={2000}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
        style={{ width: "210px" }}
      />
    </div>
  );
};

const Search = ({ search, handleSearch }) => {
  return (
    <TextField
      id="standard-required"
      label="Search by name"
      onChange={handleSearch}
      defaultValue={search}
    />
  );
};

const Color = ({ color, handleColor }) => {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Filter by Color</FormLabel>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={color.red}
              value="red"
              color="primary"
              onChange={handleColor}
              name="red"
            />
          }
          label="Red"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={color.orange}
              value="orange"
              color="primary"
              onChange={handleColor}
              name="orange"
            />
          }
          label="Orange"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={color.yellow}
              value="yellow"
              color="primary"
              onChange={handleColor}
              name="yellow"
            />
          }
          label="Yellow"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={color.green}
              value="green"
              color="primary"
              onChange={handleColor}
              name="green"
            />
          }
          label="Green"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={color.blue}
              value="blue"
              color="primary"
              onChange={handleColor}
              name="blue"
            />
          }
          label="Blue"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={color.white}
              value="white"
              color="primary"
              onChange={handleColor}
              name="white"
            />
          }
          label="White"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={color.black}
              value="black"
              color="primary"
              onChange={handleColor}
              name="black"
            />
          }
          label="Black"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={color.grey}
              color="primary"
              value="grey"
              onChange={handleColor}
              name="grey"
            />
          }
          label="Grey"
        />
      </FormGroup>
    </FormControl>
  );
};

const Products = ({ data }) => {
  return (
    <div className={productStyles.container}>
      {data.map((item) => (
        <ProductCard item={item} />
      ))}
    </div>
  );
};

const ProductCard = ({ item }) => {
  return (
    <Card className={productCardStyles.productCard} variant="outlined">
      <CardContent className={productCardStyles.content}>
        <Typography variant="h6" color="textPrimary" align="center">
          {item.name}
        </Typography>
        <Typography variant="subheading2" color="textPrimary">
          Rs. {item.price}
        </Typography>
        <div className={productCardStyles.footer}>
          <Typography
            variant="body"
            color="textSecondary"
            style={{ marginRight: "10px" }}
          >
            {item.category}
          </Typography>
          <Typography variant="body" color="textSecondary">
            {item.color}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

const dummydata = [
  { name: "T-shirt", color: "blue", price: "699", category: "Upperwear" },
  { name: "T-shirt", color: "red", price: "1299", category: "Upperwear" },
  { name: "T-shirt", color: "white", price: "499", category: "Upperwear" },
  { name: "T-shirt", color: "black", price: "699", category: "Upperwear" },
  { name: "Jeans", color: "blue", price: "999", category: "Lowerwear" },
  { name: "Jeans", color: "black", price: "1299", category: "Lowerwear" },
  { name: "Jeans", color: "blue", price: "1299", category: "Lowerwear" },
  { name: "Pants", color: "grey", price: "999", category: "Lowerwear" },
  { name: "Pants", color: "white", price: "1299", category: "Lowerwear" },
  { name: "Shorts", color: "orange", price: "499", category: "Lowerwear" },
  { name: "Sweater", color: "green", price: "1499", category: "Upperwear" },
  { name: "Sweater", color: "grey", price: "1299", category: "Upperwear" },
  { name: "Shoes", color: "blue", price: "1599", category: "Footwear" },
  { name: "Shoes", color: "red", price: "1599", category: "Footwear" },
  { name: "T-shirt", color: "green", price: "699", category: "Upperwear" },
  { name: "T-shirt", color: "yellow", price: "499", category: "Upperwear" },
  { name: "Slippers", color: "blue", price: "499", category: "Footwear" },
  { name: "Slippers", color: "white", price: "299", category: "Footwear" },
  { name: "Shoes", color: "white", price: "999", category: "Footwear" },
  { name: "Shorts", color: "white", price: "699", category: "Lowerwear" },
];

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(AllItems);
