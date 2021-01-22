import React, { Component, useState } from "react";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.scss";
import { Link } from "react-router-dom";
import { Button, Tab } from "semantic-ui-react";

import Gallery from "react-grid-gallery";

class DetailsTabs extends Component {
  state = { activeItem: "home" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    const { images } = this.props;

    const panes = [
      {
        menuItem: "Description",
        render: () => (
          <Tab.Pane attached={false}>
            <table className="table table-striped mb-0">
              <tbody>
                <tr>
                  <th>Ideal For :</th>
                  <td>{this.props.item.category_type}</td>
                </tr>
                <tr>
                  <th>Dress Fabric :</th>
                  <td>Silk</td>
                </tr>
                <tr>
                  <th>Type :</th>
                  <td>Need To Add SMTH</td>
                </tr>
                <tr>
                  <th>Neck :</th>
                  <td>Round Neck</td>
                </tr>
                <tr>
                  <th>Sleeve :</th>
                  <td>3/4 Sleeve</td>
                </tr>
                <tr>
                  <th>Work :</th>
                  <td>N/A</td>
                </tr>
              </tbody>
            </table>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Images",
        render: () => (
          <Tab.Pane attached={false}>
            <Gallery images={images} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Reviews",
        render: () => (
          <Tab.Pane attached={false}>
            <form className="theme-form mt-4">
              <div className="form-row">
                <div className="col-md-12 ">
                  <div className="media m-0">
                    <label>Rating</label>
                    <div className="media-body ml-3">
                      <div className="rating three-star">
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                        <i className="fa fa-star" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter Your name"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="review">Review Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="review"
                    placeholder="Enter your Review Subjects"
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label htmlFor="review">Review Title</label>
                  <textarea
                    className="form-control"
                    placeholder="Wrire Your Testimonial Here"
                    id="exampleFormControlTextarea1"
                    rows="6"
                  />
                </div>
                <div className="col-md-12">
                  <Button color="black" type="submit">
                    Submit Your Review
                  </Button>
                </div>
              </div>
            </form>
          </Tab.Pane>
        ),
      },
    ];
    return (
      <section className="tab-product m-0">
        <div className="row">
          <div className="col-sm-12 col-lg-12">
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
          </div>
        </div>
      </section>
    );
  }
}

export default DetailsTabs;
