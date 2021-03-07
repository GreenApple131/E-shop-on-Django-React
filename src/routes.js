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
import { PageNotFound } from "./components/PageNotFound";
import AllItems from "./components/AllItems";
import TestFilter from "./components/TestFilter";


const BaseRouter = () => (
  <Hoc>
    <Route path="/" exact={true} component={HomepageLayout} />
    <Route path="/products/:productSlug" component={ProductDetail} />

    <Route path="/search/:searchRequest" component={SearchResult} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route path="/profile" component={Profile} />
    <Route path="/order-summary" component={OrderSummary} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/category/:categoryChoose" component={CategorieChoose} />
    <Route path="/allitems" component={AllItems} />
    <Route path="/testfilter" component={TestFilter} />


    {/* <Route component={PageNotFound} /> */}
  </Hoc>
);

export default BaseRouter;
