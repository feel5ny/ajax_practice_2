프로젝트시 주의점
* 뭔가를 만들고, 진행할때 앞단계가 버그가 없어야 한다. 

따라하기
1. 엔트리 포인트
    1. webpack.config.js
    : patial을 import해주는 메인을 기술해준다.
```
entry: {
    app: ['babel-polyfill', './src/js/main.js', './src/sass/style.scss']
  },
```


미션1)
* data에서 모든 데이터를 끌고 온다.
* 데이터를 바탕으로 body 안에 들어갈 콘텐츠를 그려낸다.

  1. ajax 모듈을 만든다.
  2. bookslist를 컨츠롤하는 클래스를 만든다. 
    1. 멤버변수를 만든다.
    2. ES6의 클래스화.를 기억하자.


## 중간 review
통신할 때는 무조건 문자열로 왔다갔다 한다.!!
* 그래서 우리가 parse하고 stringify하는 것이다.
* get은 쿼리로 주소에 보내준다. post는 header에 담아서 보내준다.
> 우린 로직 설명이 너무나 부족했다
* 문자열이 원래는 통신할때 다루기 힘들었기 때문에. JSON을 만들고, parse와 stringify메소드를 만든 것이다.
* 데이터에서 갖고온 정보를 클라이언트 서버에서 관리하고 있어야한다.
정보(상태) : user의 인터렉션이 발생하면 `상태 변화`라고 한다.
* 상태를 감지할 수 있는 방법이 `event`이다.

정보 <-> DOM
* 상태 정보와 DOM(view)를 맞춰줘야할 때가 있다.
* 우리는 DOM과 model를 맞춰주는것이 프론트엔드의 역할이다.

class바디에는 메소드만 존재한다
* 

이벤트 델리게이션
* ... 알아들어야한다.
* 버블링이 디폴트다.(하부에서 상부)
* 현재 버튼은 tbody보다 하부에 있다. 버튼을 클릭하면 하부에서 상부로 올라오는데(버블링), 이때 올라오는 것을 잡는 것이다. (위에서 잡기 때문에) (와.. 시각적인 설명이 더 필요할 듯)

이벤트를 잡아내기
* 클릭시 콘솔에서 확인 가능한 요소) 
* moseEvent 내부 > target > tagName (td에서 발생시킨 이벤트만 잡기위해 사용한다.)
```js
(!e.target || e.target.nodeName !== 'BUTTON') return;
```

data minus
* data-type : type
* data-item : id
* 접근하는 방법
```js
// 접근하는 방법
node.dataset
e.target.dataset.item
```

버튼 조작방법
* flag만 바꿔주면 된다.
* 