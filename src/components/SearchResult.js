import React, {
  Component,
  useReducer,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import axios from "axios";
import _ from "lodash";
import {
  Breadcrumb,
  Button,
  Card,
  Container,
  Grid,
  Header,
  Image,
  Icon,
  Item,
  Label,
  Search,
} from "semantic-ui-react";
import { productListURL, productSearchURL } from "../constants";
import FilterResults from "react-filter-search";

const initialState = {
  data: [],
  isLoading: false,
  error: null,
  results: [],
  value: "",
  searchValue: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "CLEAN_QUERY":
      return initialState;
    case "START_SEARCH":
      return { ...state, loading: true, value: action.query };
    case "FINISH_SEARCH":
      return {
        ...state,
        loading: false,
        results: action.results,
        // searchValue: action.results,
      };
    case "UPDATE_SELECTION":
      return { ...state, value: action.selection };

    case "UPDATE_ERROR":
      return { ...state, error: action };

    default:
      throw new Error();
  }
}

export function SearchBar(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [list, setList] = useState(null);
  const [data, setData] = useState([]);
  const { loading, results, value } = state;
  const history = useHistory();

  const timeoutRef = React.useRef();

  const handlePressEnter = (e) => {
    if (e.keyCode === 13) {
      history.push({
        pathname: `/search/${e.target.value}`,
        // state: { searchValue: e.target.value },
        // access to state - this.props.location.state.*******
      });
    }
  };

  const handleResultSelect = (e, { result }) => {
    history.push(`/products/${result.slug}`);
  };

  const handleSearchChange = useCallback((e, data) => {
    clearTimeout(timeoutRef.current);
    dispatch({ type: "START_SEARCH", query: data.value });

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        dispatch({ type: "CLEAN_QUERY" });
        return;
      }

      axios
        .get(productListURL)
        .then(function (list) {
          setList(
            (list = Object.keys(list.data).map((key) => {
              // перетворення для source у вигляд масиву списків, щоб могло нормально відображати результат пошуку [{…}, {…}, {…}]
              return {
                title: list.data[key].title,
                description: list.data[key].description,
                price: "$" + list.data[key].price,
                id: list.data[key].id,
                image: list.data[key].image,
                slug: list.data[key].slug,
              };
            }))
          );

          const source = list;

          console.log("source", source);

          const re = new RegExp(_.escapeRegExp(data.value), "i");
          const isMatch = (result) => re.test(result.title);

          dispatch({
            type: "FINISH_SEARCH",
            results: _.filter(source, isMatch),
            searchValue: data.value,
          });
        })
        .catch(function (error) {
          console.log("error", error);
        });
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Grid.Column width="7">
      <Search
        loading={loading}
        input={{ fluid: true }}
        onKeyDown={handlePressEnter}
        onResultSelect={handleResultSelect}
        onSearchChange={handleSearchChange}
        results={results}
        value={value}
        size="small"
        placeholder="Search what do you want..."
        fluid
        style={{
          name: "search",
          circular: true,
          link: true,
          marginTop: "4px",
          minWidth: "500px",
        }}
      />
    </Grid.Column>
  );
}

// async componentDidMount() {
//   this.setState({ loading: true });
//   console.log(this.props.match.params.searchRequest)

// const res = axios
// .get(productSearchURL(this.props.match.params.searchRequest))
//   .then((res) => {
//     this.setState({data: res.data})
//     console.log(this.state.data);
//   })
//   .catch((err) => {
//     this.setState({ error: err });
//   });
// }

function SearchResult(props) {
  const history = useHistory();

  let { searchRequest } = useParams();   // get the searchRequest

  const [data, setData] = useState([]);
  const [error, setError] = useState("");

  const searchedItem = searchRequest;

  useEffect(() => {
    axios
      .get(productSearchURL(searchRequest))
      .then((res) => {
        console.log("data", res.data);
        setData(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  }, [searchRequest]);  // when searchRequest changes, starts useEffect

  const BreadcrumbSection = () => (
    <Breadcrumb>
      <Breadcrumb.Section>
        <Link to="/">
          <Icon link color="black" name="home" />{" "}
        </Link>
      </Breadcrumb.Section>
      <Breadcrumb.Divider icon="right chevron" />
      <Breadcrumb.Section active>Search for: {searchedItem}</Breadcrumb.Section>
    </Breadcrumb>
  );

  return (
    <Container style={{ marginTop: "10px" }}>
      <BreadcrumbSection />
      <Header as="h2">Search result of "{searchedItem}"</Header>

      {/* <SearchFilterResults searchValue={this.state.searchValue} /> */}

      <FilterResults
          value={searchedItem}
          data={data}
          renderResults={() => (
            <Grid
              doubling
              columns={5}
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              {data.map((item) => {
                return (
                  <Grid.Column key={item.id}>
                    <Card style={{ width: "300px", height: "420px" }}>
                      <Image
                        src={item.image}
                        style={{
                          width: "220px",
                          height: "257px",
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "noRepeat",
                        }}
                        wrapped
                        ui={true}
                        as="a"
                        onClick={() =>
                          history.push(`/products/${item.slug}`)
                        }
                      />
                      <Card.Content>
                        <Item.Header
                          as="a"
                          onClick={() =>
                            history.push(`/products/${item.slug}`)
                          }
                        >
                          {item.title}
                        </Item.Header>
                        <Card.Meta>
                          {item.category} {"  "}
                          {item.discount_price && ( // always show, not just when there is a discount
                            <Label color="violet">discount</Label>
                          )}
                        </Card.Meta>
                        <Card.Description>Rating...</Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <React.Fragment>
                          {item.discount_price && (
                            <Header
                              floated="left"
                              color="violet"
                              style={{ marginTop: "10px" }}
                            >
                              <small>
                                <strike>
                                  <span>${item.price}</span>
                                </strike>
                              </small>{" "}
                              ${item.discount_price}
                            </Header>
                          )}
                          {!item.discount_price && (
                            <Header
                              color="black"
                              floated="left"
                              size="medium"
                              style={{ marginTop: "7px" }}
                            >
                              ${item.price}
                            </Header>
                          )}
                          <Button
                            animated="vertical"
                            color="black"
                            floated="right"
                            onClick={() => this.handleAddToCart(item.slug)}
                          >
                            <Button.Content hidden>Buy</Button.Content>
                            <Button.Content visible>
                              <Icon name="cart plus" />
                            </Button.Content>
                          </Button>
                        </React.Fragment>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                );
              })}
            </Grid>
          )}
        />
    </Container>
  );
}

export default SearchResult;
