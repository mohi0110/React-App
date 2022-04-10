import React from 'react';

function Rental({ rentedList }) {
  return (
    <>
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">S No</th>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Durability</th>
            <th scope="col">Mileage</th>
            <th scope="col">Status</th>
            <th scope="col">From Date</th>
            <th scope="col">To Date</th>
            <th scope="col">Rental Days</th>
            <th scope="col">Rental Fees</th>
          </tr>
        </thead>
        <tbody>
          {rentedList &&
            rentedList.map((item, index) => (
              <tr key={item.code}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.durability}</td>
                <td>{item.mileage ? item.mileage : 0}</td>
                <td>Rented</td>
                <td>{item.from_date}</td>
                <td>{item.to_date}</td>
                <td>{item.rental_days}</td>
                <td>{item.rental_fees}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default React.memo(Rental);
