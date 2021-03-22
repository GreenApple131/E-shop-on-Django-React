import React, { useState } from "react";
import {
  Button,
  Col,
  Row,
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
    handleChangeSmth,
    handleChangeTitle,
    handleChangeSize,
    handleChangeOtherMarks,
    handleChangeImage,
  } = props;

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  return (
    <div>
      <Button
        color="success"
        onClick={() => {
          addNew();
          toggle();
        }}
        style={{marginLeft: 28}}
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
            <Row>
              <Col md={6}>
                <Label for="new-product">Price</Label>
                <input
                  onChange={handleChangeSmth}
                  className="form-control"
                  id="price"
                  value={activeItem.price}
                  type="digit"
                  name="price"
                  placeholder="0.00"
                />
              </Col>
              <Col md={6}>
                <Label for="new-product">Discount price</Label>
                <input
                  onChange={handleChangeSmth}
                  className="form-control"
                  id="discount_price"
                  value={activeItem.discount_price}
                  type="digit"
                  name="discount_price"
                  placeholder="0.00"
                />
              </Col>
            </Row>
            <Label for="new-product">Category</Label>
            <Input
              type="select"
              className="form-control"
              name="category"
              id="category"
              onChange={handleChangeSmth}
            >
              <option>Coats</option>
              <option>Jackets</option>
              <option>Shirts</option>
              <option>T-shirts</option>
              <option>Sport wear</option>
              <option>Shoes</option>
              <option>Hats</option>
              <option>Outwear</option>
            </Input>
            <Label for="new-product">Category type</Label>
            <Input
              type="select"
              className="form-control"
              name="category_type"
              id="category_type"
              onChange={handleChangeSmth}
              defaultValue="Men"
            >
              <option>Men</option>
              <option>Women</option>
            </Input>
            <Label for="new-product">Label</Label>
            <Input
              type="select"
              className="form-control"
              name="label"
              id="label"
              onChange={handleChangeSmth}
              defaultValue="O"
            >
              <option>O</option>
              <option>P</option>
              <option>S</option>
              <option>D</option>
            </Input>
            <Label for="new-product">Description</Label>
            <input
              onChange={handleChangeSmth}
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
              <Col sm={12}>
                <Input
                  id="image"
                  type="file"
                  name="file"
                  onChange={handleChangeImage}
                  className="form-control"
                  placeholder="image"
                />
                <FormText color="muted">
                  Please, choose the file again!!
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

export const ModalEdit = (props) => {
  const { buttonLabel, className } = props;
  const {
    task,
    startEdit,
    handleSubmit,
    activeItem,
    handleChangeSmth,
    handleChangeTitle,
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
        color='secondary'
        onClick={() => {
          startEdit(task);
          toggle();
        }}
        style={{width: 55, marginRight: 5}}
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
            <Row>
              <Col md={6}>
                <Label for="new-product">Price</Label>
                <input
                  onChange={handleChangeSmth}
                  className="form-control"
                  id="price"
                  value={activeItem.price}
                  type="digit"
                  name="price"
                  placeholder="0.00"
                />
              </Col>
              <Col md={6}>
                <Label for="new-product">Discount price</Label>
                <input
                  onChange={handleChangeSmth}
                  className="form-control"
                  id="discount_price"
                  value={activeItem.discount_price}
                  type="digit"
                  name="discount_price"
                  placeholder="0.00"
                />
              </Col>
            </Row>
            <Label for="new-product">Category</Label>
            <Input
              type="select"
              className="form-control"
              name="category"
              id="category"
              onChange={handleChangeSmth}
            >
              <option>Coats</option>
              <option>Jackets</option>
              <option>Shirts</option>
              <option>T-shirts</option>
              <option>Sport wear</option>
              <option>Shoes</option>
              <option>Hats</option>
              <option>Outwear</option>
            </Input>
            <Label for="new-product">Category type</Label>
            <Input
              type="select"
              className="form-control"
              name="category_type"
              id="category_type"
              onChange={handleChangeSmth}
              defaultValue="Men"
            >
              <option>Men</option>
              <option>Women</option>
            </Input>
            <Label for="new-product">Label</Label>
            <Input
              type="select"
              className="form-control"
              name="label"
              id="label"
              onChange={handleChangeSmth}
              defaultValue="O"
            >
              <option>O</option>
              <option>P</option>
              <option>S</option>
              <option>D</option>
            </Input>
            <Label for="new-product">Description</Label>
            <input
              onChange={handleChangeSmth}
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
              <Col sm={12}>
                <Input
                  id="image"
                  type="file"
                  name="file"
                  onChange={handleChangeImage}
                  className="form-control"
                  placeholder="image"
                />
                <FormText color="muted">
                  Please, choose the file again!!
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
      <Button color="danger" onClick={toggle} style={{width: 65}}>
        Delete
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>
          Are You really want to delete {task.title}?
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
