import React, { Component } from "react";
import { Divider, Grid, Header, Menu } from "semantic-ui-react";

import "./elements/example.css";

class Colorizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      color: "",
      bgColor: "white",
    };
    this.colorValue = this.colorValue.bind(this);
    this.setNewColor = this.setNewColor.bind(this);
  }
  colorValue(e) {
    this.setState({
      color: e.target.value,
    });
  }
  setNewColor(e) {
    this.setState({
      bgColor: this.state.color,
    });

    this._input.focus();
    this._input.value = "";

    e.preventDefault();
  }
  render() {
    var squareStyle = {
      backgroundColor: this.state.bgColor,
    };
    var self = this;
    return (
      <div className="colorArea" style={{ textAlign: "center" }}>
        <div style={squareStyle} className="colorSquare"></div>
        <form onSubmit={this.setNewColor}>
          <input
            onChange={this.colorValue}
            ref={(el) => (this._input = el)}
            placeholder="Input Color"
          ></input>
          <button type="submit">ok</button>
        </form>
      </div>
    );
  }
}


class Palitra extends Component {
  render() {
    return (
      <div>
        <h1 id="colorHeading">Palitra</h1>
        <Colorizer />
      </div>
    );
  }
}

// class Profile extends Component {
// state = { activeItem: "billing address" };

// handleItemClick = (e, { name }) => this.setState({ activeItem: name });

// render() {
//   const { activeItem } = this.state;

//   return (
//     <React.Fragment>
//       <Grid container columns={2} divided>
//         <Grid.Row>
//           <Grid.Column width={6}>
//             <Menu vertical>
//               <Menu.Item
//                 name="billing address"
//                 active={activeItem === "billing address"}
//                 onClick={this.handleItemClick}
//               />
//               <Menu.Item
//                 name="marked items"
//                 active={activeItem === "marked items"}
//                 onClick={this.handleItemClick}
//               />
//               <Menu.Item
//                 name="shipping history"
//                 active={activeItem === "shipping history"}
//                 onClick={this.handleItemClick}
//               />
//             </Menu>
//           </Grid.Column>
//           <Grid.Column width={10}>
//             <Header>Profile</Header>
//             <Divider />
//             {activeItem === "billing address" ? (
//               <p>billing address form</p>
//             ) : activeItem === "marked items" ? (
//               <p>marked items</p>
//             ) : (
//               <p>shipping history</p>
//             )}
//           </Grid.Column>
//         </Grid.Row>
//       </Grid>
//     </React.Fragment>
//   );
// }

export default Palitra;
