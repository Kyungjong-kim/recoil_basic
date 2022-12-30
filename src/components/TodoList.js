import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil"
import { todoListState } from "../atom/todoList";
import { filteredTodoListState } from "../selector/todoList";
import { TodoItem } from "./TodoItem";
import { TodoListFilter } from "./TodoListFilter";
import { TodoListStatus } from "./TodoListStatus";
export const TodoList = () => {
  const todolist = useRecoilValue(filteredTodoListState);
  return (
    <>
      <TodoListStatus />
      <TodoListFilter />
      
      <TodoCreator />
       
      { todolist.map(list=> <TodoItem key={list.id} item={list} />)}
    </>
  )
}
let id = 0;
const getId = () => {
  return id++;
}
function TodoCreator () {
  const [inputValue, setInputValue] = useState('');
  const setTodoList = useSetRecoilState(todoListState);

  const addList = () => {
    setTodoList((prevTodo) => [
      ...prevTodo, 
      { 
        id: getId(), 
        text: inputValue, 
        isComplete: false
      }
    ]);
    setInputValue('');
  }

  const onChange = ({target: {value}}) => {
    setInputValue(value);
  }

  return(
    <div>
      <input type="text" value={inputValue} onChange={onChange} />
      <button onClick={addList}>Add</button>
    </div>
  )
}