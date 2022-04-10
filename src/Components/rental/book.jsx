import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import ModalHOC from './modalHoc';
import { BookContext } from './Index';

function BookItems({ handleBookModal, handleCloseModal }) {
  const bkContext = useContext(BookContext);

  return (
    <>
      <form>
        {bkContext.showBookForm ? (
          <div className="container">
            {bkContext.isValidationErr && (
              <div className="alert alert-danger" role="alert">
                {bkContext.errorMsg}
              </div>
            )}
            <div className="mb-3 row">
              <label htmlFor="prodName" className="col-sm-4 col-form-label">
                Product
              </label>
              <div className="col-sm-8">
                <select
                  id="prodName"
                  className="form-select"
                  aria-label="Default select example"
                  onChange={bkContext.onChangeProdList}>
                  <option defaultValue="Choose Product">Choose Product</option>
                  {bkContext.allProdList
                    .filter((data) => data.availability)
                    .map((items) => (
                      <option key={items.code} value={items.code}>
                        {items.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="mileage" className="col-sm-4 col-form-label">
                Mileage
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="mileage"
                  value={
                    bkContext.selectedProd && bkContext.selectedProd.mileage
                      ? bkContext.selectedProd.mileage
                      : 0
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label htmlFor="price" className="col-sm-4 col-form-label">
                Price
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="price"
                  value={
                    bkContext.selectedProd && bkContext.selectedProd.price
                      ? bkContext.selectedProd.price
                      : 0
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="needing_repair"
                className="col-sm-4 col-form-label">
                Need to Fix ?
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="needing_repair"
                  value={
                    bkContext.selectedProd &&
                    bkContext.selectedProd.needing_repair
                      ? 'Yes'
                      : 'No'
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="needing_repair"
                className="col-sm-4 col-form-label">
                Min Rental Period
              </label>
              <div className="col-sm-8">
                <input
                  type="text"
                  readOnly
                  className="form-control-plaintext"
                  id="needing_repair"
                  value={
                    bkContext.selectedProd &&
                    bkContext.selectedProd.minimum_rent_period
                      ? bkContext.selectedProd.minimum_rent_period
                      : 0
                  }
                />
              </div>
            </div>
            <div className="mb-3 row">
              <label
                htmlFor="needing_repair"
                className="col-sm-4 col-form-label">
                Rental Period
              </label>
              <div className="col-sm-8">
                <Form.Group controlId="from">
                  <Form.Label>from</Form.Label>
                  <Form.Control
                    type="date"
                    name="from"
                    placeholder="From Date"
                    onChange={bkContext.handleFromDate}
                  />
                </Form.Group>
                <Form.Group controlId="to">
                  <Form.Label>To</Form.Label>
                  <Form.Control
                    type="date"
                    name="to"
                    placeholder="To Date"
                    onChange={bkContext.handleToDate}
                  />
                </Form.Group>
              </div>
            </div>
            <div className="row">
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary m-1"
                  onClick={() => {
                    handleCloseModal();
                    bkContext.handleCancelBooking();
                  }}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary m-1"
                  onClick={bkContext.handleBookItem}>
                  Book
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="row">
            <div className="col">
              <p>
                Your Estimated Price is{' '}
                <b>
                  $
                  {bkContext.selectedProd.rental_fees
                    ? bkContext.selectedProd.rental_fees
                    : 0}
                </b>
              </p>
              <p>Do you want to proceed?</p>
            </div>

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary m-1"
                onClick={() => {
                  handleCloseModal();
                  bkContext.handleCancelBooking();
                }}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary m-1"
                onClick={() => {
                  handleCloseModal();
                  bkContext.handleItemSubmit();
                }}>
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
  modalName: 'Book a Product',
  buttonName: 'Book',
  buttonClass: 'btn btn-primary m-1',
})(BookItems);
