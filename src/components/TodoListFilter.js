import { useRecoilState } from "recoil"
import { todoListFilterState } from "../atom/todoList"

export const TodoListFilter = () => {
  const [filter, setFilter] = useRecoilState(todoListFilterState);

  const updateFilter = ({target:{value}}) => {
    setFilter(value)
  }
  return(
    <>
      <label htmlFor="filter">Filter</label>
      <select name="filter" value={filter} onChange={updateFilter}>
        <option value="all">All</option>
        <option value="completed">Complete</option>
        <option value="unCompleted">Uncompleted</option>
      </select>
    </>
  )
}