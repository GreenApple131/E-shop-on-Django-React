import React, { useState } from "react";
import {
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormText,
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
    handleChangePrice,
    handleChangeCategory,
    handleChangeCategoryType,
    handleChangeLabel,
    handleChangeSlug,
    handleChangeDescription,
    handleChangeSize,
    handleChangeOtherMarks,
    handleChangeImage,
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
            <Label for="new-product">Title</Label>
            <input
              onChange={handleChangeTitle}
              className="form-control"
              id="title"
              value={activeItem.title}
              type="text"
              name="title"
              placeholder="Add Title..."
            />
            <Label for="new-product">Price</Label>
            <input
              onChange={handleChangePrice}
              className="form-control"
              id="price"
              value={activeItem.price}
              type="digit"
              name="price"
              placeholder="0.00"
            />
            <Label for="new-product">Category</Label>
            <input
              onChange={handleChangeCategory}
              className="form-control"
              id="category"
              value={activeItem.category}
              type="text"
              name="category"
              placeholder="Category"
            />
            <Label for="new-product">Category type</Label>
            <input
              onChange={handleChangeCategoryType}
              className="form-control"
              id="category_type"
              value={activeItem.category_type}
              type="text"
              name="category_type"
              placeholder="Men/Women"
            />
            <Label for="new-product">Label</Label>
            <input
              onChange={handleChangeLabel}
              className="form-control"
              id="label"
              value={activeItem.label}
              type="text"
              name="label"
              placeholder="ordinary / primary / secondary / danger"
            />
            <Label for="new-product">Slug</Label>
            <input
              onChange={handleChangeSlug}
              className="form-control"
              id="slug"
              value={activeItem.slug}
              type="text"
              name="slug"
              placeholder="slug"
            />
            <Label for="new-product">Description</Label>
            <input
              onChange={handleChangeDescription}
              className="form-control"
              id="description"
              value={activeItem.description}
              type="text"
              name="description"
              placeholder="Add description.."
            />
            {/* <Label for="new-product">Size</Label>
            <input
              onChange={handleChangeSize}
              className="form-control"
              id="size"
              value={activeItem.size}
              type="text"
              name="size"
              placeholder="XS / S / M / L / XL / XXL"
            />
            <Label for="new-product">Other marks</Label>
            <input
              onChange={handleChangeOtherMarks}
              className="form-control"
              id="other_marks"
              value={activeItem.other_marks}
              type="text"
              name="other_marks"
              placeholder="ordinary / special / new / discount / popular"
            />
            <Label for="new-product">Image</Label> */}
          
            {/* <FormGroup row>
              <Label for="exampleFile" sm={2}>
                File
              </Label>
              <Col sm={10}>
                <Input
                  id="image"
                  type="file"
                  name="file"
                  onChange={handleChangeImage}
                  className="form-control"
                  placeholder="image"
                />
                <FormText color="muted">
                  This is some placeholder block-level help text for the above
                  input. It's a bit lighter and easily wraps to a new line.
                </FormText>
              </Col>
            </FormGroup> */}
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
    handleChangePrice,
    handleChangeCategory,
    handleChangeCategoryType,
    handleChangeLabel,
    handleChangeSlug,
    handleChangeDescription,
    handleChangeSize,
    handleChangeOtherMarks,
    handleChangeImage,
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
            <Label for="new-product">Title</Label>
            <input
              onChange={handleChangeTitle}
              className="form-control"
              id="title"
              value={activeItem.title}
              type="text"
              name="title"
              placeholder="Add Title..."
            />
            <Label for="new-product">Price</Label>
            <input
              onChange={handleChangePrice}
              className="form-control"
              id="price"
              value={activeItem.price}
              type="digit"
              name="price"
              placeholder="0.00"
            />
            <Label for="new-product">Category</Label>
            <input
              onChange={handleChangeCategory}
              className="form-control"
              id="category"
              value={activeItem.category}
              type="text"
              name="category"
              placeholder="Category"
            />
            <Label for="new-product">Category type</Label>
            <input
              onChange={handleChangeCategoryType}
              className="form-control"
              id="category_type"
              value={activeItem.category_type}
              type="text"
              name="category_type"
              placeholder="Men/Women"
            />
            <Label for="new-product">Label</Label>
            <input
              onChange={handleChangeLabel}
              className="form-control"
              id="label"
              value={activeItem.label}
              type="text"
              name="label"
              placeholder="ordinary / primary / secondary / danger"
            />
            <Label for="new-product">Slug</Label>
            <input
              onChange={handleChangeSlug}
              className="form-control"
              id="slug"
              value={activeItem.slug}
              type="text"
              name="slug"
              placeholder="slug"
            />
            <Label for="new-product">Description</Label>
            <input
              onChange={handleChangeDescription}
              className="form-control"
              id="description"
              value={activeItem.description}
              type="text"
              name="description"
              placeholder="Add description.."
            />
            <Label for="new-product">Size</Label>
            <input
              onChange={handleChangeSize}
              className="form-control"
              id="size"
              value={activeItem.size}
              type="text"
              name="size"
              placeholder="XS / S / M / L / XL / XXL"
            />
            <Label for="new-product">Other marks</Label>
            <input
              onChange={handleChangeOtherMarks}
              className="form-control"
              id="other_marks"
              value={activeItem.other_marks}
              type="text"
              name="other_marks"
              placeholder="ordinary / special / new / discount / popular"
            />
            <Label for="new-product">Image</Label>
            <FormGroup row>
              <Label for="exampleFile" sm={2}>
                File
              </Label>
              <Col sm={10}>
                <Input
                  id="image"
                  type="file"
                  name="file"
                  onChange={handleChangeImage}
                  className="form-control"
                  placeholder="image"
                />
                <FormText color="muted">
                  This is some placeholder block-level help text for the above
                  input. It's a bit lighter and easily wraps to a new line.
                </FormText>
              </Col>
            </FormGroup>
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
