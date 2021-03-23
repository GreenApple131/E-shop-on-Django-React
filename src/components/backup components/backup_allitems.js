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
// import CategoryFilter from "../CategoryFilter";
import { addToCartURL, productListURL } from "../../constants";
import { authAxios } from "../../utils";
import { fetchCart } from "../../store/actions/cart";
import { ItemsCards } from "../ElementsCard";

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
  const [color, setColor] = useState(
    { blue: false },
    { red: false },
    { yellow: false },
    { white: false },
    { black: false },
    { green: false },
    { grey: false },
    { orange: false }
  );
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
      const keys = Object.keys(filters).filter((key) =>
        filters.hasOwnProperty(key)
      );
      return array.filter((elem) => {
        const commonKeys = keys.filter((key) => elem.hasOwnProperty(key));
        console.log(commonKeys);
        return commonKeys.reduce(
          (flag, key) => flag && filters[key].includes(elem[key]),
          true
        );
      });
    }

    const products_test = [
      {
        country: "Russia",
        img: "link.img",
        genre: "Comedy",
        name: "Вишнёвый сад",
      },
      { country: "France", img: "link.img", genre: "Novel", name: "Oberman" },
      {
        country: "Italy",
        img: "link.img",
        genre: "Adventures",
        name: "Il cimitero di Praga",
      },
      {
        country: "USA",
        img: "link.img",
        genre: "Comedy",
        name: "The Ransom of Red Chief",
      },
    ];

    const filters_test = {
      country: ["Russia", "Italy", "France"],
      genre: ["Comedy", "Novel"],
    };
    console.log("funck", filter(products_test, filters_test));
  };

  const filteredProducts = products.filter(
    (item) =>
      item.name.toLowerCase().includes(search) &&
      item.category.includes(category) &&
      // ((color.red === true ? item.color === 'red' : item.color ) ||
      // (color.blue === true ? item.color === 'blue' : item.color ) ||
      // (color.yellow === true ? item.color === 'yellow' : item.color ) ||
      // (color.white === true ? item.color === 'white' : item.color ) ||
      // (color.black === true ? item.color === 'black' : item.color ) ||
      // (color.green === true ? item.color === 'green' : item.color ) ||
      // (color.grey === true ? item.color === 'grey' : item.color ) ||
      // (color.orange === true ? item.color === 'orange' : item.color )) &&
      
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
        this.setState({ data: res.data.results });
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

        {/* <CategoryFilter /> */}
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








































import React, {
  Component,
  useEffect,
  useState,
  Fragment,
  Suspense,
  createRef,
} from "react";

import faker from "faker";
import _ from "lodash";
import { connect, Provider } from "react-redux";
// import { render } from "react-dom";
// import { combineReducers, createStore } from "redux";
// import _ from "lodash";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Container,
  Checkbox,
  Dimmer,
  Divider,
  Header,
  Icon,
  Image,
  Loader,
  Placeholder,
  Rail,
  Ref,
  Segment,
  Sticky,
} from "semantic-ui-react";
// import CategoryFilter from "../CategoryFilter";
import { addToCartURL, productListURL } from "../../constants";
import { authAxios } from "../../utils";
import { fetchCart } from "../../store/actions/cart";
import { ItemsCards } from "../ElementsCard";

// import "./elements/filters.scss";
import "./elements/filter.css";

// import styles from "./elements/Filters.module.css";
// import productStyles from "./elements/Products.module.css";
// import productCardStyles from "./elements/ProductCard.module.css";
// import allItemsStyles from "./elements/AllItems.module.css";

// const DATA_ENTRIES = 500;
// const ENTRIES_PER_PAGE = 50;

// [{title: "Men's Scarf"}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]

// function dataAfter(props) {
//   const dataBefore = props.data
//   console.log('dataBefore', props.data)
//   dataBefore.map((data) => {
//     return(
//       Object.values(data)
//     )
//   })
// }

// const entryAttrs = dataAfter()

// const AppContainer = connect(AppMapStateToProps, AppMapDispatchToProps)(App);

// const store = createStore(reducers);

// class AllFilters extends Component {
//   render() {
//     return (
//       <Provider store={store}>
//         <AppContainer />
//       </Provider>
//     );
//   }
// }

const filterKeys = ["category", "price"];

const initialFilterState = filterKeys.reduce(
  (collection, key) => ({
    ...collection,
    [key]: [],
  }),
  {}
);

const without = (obj, key) => {
  const { [key]: omit, ...foo } = obj;
  return foo;
};

const filterItems = (items, filter) => {
  const valueMap = {};
  const filteredItems = new Set();

  for (const filterAttribute in filter) {
    const filterValues = filter[filterAttribute];

    for (const value of filterValues) {
      valueMap[filterAttribute] = { [value]: 0 };
    }
  }

  for (const item of items) {
    const allFilterMatches = [];

    for (const filterAttribute in filter) {
      const filterValues = filter[filterAttribute];
      const matchesFilter =
        filterValues.length === 0 ||
        filterValues.includes(item[filterAttribute]);

      allFilterMatches.push(matchesFilter);

      const filterWithoutThisFilterAttribute = without(filter, filterAttribute);

      const matchesOtherFilter = Object.entries(
        filterWithoutThisFilterAttribute
      ).every(
        ([key, values]) => values.length === 0 || values.includes(item[key])
      );

      if (matchesOtherFilter) {
        valueMap[filterAttribute] = valueMap[filterAttribute] || {};

        valueMap[filterAttribute][item[filterAttribute]] =
          valueMap[filterAttribute][item[filterAttribute]] || 0;

        if (valueMap[filterAttribute][item[filterAttribute]] !== undefined) {
          valueMap[filterAttribute][item[filterAttribute]] += 1;
        }
      }
    }

    if (allFilterMatches.every(Boolean)) {
      filteredItems.add(item);
    }
  }

  return { filteredItems: [...filteredItems], valueMap };
};

