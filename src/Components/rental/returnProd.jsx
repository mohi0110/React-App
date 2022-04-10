import React, { useContext } from 'react';
import { Form } from 'react-bootstrap';
import ModalHOC from './modalHoc';
import { ReturnContext } from './Index';
const btnName = 'Return';
const BtnClass = 'btn btn-danger m-1';
const modalName = 'Return Product';
function ReturnItem() {
  const rtnContext = useContext(ReturnContext);
  return (
    <>
      <form>
        <div className="mb-3 row">
          <label htmlFor="prodName" className="col-sm-4 col-form-label">
            Product
          </label>
          <div className="col-sm-8">
            <select id="RetrunProdName" className="form-select">
              <option defaultValue="Choose Product">Choose Product</option>
              {rtnContext.map((items) => (
                <option key={items.code} value={items.code}>
                  {items.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </>
  );
}

export default ModalHOC(modalName, btnName, BtnClass, ReturnItem);
