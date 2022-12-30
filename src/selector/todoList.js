import { selector } from "recoil";
import { todoListFilterState, todoListState } from "../atom/todoList";

export const filteredTodoListState = selector({
  key:'filteredTodoListState',
  get: ({get}) => {
    const filter = get(todoListFilterState);
    const list = get(todoListState);

    switch(filter) {
      case 'completed' :
        return list.filter(item=>item.isComplete)
      case 'unCompleted' :
        return list.filter(item=>!item.isComplete)
      default :
        return list;
    }
  }
})

export const todoListStatusState = selector({
  key: 'todoListStatusState',
  get: ({get}) => {
    const todoList = get(todoListState);
    const totalNum = todoList.length;
    const totalCompletedNum = todoList.filter(item => item.isComplete).length;
    const totalUnCompletedNum = totalNum - totalCompletedNum;
    const percentageCompleted = totalNum === 0 ? 0 : totalCompletedNum / totalNum;

    return {
      totalNum, totalCompletedNum, totalUnCompletedNum, percentageCompleted
    }
  }
})