const App = ({ items }) => {
  const [filter, setFilter] = useState(initialFilterState);

  const then = performance.now();
  const { filteredItems, valueMap } = filterItems(items, filter);
  // console.log(
  //   `filtering ${items.length} items took ${(performance.now() - then).toFixed(
  //     2
  //   )}ms`
  // )
  const contextRef = createRef();

  return (
    <div style={{padding: 10 }}>
      <Ref innerRef={contextRef}>
        <Rail style={{ top: 100 }}>
          <Sticky context={contextRef} offset={100} bottomOffset={100}>
            {filterKeys.map((key) => (
              <Fragment key={key}>
                <div>{key}</div>
                <div
                  style={{
                    overflowY: "auto",
                    border: "1px solid #000",
                    padding: 5,
                    margin: 5,
                    marginBottom: 20,
                    height: "25vh",
                    width: "180px",
                  }}
                >
                  {Object.entries(valueMap[key])
                    .sort((a, b) => a[0].localeCompare(b[0]))
                    .map(([value, count]) => (
                      <label style={{ display: "block" }} key={value}>
                        <Checkbox
                          name={key}
                          checked={filter[key].includes(value)}
                          onChange={({ target: { name, checked } }) =>
                            setFilter((filter) => ({
                              ...filter,
                              [key]: checked
                                ? [...filter[key], value]
                                : filter[key].filter((v) => v !== value),
                            }))
                          }
                        />
                        <span style={{ marginLeft: "1ch" }}>
                          {value} ({count})
                        </span>
                      </label>
                    ))}
                </div>
              </Fragment>
            ))}
          </Sticky>
        </Rail>
      </Ref>

      <div
        style={{
          flexGrow: 1,
          marginLeft: 200,
          display: "grid",
          gridTemplateColumns: `repeat(${filterKeys.length + 1}, 1fr)`,
          gridTemplateRows: `repeat(${filteredItems.length}, 25px)`,
        }}
      >
        <ItemsCards style={{ fontWeight: "bold", marginLeft: 10 }} data={filteredItems} />
        {/* {filterKeys.map((key) => (
          <div key={key} style={{ fontWeight: "bold", marginLeft: 10 }}>
            {key}
          </div>
        ))} */}

        {/* {filteredItems.slice(0, 10).map((item) => (
          <Fragment key={item.id}>
            <div
              style={{
                marginLeft: 10,
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {item.title}
            </div>
            {filterKeys.map((key) => (
              <div key={key} style={{ marginLeft: 10 }}>
                {item[key]}
              </div>
            ))}
          </Fragment>
        ))} */}
      </div>
      
    </div>
  );
};

const allData = fetchItemsData();

function fetchItemsData() {
  let itemsPromise = fetchItems();
  return {
    items: wrapPromise(itemsPromise),
  };
}

function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    (r) => {
      status = "success";
      result = r;
    },
    (e) => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    },
  };
}

async function fetchItems() {
  // const items = [];
  // for (var i = 0; i < 50; i++) {
  //   items.push({
  //     id: faker.random.uuid(),
  //     name: faker.commerce.productName(),
  //     color: faker.commerce.color(),
  //     material: faker.commerce.productMaterial(),
  //     price: faker.commerce.price(),
  //   });
  // }

  const items = await axios.get(productListURL);

  return new Promise((resolve) => { 
      resolve(items.data.results);
      console.log("fetched items", items.data.results);
  });
}

class AllItems extends Component {
  state = {
    data: [],
    loading: false,
    categoryChoose: "",
  };

  async componentDidMount() {
    this.setState({ loading: true });

    const res = await axios
      .get(productListURL)
      .then((res) => {
        this.setState({ data: res.data.results, loading: false });
      })
      .catch((err) => {
        this.setState({ error: err, loading: false });
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
    const { data, loading } = this.state;

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

        {/* {data !== [] ? (<App items={data} />) : (<></>) } */}
        <Suspense
          fallback={
            <Segment style={{ height: "200px" }}>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
              <Image src="/images/wireframe/short-paragraph.png" />
            </Segment>
          }
        >
          <ItemsSuspense />
        </Suspense>

        {/*  */}

        <Container>
          {loading && (
            <Segment style={{ height: "200px" }}>
              <Dimmer active inverted>
                <Loader inverted>Loading</Loader>
              </Dimmer>
              <Image src="/images/wireframe/short-paragraph.png" />
            </Segment>
          )}
          {/* <GetItemsByCategory data={data} categoryChoose={categoryChoose} /> */}
          {/* <ItemsCards data={data} /> */}
        </Container>

        {/* <CategoryFilter /> */}
      </React.Fragment>
    );
  }
}

function ItemsSuspense() {
  const newData = allData.items.read();
  console.log("newData", newData);
  return <App items={newData} />;
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCart: () => dispatch(fetchCart()),
  };
};

export default connect(null, mapDispatchToProps)(AllItems);
