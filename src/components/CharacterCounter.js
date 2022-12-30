import { atom, selector, useRecoilState, useRecoilValue } from "recoil"
/**
 * state 일부를 나타냄. 어떤 컴포넌트에서나 읽고 사용 가능
 * atom의 값을 읽는 컴포넌트는 암묵적으로 atom을 구독함
 * atom의 값이 바뀌면 해당 컴포넌트(구독중인)들은 재 랜더링 됨
 */ 
const textState = atom({
  key: 'textState',
  default: ''
});
/**
 * 셀렉터는 파생된 상태(state의 변화)를 나타냄
 * 순수함수에 전달된 상태의 변화된 결과물
 */
const charCountState = selector({
  key: 'charCountState',
  get: ({get}) => {
    const text = get(textState);
    return text.length;
  }
});

export const CharacterCounter = () => {
  return(
    <div>
      <TextInput />
      <CharacterCount />
    </div>
  )
}

function TextInput () {
  const [text, setText] = useRecoilState(textState);
  const onChange = (e) => {
    setText(e.target.value);
  }
  return(
    <div>
      <input type="text" value={text} onChange={onChange} />
      <br />
      <h1>{text}</h1>
    </div>
  )
}
function CharacterCount () {
  const count = useRecoilValue(charCountState);
  return <>
    Character Count : {count}
  </>
}