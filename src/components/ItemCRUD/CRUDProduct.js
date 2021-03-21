import React, { Component, useState } from "react";
import axios from "axios";
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
        size: [], // id: size --- | 13: XS | 14: S | 15: M | 16: L | 17: XL | 18: XXL
        other_marks: [], // id: mark --- | 6: ordinary | 7: special | 8: new | 9: discount | 10: popular
        image: null,
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

    fetch("http://127.0.0.1:8000/api/i/items/")
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
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        size: [15],
      },
    });
  }

  handleChangeOtherMarks(e) {
    var name = "other_marks";
    var value = e.target.value;
    console.log("Name:", name);
    console.log("Value:", value);

    this.setState({
      activeItem: {
        ...this.state.activeItem,
        other_marks: [7],
        other_marks: [8]
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

    var url = "http://127.0.0.1:8000/api/i/items/";


    let form_data = new FormData();
    form_data.append("title", this.state.activeItem.title);
    form_data.append("price", this.state.activeItem.price);
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
              price: 0.0,
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
              price: 0.0,
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
            handleChangeSize={this.handleChangeSize}
            handleChangeOtherMarks={this.handleChangeOtherMarks}
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
                    handleChangeSize={this.handleChangeSize}
                    handleChangeOtherMarks={this.handleChangeOtherMarks}
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
