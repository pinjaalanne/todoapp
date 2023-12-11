import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { FiCircle } from 'react-icons/fi';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [todoItem, setTodoItem] = useState('');
  const [error, setError] = useState(false);
  const [completedTasks, setCompletedTasks] = useState('');

  // Define a custom hook to get the todos from localStorage
  const useLocalStorage = (key, initialValue) => {
    // Get the stored value or the initial value
    const [storedValue, setStoredValue] = useState(() => {
      try {
        const item = localStorage.getItem.key;
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log(error);
        return initialValue;
      }
    });

    // Define a setter function that updates the state and the localStorage
    const setValue = (value) => {
      try {
        setStoredValue(value);
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.log(error);
      }
    };

    // Return the state and the setter function
    return [storedValue, setValue];
  };

  // Use the custom hook to get the todos from localStorage
  const [storedTodos, setStoredTodos] = useLocalStorage('todos', []);

  // Update the todos state when the storedTodos change
  useEffect(() => {
    setTodos(storedTodos);
  }, [storedTodos]);

  // Define a function to handle the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (todoItem) {
      setError(false);
      let uniqueId =
        new Date().getTime().toString(36) + new Date().getUTCMilliseconds();
      let newTodoItem = {
        id: uniqueId,
        todo: todoItem,
        complete: false,
      };
      // Update the storedTodos using the setter function
      setStoredTodos([newTodoItem, ...storedTodos]);
      setTodoItem('');
    } else {
      setError(true);
      setTodoItem('');
    }
  };

  // Define a function to delete a todo
  const deleteTodo = (id) => {
    Swal.fire({
      title: "Are you sure you want to delete?",
      background: "white",
      confirmButtonColor: '#38D08A',
      showDenyButton: true,
      confirmButtonText: 'Delete',
      denyButtonText: 'Cancel',
      customClass: {
        title: 'title'
      }
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "", "success");
        let newTodos = todos.filter((todo) => todo.id !== id);
        setStoredTodos([...newTodos]);
      } else if (result.isDenied) {
        Swal.fire("This to do was not deleted", "", "info");
      }
    });
    // Update the storedTodos using the setter function
  };

  // Define a function to toggle the completion status of a todo
  const toggleComplete = (id) => {
    // Map over the todos and update the complete property of the matching todo
    let newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, complete: !todo.complete };
      }
      return todo;
    });
    // Update the storedTodos using the setter function
    setStoredTodos([...newTodos]);
  };

  // Calculate the completed tasks using the todos state
  useEffect(() => {
    let completeArray = [];
    todos.filter((todo) => todo.complete === true && completeArray.push(todo));
    setCompletedTasks(completeArray.length);
  }, [todos]);

  // Clear the error message after 2 seconds
  useEffect(() => {
    let adderror = setTimeout(() => {
      setError(false);
    }, 2000);
    return () => {
      clearTimeout(adderror);
    };
  }, [error]);

  let Today = new Date().toLocaleDateString('en-us', { weekday: 'long' });
  let day = new Date().toLocaleDateString('en-us', { day: 'numeric' });
  let month = new Date().toLocaleDateString('en-us', { month: 'short' });

  return (
    <div className="app-container">
      <div className="header-section">
        <h4 className="date">
          {`${Today},`} <span>{`${day} ${month}`}</span>
        </h4>
        <div className="app-form-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={todoItem}
              className={error ? 'error' : ''}
              onChange={(e) => setTodoItem(e.target.value)}
              placeholder="Type Todo here..."
            />
            <button type="submit" className="btn">
              Add Todo
            </button>
          </form>
        </div>
        <div className="data-card-container">
          <div className="data-card">
            <h5>{todos.length < 10 ? `0${todos.length}` : todos.length}</h5>
            <p>Created tasks</p>
          </div>
          <div className="data-card">
            <h5>
              {completedTasks < 10 ? `0${completedTasks}` : completedTasks}
            </h5>
            <p>Completed tasks</p>
          </div>
        </div>
      </div>
      <div className="todo-container">
        {todos.map((todoItem) => {
          const { id, todo, complete } = todoItem;
          return (
            <div key={id} className="todo-card">
              <div className="icon" onClick={() => toggleComplete(id)}>
                {!complete ? (
                  <FiCircle />
                ) : (
                  <IoIosCheckmarkCircle
                    className={complete ? 'icon-done' : ''}
                  />
                )}
              </div>
              <p className={complete ? 'text-done' : ''}>{todo}</p>
              <MdDeleteForever
                onClick={() => deleteTodo(id)}
                className="icon delete-icon"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
