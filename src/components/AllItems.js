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

    function filter(array = [], filters = {}) {
      const keys = Object.keys(filters).filter(key => filters.hasOwnProperty(key));
      return array.filter(elem => {
          const commonKeys = keys.filter(key => elem.hasOwnProperty(key));
          console.log(commonKeys)
          return commonKeys.reduce((flag, key) => (flag && filters[key].includes(elem[key])), true);
      });
  }
  
  const products_test = [
    {country: 'Russia', img: 'link.img', genre: 'Comedy', name: 'Вишнёвый сад'},
    {country: 'France', img: 'link.img', genre: 'Novel', name: 'Oberman'},
    {country: 'Italy', img: 'link.img', genre: 'Adventures', name: 'Il cimitero di Praga'},
    {country: 'USA', img: 'link.img', genre: 'Comedy', name: 'The Ransom of Red Chief'}
  ];
  
  const filters_test = {
    country: ['Russia', 'Italy', 'France'],
    genre: ['Comedy', 'Novel']
  };
  console.log("funck", filter(products_test, filters_test))
  };

  



  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search) &&
      item.category.includes(category) &&
      ((color.red === true && item.color === 'red' ) ||
      (color.blue === true && item.color === 'blue' ) ||
      (color.yellow === true && item.color === 'yellow' ) ||
      (color.white === true && item.color === 'white' ) ||
      (color.black === true && item.color === 'black' ) ||
      (color.green === true && item.color === 'green' ) ||
      (color.grey === true && item.color === 'grey' ) ||
      (color.orange === true && item.color === 'orange' )) &&
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
        {filters.map((el, i) => {
          return (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={color[el.name]}
                  value={el.name}
                  color="primary"
                  onChange={handleColor}
                  name={el.name}
                />
              }
              label={el.name}
            />
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

const filters = [
  {
    name: "grey",
  },
  {
    name: "blue",
  },
  {
    name: "black",
  },
  {
    name: "white",
  },
  {
    name: "green",
  },
  {
    name: "yellow",
  },
  {
    name: "orange",
  },
  {
    name: "red",
  },
];

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
