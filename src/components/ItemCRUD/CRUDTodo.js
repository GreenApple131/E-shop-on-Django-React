import React, { Component, useState } from "react";
import axios from "axios";
import { get } from "react-hook-form";
// import {
//   Button,
//   Divider,
//   Grid,
//   Header,
//   Icon,
//   Image,
//   Menu,
//   // Modal,
// } from "semantic-ui-react";

import { ModalAdd, ModalEdit, ModalDelete } from "./TodoModals.js";

export default class CRUDTodo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      openModal: false,
      activeItem: {
        id: null,
        title: "",
        description: "",
        image: null,
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
    this.handleChangeImage = this.handleChangeImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getCookie = this.getCookie.bind(this);

    this.addNew = this.addNew.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  toggleModal = () =>
    this.setState((state) => ({ openModal: !state.openModal }));

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

  componentWillMount() {
    this.fetchTasks();
  }

  fetchTasks() {
    console.log("Fetching...");

    fetch("http://127.0.0.1:8000/api/i/todo/")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data.results,
        })
      );
  }

  handleChangeTitle(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  }

  handleChangeDescription(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        description: value,
      },
    });
  }
  handleChangeImage(e) {
    var name = e.target.name;
    var value = e.target.files[0];
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        image: value,
      },
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);

    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/i/todo/";

    let form_data = new FormData();
    form_data.append("title", this.state.activeItem.title);
    form_data.append("description", this.state.activeItem.description);
    form_data.append("image", this.state.activeItem.image);

    if (this.state.editing == true) {
      this.setState({
        editing: false,
      });
      url = `http://127.0.0.1:8000/api/i/todo/${this.state.activeItem.id}/`;
      axios
        .put(url, form_data, {
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
              description: "",
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
          console.log(res)
          this.fetchTasks();
          this.setState({
            activeItem: {
              id: null,
              title: "",
              description: "",
              image: null,
            },
          });
        })
        .catch((err) => console.log(err));
    }
    // fetch(url, {
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json",
    //     "X-CSRFToken": csrftoken,
    //   },
    //   body: JSON.stringify(this.state.activeItem),
    // })
    //   .then((response) => {
    //     this.fetchTasks();
    //     this.setState({
    //       activeItem: {
    //         id: null,
    //         title: "",
    //         description: "",
    //       },
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log("ERROR:", error);
    //   });
  }

  addNew() {
    this.setState({
      activeItem: {
        id: null,
        title: "",
        // description: "",
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

    fetch(`http://127.0.0.1:8000/api/i/todo/${task.id}/`, {
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
        <div>
          <ModalAdd
            addNew={this.addNew}
            handleSubmit={this.handleSubmit}
            activeItem={this.state.activeItem}
            handleChangeTitle={this.handleChangeTitle}
            handleChangeDescription={this.handleChangeDescription}
            handleChangeImage={this.handleChangeImage}
          />
        </div>

        <div id="list-wrapper">
          {tasks.map((task, index) => {
            return (
              <div key={index} className="task-wrapper flex-wrapper">
                <span>{task.title}</span>

                <div style={{ flex: 1 }}>
                  <ModalEdit
                    task={task}
                    startEdit={this.startEdit}
                    handleSubmit={this.handleSubmit}
                    activeItem={this.state.activeItem}
                    handleChangeTitle={this.handleChangeTitle}
                    handleChangeDescription={this.handleChangeDescription}
                    handleChangeImage={this.handleChangeImage}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <ModalDelete task={task} deleteItem={this.deleteItem} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
