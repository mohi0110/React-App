import React from 'react';
import { Button, Modal } from 'react-bootstrap';
const ModalHOC = (modalName, btnName, btnClass, WrappedComponent) => {
  class ModalWrap extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        viewModal: false,
      };
    }
    openModal = () => {
      this.setState({ viewModal: true });
    };
    closeModal = () => {
      this.setState({ viewModal: false });
    };

    render() {
      return (
        <>
          <button className={btnClass} onClick={this.openModal}>
            {btnName}
          </button>
          <Modal show={this.state.viewModal} onHide={this.closeModal}>
            <Modal.Header closeButton>{modalName}</Modal.Header>
            <Modal.Body>
              <WrappedComponent
                handleBookModal={this.openModal}
                handleCloseModal={this.closeModal}></WrappedComponent>
            </Modal.Body>
          </Modal>
        </>
      );
    }
  }
  return ModalWrap;
};

export default ModalHOC;
