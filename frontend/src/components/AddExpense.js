import React from 'react';

const AddExpense = () => {
  return (
    <div className='m-5 p-5 border border-dark-subtle rounded-4'>
      <form>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Amount
          </label>
          <input type="number" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">
            Tag
          </label>
          <input type="text" className="form-control" id="exampleInputPassword1" />
        </div>
        <div className="mb-3">
        <label for="exampleInputPassword1" className="form-label">
            Description
          </label>
          <input type="text" className="form-control" id="exampleInputPassword1" />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddExpense;
