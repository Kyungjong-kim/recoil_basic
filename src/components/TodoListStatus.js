import { useRecoilValue } from "recoil"
import { todoListStatusState } from "../selector/todoList"

export const TodoListStatus = () => {
  const {totalNum,totalCompletedNum,totalUnCompletedNum,percentageCompleted} = useRecoilValue(todoListStatusState);
  const calcPercentage = Math.round(percentageCompleted * 100);

  return (
    <ul>
      <li>Total Items: {totalNum}</li>
      <li>Total Completed: {totalCompletedNum}</li>
      <li>Total UnCompleted: {totalUnCompletedNum}</li>
      <li>Percentage of Completed: {calcPercentage}</li>
    </ul>
  )
}