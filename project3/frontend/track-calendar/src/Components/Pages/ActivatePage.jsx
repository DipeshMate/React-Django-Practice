import React, {useState} from 'react'

const ActivatePage = () => {

  const handleOnSubmit = (e) => {
    e.preventDefault();

  }
  
  return (
    <div className='sign-in-container'>
      <form onSubmit={handleOnSubmit}>
        <h1>Activate Account</h1>
      <button>Activate</button>
      </form>
    </div>
  )
}
export default ActivatePage;
