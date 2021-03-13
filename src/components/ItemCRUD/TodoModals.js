import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";

export const ModalAdd = (props) => {
  const { buttonLabel, className } = props;
  const {
    addNew,
    handleSubmit,
    activeItem,
    handleChangeTitle,
    handleChangeDescription,
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button
        color="danger"
        onClick={() => {
          addNew();
          toggle();
        }}
      >
        Add new Product
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Modal title</ModalHeader>
        <form onSubmit={handleSubmit} id="form">
          <ModalBody>
            <input
              onChange={handleChangeTitle}
              className="form-control"
              id="title"
              value={activeItem.title}
              type="text"
              name="title"
              placeholder="Add task.."
            />
            {/* <input
              onChange={handleChangeDescription}
              className="form-control"
              id="description"
              value={activeItem.description}
              type="text"
              name="description"
              placeholder="Add description.."
            /> */}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" id="submit" type="submit" onClick={toggle}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export const ModalEdit = (props) => {
  const { buttonLabel, className } = props;
  const {
    task,
    startEdit,
    handleSubmit,
    activeItem,
    handleChangeTitle,
    handleChangeDescription,
  } = props;

  const [modal, setModal] = useState(false);
  // const [activeItem, setTask] = useState('')
  // const [editing, setEditing] = useState(false)

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button
        color="danger"
        onClick={() => {
          startEdit(task);
          toggle();
        }}
      >
        Edit
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Edit Item</ModalHeader>
        <form onSubmit={handleSubmit} id="form">
          <ModalBody>
            <input
              onChange={handleChangeTitle}
              className="form-control"
              id="title"
              value={activeItem.title}
              type="text"
              name="title"
              placeholder="Add task.."
            />
            <input
              onChange={handleChangeDescription}
              className="form-control"
              id="description"
              value={activeItem.description}
              type="text"
              name="description"
              placeholder="Add description.."
            />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" id="submit" type="submit" onClick={toggle}>
              Submit
            </Button>{" "}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
};

export const ModalDelete = (props) => {
  const { buttonLabel, className } = props;
  const { task, deleteItem } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button color="danger" onClick={toggle}>
        Delete
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>
          Are You really want to delete this item?
        </ModalHeader>
        <ModalFooter>
          <Button
            color="primary"
            id="submit"
            type="submit"
            onClick={() => {
              deleteItem(task);
              toggle();
            }}
          >
            Submit
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
