import React, { useEffect, useState, Component } from "react";
import faker from "faker";
import _ from "lodash";
import { connect, Provider } from "react-redux";
// import { render } from "react-dom";
// import { combineReducers, createStore } from "redux";
// import _ from "lodash";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Breadcrumb,
  Button,
  Checkbox,
  Container,
  Divider,
  Grid,
  Header,
  Loader,
  Rail,
  Ref,
  Segment,
  Sticky,
  Table,
} from "semantic-ui-react";
import CategoryFilter from "./CategoryFilter";
import {
  addToCartURL,
  productListURL,
  productFilterAndOrderURL,
  productListCategoryURL,
} from "../constants";
import { authAxios } from "../utils";
import { fetchCart } from "../store/actions/cart";
import { ItemsCards } from "./ElementsCard";

// import "./elements/filters.scss";
import "./elements/filter.css";

function TestFilter(props) {
  const [filterstate, setFilterstate] = useState({
    filters: [],
    
  });
  const [state, setState] = useState({
    data: [],
    category: "",
    price_min: undefined,
    price_max: undefined,
    other_marks: undefined,
    ordering: "price",
  })
  const [error, setError] = useState("");

  useEffect(() => {
   
      axios
      .get(
        productFilterAndOrderURL(
          state.category,
          state.price_min,
          state.price_max,
          state.other_marks,
          state.ordering
        )
      )
      // .get(productListCategoryURL(category))
      .then((res) => {
        console.log("TestFilter", res.data.results);
        const itemsFixedPrice = res.data.results.map((pr) => {
          pr.price = pr.price.toString();
          return pr;
        });
        setState({
          ...state,
          data: itemsFixedPrice,
          category: res.data.results.category,
        });
      })
      .catch((err) => {
        setError(err);
      });
    
    console.log('state', state);
    console.log('filterset', filterstate);
  }, [filterstate]);

  const checkboxChange = (e) => {
    const { name } = e.target;
    setFilterstate((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [name]: !prevState.filters[name],
      },
    }));
    if (filterstate.filters.Jackets == true) {
      setState((prevState) => ({
        ...prevState,

        category: {
          ...prevState.category + 'Jackets'
        }
        
      }))
    }
  };


  return (
    <React.Fragment>
      {/* categoryChoose={this.props.location.state.searchValue} */}
      <Container style={{ marginTop: "10px" }}>
        <React.Fragment>
          <Header
            style={{
              margin: 10,
              fontFamily: "monospace",
              fontSize: 30,
              marginTop: "30px",
              marginBottom: "10px",
            }}
          >
            Categories
          </Header>
          <div>
            <div>
              <input
                className="mr-2"
                checked={filterstate.filters.index}
                name="Jackets"
                value="Jackets"
                onChange={checkboxChange}
                type="checkbox"
              /> Jackets
            </div>
            <div>
            <input
              className="mr-2"
              checked={filterstate.filters.index}
              label="Coats"
              name="Coats"
              value="Coats"
              onChange={checkboxChange}
              type="checkbox"
              /> Coats
              </div>
            <div>
            <input
              className="mr-2"
              checked={filterstate.filters.index}
              label="Hats"
              name="Hats"
              value="Hats"
              onChange={checkboxChange}
              type="checkbox"
            /> Hats
            </div>
          </div>

          <Divider />
          {/* <ItemsCards data={data} /> */}
        </React.Fragment>

        <Divider />
        <ItemsCards data={state.data} />

      </Container>

      <CategoryFilter />
    </React.Fragment>
  );
}

// class TestFilter extends Component {
//   constructor(props) {
//     super(props);

//     const isChecked = this.props.match.params.checkbox === "true";

//     this.state = {
//       checkbox: isChecked,
//       filters: '',
//       data: [],
//       category: undefined,
//       price_min: undefined,
//       price_max: undefined,
//       other_marks: undefined,
//       ordering: "price",
//     };

//     this.toggleCheckbox = this.toggleCheckbox.bind(this);
//   }

//   toggleCheckbox({ target: { name } }) {
//     this.setState((prev) => ({ ...prev, [name]: !this.state.name })); // will toggle to the opposite of the current state
//     console.log("checkbox", this.state.checkbox);
//   }

//   // useEffect(() => {
  //   axios
  //     .get(
  //       productFilterAndOrderURL(
  //         state.category,
  //         state.price_min,
  //         state.price_max,
  //         state.other_marks,
  //         state.ordering
  //       )
  //     )
  //     // .get(productListCategoryURL(category))
  //     .then((res) => {
  //       console.log("TestFilter", res.data.results);
  //       const itemsFixedPrice = res.data.results.map((pr) => {
  //         pr.price = pr.price.toString();
  //         return pr;
  //       });
  //       setState({
  //         ...state,
  //         data: itemsFixedPrice,
  //         category: res.data.results.category,
  //       });
  //     })
  //     .catch((err) => {
  //       setError(err);
  //     });
  // }, []); // when category changes, starts useEffect

//   // Request looks like:
//   // /api/?title=hat&price_min=10&price_max=100&category=Hats&other_marks=new&ordering=price

// render() {
//   return (
//     <React.Fragment>
//       {/* categoryChoose={this.props.location.state.searchValue} */}
//       <Container style={{ marginTop: "10px" }}>
//         <React.Fragment>
//           <Header
//             style={{
//               margin: 10,
//               fontFamily: "monospace",
//               fontSize: 30,
//               marginTop: "30px",
//               marginBottom: "10px",
//             }}
//           >
//             Categories
//           </Header>
//           <Grid>
//             <Grid.Column width={10}>
//               {/* <Button compact onClick={toggle}>
//                 Check All
//               </Button> */}
//               <input
//                 name="check_Jackets"
//                 label="check_Jackets"
//                 type="checkbox"
//                 checked={this.state.checkbox}
//                 onChange={this.toggleCheckbox}
//               /> Jackets
//               {/* <Checkbox
//                 label="Coats"
//                 checked={checkCoats}
//                 onChange={updateCoats}
//               />
//               <Checkbox
//                 label="Jackets"
//                 checked={checkJackets}
//                 onChange={updateJackets}
//               />
//               <Checkbox
//                 label="Shirts"
//                 checked={checkShirts}
//                 onChange={updateShirts}
//               /> */}

//               <Divider />
      //       </Grid.Column>
      //     </Grid>

      //     <Divider />
      //     <ItemsCards data={data} />
      //   </React.Fragment>

      //   <Divider />
      // </Container>

//       <CategoryFilter />
//     </React.Fragment>
//   );
// }
// }

export default TestFilter;
// export default connect(null, mapDispatchToProps)(TestFilter);
