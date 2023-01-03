# Recoil 기초 공부

## 2022.12.30 - todo 리스트 구현을 통한 recoil 구조 파악

- [x] 리코일 atom, selector를 통한 상태관리 이해
- [ ] 리코일 이론 정리 진행중.

## Recoil 개념

### atom

Recoil의 상태를 표현한다.\
atom() 함수는 쓰기가 가능한 RecoilState를 Return 한다.

> 구조

```javscript
function atom<T>({
  key:string,

  default: T | Promise<T> | RecoilValue<T>,

  effects_UNSTABLE?: $ReadOnlyArray<AtomEffect<T>>,

  dangerouslyAllowMutability?: boolean
})
```

- key - 내부적으로 atom을 식별하는데 사용되는 고유한 문자열. 앱 전체에서 다른 atom, selector에 대해 유일해야함.
- default - atom의 초기값, Promise, 동일한 타입 값을 나타내는 atom 이나 selector
- effects_UNSTABLE - atom을 위한 Atom Effects 배열 (심화 공부 필요)
- dangerouslyAllowMutability - 상태의 변화를 나타내지 않는 atom에 저장된 object의 변화를 허용해야 할때가 있음.
  개발 모드에서 동결 개체를 재정의하려면 이 옵션을 사용.

자주 사용되는 Hooks

- useRecoilState() : atom 을 읽고 쓰려고 할 때 사용함. atom에 컴포넌트를 등록하도록 한다.
- useRecoilValue() : atom 을 읽기만 할 때 사용 atom에 컴포넌트를 등록하도록 한다.
- useSetRecoilState() : atom 에 쓰기만 할 때 사용.
- useResetRecoilState() : atom을 초기화 할 때 사용.

\*\* 컴포넌트 등록 없이 atom의 값을 읽어야 하는 드문 케이스에서는 useRecoilCallback() 을 참조.

### selector

Selector 는 Recoil 에서 함수나 파생된 상태를 나타냄.
주어진 종속성 값에 대해 항상 동일한 값을 반환하는 순수함수.
get 함수만 제공될 때 Selector는 읽기만 가능한 RecoilValueReadOnly 객체를 반환.
set 함수도 제공되면 RecoilState를 반환한다.

> 구조

```javascript
function selector<T>({
  key: string,

  get: ({
    get: GetRecoilValue
  }) => T | Promise<T> | RecoilValue<T>,

  set?: (
    {
      get: GetRecoilValue,
      set: SetRecoilState,
      reset: ResetRecoilState,
    },
    newValue: T | DefaultValue,
  ) => void,

  dangerouslyAllowMutability?: boolean,
})

type ValueOrUpdater<T> =
  | T
  | DefaultValue
  | ((prevValue: T) => T | DefaultValue);
type GetRecoilValue = <T>(RecoilValue<T>) => T;
type SetRecoilState = <T>(RecoilState<T>, ValueOrUpdater<T>) => void;
type ResetRecoilState = <T>(RecoilState<T>) => void;

```

- get - 파생된 상태의 값. 직접 반환 되거나 Promise, 같은유형의 다른 atom, selector를 반환 할 수 있다.
  다른 atom, selector 값을 찾는 데 사용되는함수. 전달된 모든 atom,selector는 암시적으로 selector에 대한 의존성 목록에 추가됨.
  selector의 의존성이 변경되면 다시 평가된다.
- set - 사용시 selector는 쓰기 가능한 상태를 반환함. 첫번째 매개변수로 콜백객체와 새로 입력값이 전달된다.
- dangerouslyAllowMutability - Selector는 파생된 상태의 "순수 함수"를 나타내며 항상 동일한 의존성 입력 값 집합에 대하여 동일한 값을
  반환해야 한다.
  이를 보호하기 위해 selector에 저장된 모든 값은 기본적으로 고정되어 있다. 경우에 따라 이 옵션을 사용하여 재정의해야 할 수 있다.

```javascript
// Selector 정적 의존성
const staticSelector = selector({
  key: "StaticSelector",
  get: ({ get }) => get(myAtom) * 100,
});
// Selector 동적 의존성
const dynamicSelector = selector({
  key: "DynamicSelector",
  get: ({ get }) => {
    const toggle = get(toggleState);
    if (toggle) {
      return get(selectrorA);
    } else {
      return get(selectorB);
    }
  },
});
// Selector 쓰기가능
const proxySelector = selector({
  key: "ProxySelector",
  get: ({ get }) => ({ ...get(myAtom), extraField: "hi" }),
  set: ({ set }, newValue) => set(myAtom, newValue),
});
// 데이터를 변환시 DefaultValue 인지 확인이 필요함.
const transformSelector = selector({
  key: "TransformSelector",
  get: ({ get }) => get(myAtom) * 100,
  set: ({ set }, newValue) =>
    set(myAtom, newValue instanceof DefaultValue ? newValue : newValue / 100),
});
// 비동기 Selector
const myQuery = selector({
  key: "MyQuery",
  get: async ({ get }) => {
    return await myAsyncQuery(get(queryParamState));
  },
});
```

### Loadable

Loadable 객체는 Recoil atom, selector 등의 최신 상태를 처리함.

- state: atom 또는 selector 의 최신상태. 가능한 값은 ['hasValue', 'hasError', 'loading'].
- contents: Loadable에 의해 대표되는 값. 상태가 hasValue 면 실제값을 표현. hasError는 throw 된 Error 상태를 표시.
  loading이라면 toPromise()를 사용해 Promise를 얻을 수 있음.

```javascript
function UserInfo({ userID }) {
  const userNameLoadable = useRecoilValueLoadable(userNameQuery(userID));
  switch (userNameLoadable.state) {
    case "hasValue":
      return <div>{userNameLoadable.contents}</div>;
    case "loading":
      return <div>Loading...</div>;
    case "hasError":
      throw userNameLoadable.contents;
  }
}
```
