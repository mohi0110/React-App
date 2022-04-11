import React, {
  useState,
  useEffect,
  createContext,
  useCallback,
  useMemo,
} from 'react';
import RentalData from '../../DataStructure/Data.json';
import BookItems from './book';
import Rental from './rental';
import RentalSearch from './search';
import ReturnItem from './returnProd';
import ErrorBoundary from './errorHandle';
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
  const [usedMileage, setMileage] = useState(0);
  const [reProd, setRePro] = useState({});
  const [invoice, setInvoice] = useState({ mileage: Number, total: Number });
  const [showReturnForm, setShowReturnform] = useState(true);

  // enable below to reset Local storage
  //localStorage.removeItem('RentedProdTable');
  //localStorage.removeItem('orginData');

  localStorage.getItem('orginData') === null &&
    localStorage.setItem('orginData', JSON.stringify(RentalData));

  useEffect(() => {
    let localData = JSON.parse(localStorage.getItem('RentedProdTable'));
    setRentedList(localData);
    setAllProdList(JSON.parse(localStorage.getItem('orginData')));
  }, []);

  // DISPLAY DATA AND SEARCH ********************************

  const productData = useMemo(() => {
    let displayData = allProdList;
    if (searchTextbox) {
      displayData = displayData.filter((data) =>
        data.name.toLowerCase().includes(searchTextbox)
      );
    }
    return displayData;
  }, [allProdList, searchTextbox]);

  const handleSearch = useCallback(
    (e) => {
      setSearchTextbox(e.target.value);
    },
    [setSearchTextbox]
  );

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
    [setErrorMsg, setValidationErr, selectedProd]
  );

  const handleToDate = useCallback(
    (e) => {
      let frmDate = new Date(
        new Date(selectedProd.from_date).toLocaleDateString()
      );
      let toDate = new Date(new Date(e.target.value).toLocaleDateString());

      if (selectedProd.from_date === undefined || frmDate > toDate) {
        setValidationErr(true);
        setErrorMsg('choose valid Date');
      } else {
        setValidationErr(false);
        setErrorMsg('');
      }
      let updateSelProd = { ...selectedProd, to_date: e.target.value };
      setSelectedProd(updateSelProd);
    },
    [selectedProd, setValidationErr, setErrorMsg]
  );

  const onChangeProdList = useCallback(
    (e) => {
      setValidationErr(false);
      const extractProd = allProdList.filter(
        (data) => data.code === e.target.value
      )[0];
      let updateSelProd = { ...selectedProd, ...extractProd };
      setSelectedProd(updateSelProd);
    },
    [allProdList, selectedProd]
  );

  const handleBookItem = useCallback(() => {
    if (Object.keys(selectedProd).length !== 0) {
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
    } else {
      setValidationErr(true);
      setErrorMsg('Choose Product');
    }
  }, [setValidationErr, selectedProd, setErrorMsg]);

  const handleCancelBooking = useCallback(() => {
    setValidationErr(false);
    setSelectedProd({});
    setMileage(0);
    setTimeout(() => {
      setShowBookform(true);
      setShowReturnform(true);
    }, 1000);
  }, [
    setValidationErr,
    setSelectedProd,
    setMileage,
    setShowBookform,
    setShowReturnform,
  ]);

  const handleItemSubmit = (event) => {
    let uploadSelectedItem = rentedList
      ? [...rentedList, selectedProd]
      : [selectedProd];
    localStorage.setItem('RentedProdTable', JSON.stringify(uploadSelectedItem));
    let copyAllProd = [...allProdList];

    let itemIndex = copyAllProd.findIndex(
      (data) => data.code === selectedProd.code
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
    [setMileage]
  );

  const onChangeReturnProd = (e) => {
    setRePro(rentedList.filter((item) => item.code === e.target.value)[0]);
  };
  const handleReturnItem = () => {
    if (reProd && Object.keys(reProd).length !== 0) {
      let todayDate = new Date(new Date().toDateString());
      let purchaseDate = new Date(new Date(reProd.from_date).toDateString());
      let duration = Math.round(
        Math.abs(
          (new Date(purchaseDate) - new Date(todayDate)) / (24 * 60 * 60 * 1000)
        )
      );
      let totalAmt =
        reProd.minimum_rent_period > duration
          ? reProd.minimum_rent_period * reProd.price
          : duration * reProd.price;

      let totalMi = usedMileage !== 0 ? usedMileage : duration * 20;
      debugger;
      setInvoice({ mileage: totalMi, total: totalAmt });
      setShowReturnform(false);
    }
  };

  const submitReturnItem = (event) => {
    let uploadSelectedItem = rentedList.filter(
      (items) => items.code !== reProd.code
    );
    localStorage.setItem('RentedProdTable', JSON.stringify(uploadSelectedItem));
    let copyAllProd = [...allProdList];
    let itemIndex = copyAllProd.findIndex((data) => data.code === reProd.code);
    copyAllProd[itemIndex].availability = true;
    copyAllProd[itemIndex].mileage = usedMileage;
    localStorage.setItem('orginData', JSON.stringify(copyAllProd));
    event.preventDefault();
  };

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          <div className="col-8">
            <h3>Rental App</h3>
          </div>
          <div className="col-4">
            <ErrorBoundary>
              <RentalSearch
                searchText={searchTextbox}
                handleSearch={handleSearch}></RentalSearch>
            </ErrorBoundary>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <ErrorBoundary>
              <Rental rentedList={productData}></Rental>{' '}
            </ErrorBoundary>
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
                onChangeReturnProd: onChangeReturnProd,
                handleReturnItem: handleReturnItem,
                showReturnForm: showReturnForm,
                invoice: invoice,
                submitReturnItem: submitReturnItem,
              }}>
              <ErrorBoundary>
                <ReturnItem></ReturnItem>
              </ErrorBoundary>
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
              <ErrorBoundary>
                <BookItems></BookItems>
              </ErrorBoundary>
            </BookContext.Provider>
          </div>
        </div>
      </div>
    </>
  );
}

export default RentalIndex;
