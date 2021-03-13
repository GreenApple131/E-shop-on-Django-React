import React, { Component, useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Menu,
  Modal,
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
        price: 0.0,
        category: "",
        category_type: "",
        label: "",
        slug: "",
        description: "",
        size: [],
        other_marks: [],
        image: "",
      },
      editing: false,
    };
    this.fetchTasks = this.fetchTasks.bind(this);

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.handleChangeCategory = this.handleChangeCategory.bind(this);
    this.handleChangeCategoryType = this.handleChangeCategoryType.bind(this);
    this.handleChangeLabel = this.handleChangeLabel.bind(this);
    this.handleChangeSlug = this.handleChangeSlug.bind(this);
    this.handleChangeDescription = this.handleChangeDescription.bind(this);
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

    fetch("http://127.0.0.1:8000/api/product-list/")
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
        size: {
          "id": 16,
          "name": "size",
          "size": "L"
        }
      },
    });
  }

  handleChangePrice(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        price: value,
      },
    });
  }

  handleChangeCategory(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        category: value,
      },
    });
  }

  handleChangeCategoryType(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        category_type: value,
      },
    });
  }

  handleChangeLabel(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        label: value,
      },
    });
  }

  handleChangeSlug(e) {
    var name = e.target.name;
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        slug: value,
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

  handleChangeSize(e) {
    var name = "size";
    var value = {
      id: 16,
      name: "size",
      size: "L",
    };
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        size: value,
      },
    });
  }

  handleChangeOtherMarks(e) {
    var name = "other_marks";
    var value = {
      id: 8,
      mark: "new",
    };
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        other_marks: value,
      },
    });
  }

  handleChangeImage(e) {
    var name = e.target.name;
    var value = e.target.value;
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

    var url = "http://127.0.0.1:8000/api/product-create/";

    if (this.state.editing == true) {
      url = `http://127.0.0.1:8000/api/product-update/${this.state.activeItem.id}/`;
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

    fetch(`http://127.0.0.1:8000/api/product-delete/${task.id}/`, {
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
            handleChangePrice={this.handleChangePrice}
            handleChangeCategory={this.handleChangeCategory}
            handleChangeCategoryType={this.handleChangeCategoryType}
            handleChangeLabel={this.handleChangeLabel}
            handleChangeSlug={this.handleChangeSlug}
            handleChangeDescription={this.handleChangeDescription}
            // handleChangeSize={this.handleChangeSize}
            // handleChangeOtherMarks={this.handleChangeOtherMarks}
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
                    handleChangePrice={this.handleChangePrice}
                    handleChangeCategory={this.handleChangeCategory}
                    handleChangeCategoryType={this.handleChangeCategoryType}
                    handleChangeLabel={this.handleChangeLabel}
                    handleChangeSlug={this.handleChangeSlug}
                    handleChangeDescription={this.handleChangeDescription}
                    // handleChangeSize={this.handleChangeSize}
                    // handleChangeOtherMarks={this.handleChangeOtherMarks}
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
