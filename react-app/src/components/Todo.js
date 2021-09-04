import React, { useState, useEffect } from "react";
import APIHelper from "../APIHelper.js";
import Styled from "styled-components";
import "./Todo.css"
import Navbar from './Navbar';
import {ImCross} from "react-icons/all";

function Todo() {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState("");

    useEffect(() => {
        const fetchTodoAndSetTodos = async () => {
            const todos = await APIHelper.getAllTodos();
            setTodos(todos);
        };
        fetchTodoAndSetTodos();
    }, []);

    const createTodo = async e => {
        e.preventDefault();
        if (!todo) {
            alert("please enter something");
            return;
        }
        if (todos.some(({ task }) => task === todo)) {
            alert(`Task: ${todo} already exists`);
            return;
        }
        const newTodo = await APIHelper.createTodo(todo);
        console.log(newTodo);
        setTodos([...todos, newTodo]);
    };

    const deleteTodo = async (e, id) => {
        try {
            e.stopPropagation();
            await APIHelper.deleteTodo(id);
            setTodos(todos.filter(({ _id: i }) => id !== i));
        } catch (err) {}
    };

    const updateTodo = async (e, id) => {
        e.stopPropagation();
        const payload = {completed: !todos.find(todo => todo._id === id).completed}
        const updatedTodo  = await APIHelper.updateTodo(id, payload);
        setTodos(todos.map((todo)=> todo._id === id ? updatedTodo: todo));

    };

    return (
        <Wrapper>
            <Navbar/>
            <div>

                <section className="section-center">
                    <div className="form-control">
                        <input
                            type="text"
                            value={todo}
                            onChange={({target}) => setTodo(target.value)}
                            placeholder="Enter a todo"
                        />
                        <button type="button" onClick={createTodo}>
                            Add
                        </button>
                    </div>


            <ul>
                {todos.length ? todos.map(({ _id, task, completed }, i) => (
                    <li
                        key={i}
                        onClick={e => updateTodo(e, _id)}
                        className={completed ? "completed" : ""}
                    >
                        {task} <span onClick={e => deleteTodo(e, _id)}>  <ImCross className="cross" /> </span>
                    </li>
                )): <p>No Todos Yet :(</p>}
            </ul>
                </section >
            </div>

            </Wrapper>
    );
}

export default Todo;
const Wrapper = Styled.section`

.cross {
color: black;
}
.container{
  display: flex;
  flex-direction: column;
  
  font-family: Arial;

  button{
    all: unset;
    width: 100px;
    height: 35px;
    margin: 10px 10px 0 0;
    align-self: flex-end;
    background-color: #0041C2;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #0041C2;

    &:hover{
      background-color: #fff;
      color: #0041C2;
    }
  }

  >div{
    height: 100%;
    width: 100%;
    display: flex;
    font-size: 18px;
    justify-content: center;
    align-items: center;

    .content{
      display: flex;
      flex-direction: column;
      padding: 20px 100px;    
      box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.2);
      width: auto;
  
      img{
        height: 150px;
        width: 150px;
        border-radius: 50%;
      }
  
      >span:nth-child(2){
        margin-top: 20px;
        font-weight: bold;
      }
  
      >span:not(:nth-child(2)){
        margin-top: 8px;
        font-size: 14px;
      }
  
    }

  }
}
`;