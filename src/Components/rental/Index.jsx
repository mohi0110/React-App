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
  const [showBookForm, setShowBookform] = useState(true);
  const [usedMileage, setMileage] = useState(Number);

  //localStorage.removeItem('RentedProdTable');
  //localStorage.removeItem('orginData');
  localStorage.getItem('orginData') == null &&
    localStorage.setItem('orginData', JSON.stringify(RentalData));

  useEffect(() => {
    let localData = JSON.parse(localStorage.getItem('RentedProdTable'));
    setRentedList(localData);
    setAllProdList(JSON.parse(localStorage.getItem('orginData')));
  }, []);

  const handleSearch = (e) => {
    setSearchTextbox(e.target.value);
    let localData = JSON.parse(localStorage.getItem('RentedProdTable')).filter(
      (data) => data.name.toLowerCase().includes(e.target.value)
    );
    let uniqueData = [
      ...new Map(localData.map((items) => [items.code, items])).values(),
    ];
    setRentedList(uniqueData);
  };

  const handleFromDate = useCallback(
    (e) => {
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
    },
    [selectedProd, isValidationErr, errorMsg]
  );

  const handleToDate = useCallback(
    (e) => {
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
    },
    [selectedProd, isValidationErr, errorMsg]
  );

  const onChangeProdList = useCallback(
    (e) => {
      console.log('test');
      const extractProd = allProdList.filter(
        (data) => data.code == e.target.value
      )[0];
      let updateSelProd = { ...selectedProd, ...extractProd };
      setSelectedProd(updateSelProd);
    },
    [allProdList, selectedProd]
  );

  const handleBookItem = useCallback(() => {
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
  }, [showBookForm, selectedProd, isValidationErr, errorMsg]);

  const handleCancelBooking = useCallback(() => {
    setSelectedProd({});
    setMileage(0);
    setTimeout(() => {
      setShowBookform(true);
    }, 1000);
  }, [selectedProd, showBookForm]);

  const handleItemSubmit = (event) => {
    let uploadSelectedItem = rentedList
      ? [...rentedList, selectedProd]
      : [selectedProd];
    localStorage.setItem('RentedProdTable', JSON.stringify(uploadSelectedItem));
    let copyAllProd = [...allProdList];

    let itemIndex = copyAllProd.findIndex(
      (data) => data.code == selectedProd.code
    );
    copyAllProd[itemIndex].availability = false;
    localStorage.setItem('orginData', JSON.stringify(copyAllProd));
    setRentedList(JSON.parse(localStorage.getItem('RentedProdTable')));
    event.preventDefault();
  };

  const handleUsedMileage = useCallback(
    (e) => {
      setMileage(e.target.value);
    },
    [usedMileage]
  );

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
            <ReturnContext.Provider
              value={{
                rentedList: rentedList,
                handleUsedMileage: handleUsedMileage,
                usedMileage: usedMileage,
                handleCancelBooking: handleCancelBooking,
              }}>
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
              <BookItems></BookItems>
            </BookContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}

export default RentalIndex;
