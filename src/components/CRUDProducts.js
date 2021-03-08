import React, { Component, useState } from "react";
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

import { ModalAdd, ModalEdit, ModalDelete } from "./ItemCRUD/ItemCRUD.js";

export default class CRUDProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      openModal: false,
      activeItem: {
        id: null,
        title: "",
        description: "",
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
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

    fetch("http://127.0.0.1:8000/api/item-list/")
      .then((response) => response.json())
      .then((data) =>
        this.setState({
          todoList: data,
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

  handleSubmit(e) {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);

    var csrftoken = this.getCookie("csrftoken");

    var url = "http://127.0.0.1:8000/api/item-create/";

    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/item-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            description: "",
          },
        });
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      });
  }

  addNew() {
    this.setState({
      activeItem: {
        id: null,
        title: "",
        description: "",
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

    fetch(`http://127.0.0.1:8000/api/item-delete/${task.id}/`, {
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
