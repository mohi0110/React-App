import React, { useState, useEffect, createContext, useCallback } from 'react';
import RentalData from '../../DataStructure/Data.json';
import BookItems from './book';
import Rental from './rental';
import RentalSearch from './search';
import ReturnItem from './returnProd';
export const BookContext = createContext();
export const ReturnContext = createContext();

function RentalIndex() {
  const [allProdList, setAllProdList] = useState();
  const [isValidationErr, setValidationErr] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTextbox, setSearchTextbox] = useState('');
  const [selectedProd, setSelectedProd] = useState({});
  const [rentedList, setRentedList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookForm, setShowBookform] = useState(true);
  localStorage.getItem('orginData') == null &&
    localStorage.setItem('orginData', JSON.stringify(RentalData));

  useEffect(() => {
    let localData = JSON.parse(localStorage.getItem('RentedProdTable03'));
    setRentedList(localData);
    setAllProdList(JSON.parse(localStorage.getItem('orginData')));
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchTextbox(e.target.value);
    let localData = JSON.parse(localStorage.getItem('RentedProdTable03'));
    setRentedList(
      localData.filter((data) =>
        data.name.toLowerCase().includes(e.target.value)
      )
    );
  }, []);

  const handleFromDate = (e) => {
    let todayDate = new Date(new Date().toLocaleDateString());
    let frmDate = new Date(new Date(e.target.value).toLocaleDateString());

    if (todayDate <= frmDate) {
      setValidationErr(false);
      setErrorMsg('');
    } else {
      setValidationErr(true);
      setErrorMsg('choose valid Date');
    }
    let updateSelProd = { ...selectedProd, from_date: e.target.value };
    setSelectedProd(updateSelProd);
  };

  const handleToDate = (e) => {
    let frmDate = new Date(
      new Date(selectedProd.from_date).toLocaleDateString()
    );
    let toDate = new Date(new Date(e.target.value).toLocaleDateString());

    if (selectedProd.from_date == undefined || frmDate > toDate) {
      setValidationErr(true);
      setErrorMsg('choose valid Date');
    } else {
      setValidationErr(false);
      setErrorMsg('');
    }
    let updateSelProd = { ...selectedProd, to_date: e.target.value };
    setSelectedProd(updateSelProd);
  };

  const onChangeProdList = (e) => {
    const extractProd = allProdList.filter(
      (data) => data.code == e.target.value
    )[0];
    let updateSelProd = { ...selectedProd, ...extractProd };
    setSelectedProd(updateSelProd);
  };

  const handleBookItem = () => {
    let bookingDays = Math.round(
      Math.abs(
        (new Date(selectedProd.from_date) - new Date(selectedProd.to_date)) /
          (24 * 60 * 60 * 1000)
      )
    );

    if (selectedProd.minimum_rent_period < bookingDays) {
      setValidationErr(false);
      setErrorMsg('');
      let rentFees = bookingDays * selectedProd.price;
      let updateSelProd = {
        ...selectedProd,
        rental_fees: rentFees,
        rental_days: bookingDays,
      };
      setSelectedProd(updateSelProd);
      setShowBookform(false);
    } else {
      setValidationErr(true);
      setErrorMsg('choose date Greater than min Days');
    }
  };

  const handleCancelBooking = () => {
    setShowBookform(true);
    setSelectedProd({});
  };

  const handleItemSubmit = (e) => {
    let uploadSelectedItem = rentedList
      ? [...rentedList, selectedProd]
      : [selectedProd];
    localStorage.setItem(
      'RentedProdTable03',
      JSON.stringify(uploadSelectedItem)
    );
    let copyAllProd = [...allProdList];
    console.log('code', selectedProd.code);
    let itemIndex = copyAllProd.findIndex(
      (data) => data.code == selectedProd.code
    );
    copyAllProd[itemIndex].availability = false;
    localStorage.setItem('orginData', JSON.stringify(copyAllProd));
    setRentedList(JSON.parse(localStorage.getItem('RentedProdTable03')));
    setShowModal(false);
    setShowModal(!showModal);
    e.preventDefault();
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-8">
            <h3>Rental App</h3>
          </div>
          <div className="col-4">
            <RentalSearch
              searchText={searchTextbox}
              handleSearch={handleSearch}></RentalSearch>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Rental rentedList={rentedList}></Rental>
          </div>
        </div>
        <div className="row">
          <div className="d-flex justify-content-end">
            <ReturnContext.Provider value={rentedList}>
              <ReturnItem></ReturnItem>
            </ReturnContext.Provider>
            <BookContext.Provider
              value={{
                showBookForm: showBookForm,
                allProdList: allProdList,
                onChangeProdList: onChangeProdList,
                selectedProd: selectedProd,
                handleFromDate: handleFromDate,
                handleToDate: handleToDate,
                handleBookItem: handleBookItem,
                handleItemSubmit: handleItemSubmit,
                handleCancelBooking: handleCancelBooking,
                isValidationErr: isValidationErr,
                errorMsg: errorMsg,
              }}>
              <BookItems name="mohan"></BookItems>
            </BookContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}

export default RentalIndex;
