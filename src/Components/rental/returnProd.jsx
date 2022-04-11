import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import ModalHOC from './modalHoc';
import { ReturnContext } from './Index';

function ReturnItem({ handleCloseModal }) {
  const rtnContext = useContext(ReturnContext);

  return (
    <>
      <form
        id="returnForm"
        onSubmit={() => {
          rtnContext.submitReturnItem();
          handleCloseModal();
        }}>
        {rtnContext.showReturnForm ? (
          <div className="container">
            <div className="mb-3 row">
              <label htmlFor="prodName" className="col-sm-4 col-form-label">
                Product
              </label>
              <div className="col-sm-8">
                <select
                  id="RetrunProdName"
                  className="form-select"
                  onChange={rtnContext.onChangeReturnProd}>
                  <option defaultValue="Choose Product">Choose Product</option>
                  {rtnContext.rentedList &&
                    rtnContext.rentedList.map((items) => (
                      <option key={items.code} value={items.code}>
                        {items.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="price" className="col-sm-4 col-form-label">
                Used Mileage
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  className="form-control"
                  id="UsedMileage"
                  value={rtnContext.usedMileage}
                  onChange={rtnContext.handleUsedMileage}
                />
              </div>
            </div>
            <div className="row">
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary m-1"
                  onClick={() => {
                    handleCloseModal();
                    rtnContext.handleCancelBooking();
                  }}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger m-1"
                  onClick={rtnContext.handleReturnItem}>
                  Return
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="container">
            <div className="row">
              <p>
                Your Estimated price is <b>$ {rtnContext.invoice.total} </b>
              </p>
              <p>Do you want proceed ?</p>
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary m-1"
                onClick={() => {
                  handleCloseModal();
                  rtnContext.handleCancelBooking();
                }}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary m-1">
                Confirm
              </button>
            </div>
          </div>
        )}
      </form>
    </>
  );
}

export default ModalHOC({
  modalName: 'Return a Product',
  buttonName: 'Return',
  buttonClass: 'btn btn-danger m-1',
})(ReturnItem);
