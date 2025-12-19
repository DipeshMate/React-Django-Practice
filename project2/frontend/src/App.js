import './App.css';
import { useEffect, useState } from "react";
import Search from "./components/Search";
import TodoList from "./components/TodoList";
import Filter from "./components/Filter";
import axios from 'axios'

function App() {
  const [todos, setTodos] = useState([
    // { id: 0, task: "Learn JavaScript", status: "Active" },
    // { id: 1, task: "Read a self-help book", status: "Active" },
    // { id: 2, task: "Play PS5", status: "Active" },
    // { id: 3, task: "Watch YouTube videos", status: "Active" },
    // // { id: 5, task: "Pray to God", status: "Active" },
  ]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/todos')
      .then(response => {
       // console.log(response);
        setTodos(response.data)
      }).catch(err => setErrors(err.message))
  },[])


// add todo function
  const addTodo = (data) => {
    setTodos([...todos, data = { ...data, id: parseInt(todos[todos.length - 1]?.id || 0) + 1, status: "Active" }])
    axios.post('http://127.0.0.1:8000/todos', data)
    console.log(data)
  }

  // delete function
  const delTodo = (id) => {
    setTodos(todos.filter(todo => todo.id != id))
    axios.delete('http://127.0.0.1:8000/todos/' + id)
     .catch(err => setErrors(err.message))
  }


  // update function
  const updateTodo = (e, id, text, desc) => {
    e.preventDefault()
    // this line helps to get the current todo based on the ID called todoId in TodoList
    const todo = todos.find((t) => t.id === id);
    const updatedUser = { ...todo, task:text, description : desc,status:"Active" }
    setTodos(todos.map(t => t.id == todo.id ? updatedUser : t))
    axios.put('http://127.0.0.1:8000/todos/' + id, updatedUser)

  }

  const completeTodo = (e, id,text,desc) => {

    if(e.target.checked){
      console.log("okay")
      setTodos(todos.map(todo => todo.id == id ? { ...todo, status: "Completed" } : todo))
      axios.put('http://127.0.0.1:8000/todos/' + id, { id, task: text, description : desc, status:"Completed" })
    }
    else
    {
      console.log("omo")
      setTodos(todos.map(todo => todo.id == id ? { ...todo, status: "Active" } : todo))
      axios.put('http://127.0.0.1:8000/todos/' + id, { id, task: text, description : desc, status:"Active" })
    }

   
  }

  const filterTodo = (cat_value) => {
    // setTodos(todos.filter(todo => todo.status == cat_value))
    setTodos(todos.filter((todo) => todo.status == cat_value))
    axios.put('http://127.0.0.1:8000/todos', todos.filter((todo) => todo.status == cat_value))
  }

  return (
    <div className="App">
      <div className="todo-container">
        {errors && <p>{errors}</p>}
      <Search addTodo = { addTodo } />
      <Filter filter_todo = { filterTodo }/>
      <TodoList todos = { todos } delTodo = { delTodo } update_todo = { updateTodo } complete_todo = { completeTodo } filter_todo = { filterTodo } />
    </div>
    </div>
  );
}

export default App;
