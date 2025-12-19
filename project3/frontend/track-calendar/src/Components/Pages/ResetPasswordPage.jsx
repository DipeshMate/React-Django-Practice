import React, {useState} from 'react'

const ResetPasswordPage = () => {
  const [formdata, setFormdata] = useState({ email: "" });
  const { email } = formdata;

  const handleChange = (e) => {
    setFormdata((prev)=>({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const newFormData = {email:""}
    setFormdata((prev) => ({ ...prev, [newFormData]: e.target.value }))
    console.log(formdata);
  }
  
  return (
    <div className='sign-in-container'>

      <form onSubmit={handleOnSubmit}>
        <h1>Reset Account Password</h1>
        <input
          type="text"
          name='email'
          onChange={handleChange}
          // value={state.email}
          placeholder='Enter Your Email'
        />
      <button type='submit'>Reset Password</button>
      </form>
    </div>
  )
}
export default ResetPasswordPage
