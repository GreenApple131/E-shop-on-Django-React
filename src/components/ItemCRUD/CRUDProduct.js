import React, { Component, useState } from "react";
import axios from "axios";
import {
  Button,
  Divider,
  Grid,
  Header,
  Menu,
  Segment,
} from "semantic-ui-react";
import { ModalAdd, ModalEdit, ModalDelete } from "./ProductModals.js";

export default class CRUDProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      openModal: false,
      activeItem: {
        id: null,
        title: "",
        price: null,
        discount_price: null,
        category: "",
        category_type: "",
        label: "",
        slug: "",
        description: "",
        size: [], // id: size --- | 13: XS | 14: S | 15: M | 16: L | 17: XL | 18: XXL
        other_marks: [], // id: mark --- | 6: ordinary | 7: special | 8: new | 9: discount | 10: popular
        image: null,
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);

    this.handleChangeSmth = this.handleChangeSmth.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeSize = this.handleChangeSize.bind(this);
    this.handleChangeOtherMarks = this.handleChangeOtherMarks.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);

    this.addNew = this.addNew.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  toggleModal = () =>
    this.setState((state) => ({ openModal: !state.openModal }));

  componentWillMount() {
    this.fetchTasks();
  }

  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  handleChangeSmth(e) {
    console.log("Name:", e.target.name, "| Value:", e.target.value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        [e.target.name]: e.target.value,
      },
    });
  }

  handleChangeTitle(e) {
    // Typical usage (don't forget to compare props):
    let slug = e.target.value
      .toString()
      .normalize("NFD") // split an accented letter in the base letter and the acent
      .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-");
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: e.target.value,
        slug: slug,
      },
    });
  }

  handleChangeSize(e) {
    console.log(e.target.name, ": ", e.target.value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        size: [15],
      },
    });
  }

  handleChangeOtherMarks(e) {
    console.log(e.target.name, ": ", e.target.value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        other_marks: [8],
      },
    });
  }

  handleChangeImage(e) {
    console.log(e.target.name, ": ", e.target.files[0]);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        image: e.target.files[0],
      },
    });
  }

  fetchTasks() {
    console.log("Fetching...");

    fetch("http://127.0.0.1:8000/api/i/items/")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data.results,
        })
      );
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);

    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/i/items/";

    let form_data = new FormData();
    form_data.append("title", this.state.activeItem.title);
    form_data.append("price", this.state.activeItem.price);
    if (this.state.activeItem.discount_price !== null) {
      form_data.append("discount_price", this.state.activeItem.discount_price);
    }
    form_data.append("category", this.state.activeItem.category);
    form_data.append("category_type", this.state.activeItem.category_type);
    form_data.append("label", this.state.activeItem.label);
    form_data.append("slug", this.state.activeItem.slug);
    form_data.append("description", this.state.activeItem.description);
    form_data.append("size", this.state.activeItem.size);
    form_data.append("other_marks", this.state.activeItem.other_marks);
    form_data.append("image", this.state.activeItem.image);

    if (this.state.editing == true) {
      this.setState({
        editing: false,
      });
      url = `http://127.0.0.1:8000/api/i/items/${this.state.activeItem.id}/`;
      axios
        .put(url, form_data, {
          headers: {
            // "content-type": "multipart/form-data",
            "content-type": "application/json",
            "X-CSRFToken": csrftoken,
          },
        })
        .then((res) => {
          this.fetchTasks();
          this.setState({
            activeItem: {
              id: null,
              title: "",
              price: null,
              discount_price: null,
              category: "",
              category_type: "",
              label: "",
              slug: "",
              description: "",
              size: [], // id: size --- | 13: XS | 14: S | 15: M | 16: L | 17: XL | 18: XXL
              other_marks: [], // id: mark --- | 6: ordinary | 7: special | 8: new | 9: discount | 10: popular
              image: null,
            },
          });
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .post(url, form_data, {
          headers: {
            "content-type": "multipart/form-data",
            "X-CSRFToken": csrftoken,
          },
        })
        .then((res) => {
          this.fetchTasks();
          this.setState({
            activeItem: {
              id: null,
              title: "",
              price: null,
              discount_price: null,
              category: "",
              category_type: "",
              label: "",
              slug: "",
              description: "",
              size: [], // id: size --- | 13: XS | 14: S | 15: M | 16: L | 17: XL | 18: XXL
              other_marks: [], // id: mark --- | 6: ordinary | 7: special | 8: new | 9: discount | 10: popular
              image: null,
            },
          });
        })
        .catch((err) => console.log(err));
    }
  }

  addNew() {
    this.setState({
      activeItem: {
        id: null,
        title: "",
        price: null,
        discount_price: null,
        category: "",
        category_type: "Men",
        label: "O",
        slug: "",
        description: "",
        size: [], // id: size --- | 13: XS | 14: S | 15: M | 16: L | 17: XL | 18: XXL
        other_marks: [], // id: mark --- | 6: ordinary | 7: special | 8: new | 9: discount | 10: popular
        image: null,
      },
    });
  }

  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    });
  }

  deleteItem(task) {
    var csrftoken = this.getCookie("csrftoken");

    fetch(`http://127.0.0.1:8000/api/i/items/${task.id}/`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  }

  render() {
    const { openModal } = this.state;
    var tasks = this.state.todoList;

    return (
      <div>
        <Grid>
          <Grid.Row only="computer tablet">
            <ModalAdd
              addNew={this.addNew}
              handleSubmit={this.handleSubmit}
              activeItem={this.state.activeItem}
              handleChangeTitle={this.handleChangeTitle}
              handleChangeSmth={this.handleChangeSmth}
              handleChangeSize={this.handleChangeSize}
              handleChangeOtherMarks={this.handleChangeOtherMarks}
              handleChangeImage={this.handleChangeImage}
            />
          </Grid.Row>
        </Grid>
        <Grid textAlign="center">
          <Grid.Row only="mobile" style={{ marginLeft: -30 }}>
            <ModalAdd
              addNew={this.addNew}
              handleSubmit={this.handleSubmit}
              activeItem={this.state.activeItem}
              handleChangeTitle={this.handleChangeTitle}
              handleChangeSmth={this.handleChangeSmth}
              handleChangeSize={this.handleChangeSize}
              handleChangeOtherMarks={this.handleChangeOtherMarks}
              handleChangeImage={this.handleChangeImage}
            />
          </Grid.Row>
        </Grid>
        <Divider />

        <div>
          {tasks.map((task, index) => {
            return (
              <div key={index} className="task-wrapper flex-wrapper">
                <Grid stackable columns={2}>
                  <Grid.Row
                    style={{ paddingBottom: "0rem", marginLeft: 0 }}
                    only="computer tablet"
                  >
                      <Segment className='profile-segment'>
                    <Grid.Column width="10">
                        <span>{task.title}</span>
                    </Grid.Column>
                    <Grid.Row textAlign="right" style={{ paddingBottom: "0rem" }}>
                      <Grid.Column floated="right">
                        <Button.Group floated="right" style={{marginTop: -27, marginRight: 10}}>
                            <ModalEdit
                              task={task}
                              startEdit={this.startEdit}
                              handleSubmit={this.handleSubmit}
                              activeItem={this.state.activeItem}
                              handleChangeSmth={this.handleChangeSmth}
                              handleChangeTitle={this.handleChangeTitle}
                              handleChangeSize={this.handleChangeSize}
                              handleChangeOtherMarks={
                                this.handleChangeOtherMarks
                              }
                              handleChangeImage={this.handleChangeImage}
                              />
                            <ModalDelete
                              task={task}
                              deleteItem={this.deleteItem}
                              />
                        </Button.Group>
                      </Grid.Column>
                    </Grid.Row>
                              </Segment>
                  </Grid.Row>
                </Grid>

                <Grid stackable columns={2} only="mobile">
                  <Grid.Row style={{ paddingBottom: "0rem" }} only="mobile">
                    <Grid.Column width="10" floated="left">
                      <Segment>
                        <span>{task.title} | Amount = 10 items</span>
                      </Segment>
                    </Grid.Column>
                    <Grid.Column floated="right">
                      <Button.Group floated="right" style={{ marginTop: -27 }}>
                        <ModalEdit
                          task={task}
                          startEdit={this.startEdit}
                          handleSubmit={this.handleSubmit}
                          activeItem={this.state.activeItem}
                          handleChangeSmth={this.handleChangeSmth}
                          handleChangeTitle={this.handleChangeTitle}
                          handleChangeSize={this.handleChangeSize}
                          handleChangeOtherMarks={this.handleChangeOtherMarks}
                          handleChangeImage={this.handleChangeImage}
                        />
                        <ModalDelete task={task} deleteItem={this.deleteItem} />
                      </Button.Group>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
