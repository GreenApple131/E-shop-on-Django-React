import React from "react";
import { Route } from "react-router-dom";
import Hoc from "./hoc/hoc";

import Login from "./components/Login";
import Signup from "./components/Signup";
import HomepageLayout from "./components/Home";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import OrderSummary from "./components/OrderSummary";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import SearchResult from "./components/SearchResult";
import CategorieChoose from "./components/Categories";

const categories = [
  "jackets",
  "coats",
  "shirts",
  "t-shirts",
  "sport",
  "shoes",
  "hats",
  "outwear",
];

const BaseRouter = () => (
  <Hoc>
    <Route exact path="/" component={HomepageLayout} />
    <Route path="/products/:productSlug" component={ProductDetail} />
    <Route path="/search/result/:searchRequest" component={SearchResult} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/profile" component={Profile} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/checkout" component={Checkout} />
    {/* <Route path={`/${categories}`} component={CategorieChoose} /> */}

    <Route path="/jackets" component={CategorieChoose} />
    <Route path="/coats" component={CategorieChoose} />
    <Route path="/shirts" component={CategorieChoose} />
    <Route path="/t-shirts" component={CategorieChoose} />
    <Route path="/sport" component={CategorieChoose} />
    <Route path="/shoes" component={CategorieChoose} />
    <Route path="/hats" component={CategorieChoose} />
    <Route path="/outwear" component={CategorieChoose} />
  </Hoc>
);

export default BaseRouter;
