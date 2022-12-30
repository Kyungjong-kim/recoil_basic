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
