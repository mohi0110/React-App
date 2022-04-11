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
            <th scope="col">Availability</th>
            <th scope="col">Needing Repair</th>
            <th scope="col">Durability</th>
            <th scope="col">Max Durability</th>
            <th scope="col">Mileage</th>
            <th scope="col">Price</th>
            <th scope="col">Minimum Rent Period</th>
          </tr>
        </thead>
        <tbody>
          {rentedList ? (
            rentedList.map((item, index) => (
              <tr key={item.code}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.type}</td>
                <td>{item.availability ? 'Yes' : 'No'}</td>
                <td>{item.needing_repair ? 'Yes' : 'No'}</td>
                <td>{item.durability}</td>
                <td>{item.max_durability}</td>
                <td>{item.mileage ? item.mileage : 0}</td>
                <td>{item.price}</td>
                <td>{item.minimum_rent_period}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">
                <h5 className="text-center">No booked products</h5>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default React.memo(Rental);
