import React from 'react'
import { useForm } from 'react-hook-form'


const Search = ({ addTodo }) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

  return (
   
    <div className="todo-search">

          <form action="" onSubmit={handleSubmit((data) => {addTodo(data);
          reset()
          })}>
            <input type="text" id="task" placeholder="Enter Todo" { ...register("task", { required: true}, ) } />
            <input type="text" id="desc" placeholder="Enter Description" { ...register("description", { required: true}, ) } />
            <button className='btn'>Add</button>
          </form>
          {errors.task && <small>This field is required</small>}
          {errors.description && <small>Description is required</small>}
          
      </div>
        
  )
}

export default Search