import { useRecoilState } from "recoil"
import { todoListState } from "../atom/todoList"

export const TodoItem = ({item}) => {
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const index = todoList.findIndex((listItem)=> listItem === item);
  const editItemText = ({target:{value}}) => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      text: value
    });
    setTodoList(newList);
  }
  const toggleCompletation = () => {
    const newList = replaceItemAtIndex(todoList, index, {
      ...item,
      isComplete: !item.isComplete
    })
    setTodoList(newList);
  }
  const deleteItem = (index) => {
    const newList = removeItemAtIndex(todoList, index);
    setTodoList(newList);
  }
  return(
    <div>
      <input type="text" value={item.text} onChange={editItemText} />
      <input type="checkbox" checked={item.isComplete} onChange={toggleCompletation} />
      <button onClick={deleteItem}>delete</button>
    </div>
  )
}

function replaceItemAtIndex(list, index, newValue) {
  return [...list.slice(0, index), newValue, ...list.slice(index + 1)];
}
function removeItemAtIndex(list, index) {
  return [...list.slice(0, index), ...list.slice(index + 1)];
}