import React from 'react';

function RentalSearch({ searchText, handleSearch }) {
  return (
    <>
      <input
        type="email"
        className="form-control"
        id="exampleFormControlInput1"
        placeholder="Search Product"
        value={searchText}
        onChange={handleSearch}
      />
    </>
  );
}

export default React.memo(RentalSearch);
