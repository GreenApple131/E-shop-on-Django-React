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
import CategoryFilter from "./CategoryFilter";
import { addToCartURL, productListURL, productListLimPriceURL } from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";
import { ItemsCards } from "./ElementsCard";

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
                          // checked={filter[key].includes(value)}
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
          marginLeft: 200,
          gridTemplateColumns: `repeat(${filterKeys.length + 1}, 1fr)`,
          gridTemplateRows: `repeat(${filteredItems.length}, 25px)`,
        }}
      >
        <ItemsCards style={{ fontWeight: "bold", marginLeft: '10'}} data={filteredItems} />
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
  // const items = await axios.get(productListLimPriceURL(20, 50));

  const itemsFixedPrice = items.data.results.map((pr) => {
    pr.price = pr.price.toString()
    return( pr )
  })

  return new Promise((resolve) => { 
      resolve(itemsFixedPrice);
      console.log("fetched items", itemsFixedPrice);
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

        <CategoryFilter />
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