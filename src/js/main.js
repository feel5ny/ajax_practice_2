import Ajax from './ajax';

// inputs
const inputTitle = document.getElementById('titleForm');
const inputAuthor = document.getElementById('authorForm');
const inputPrice = document.getElementById('priceForm');

// class 생성하기
export default class BookList {
  constructor(){
    this.url = '/books';
    this.books = [];
  }

  get lastBookId(){
    return !this.books.length ? 1 : Math.max(...this.books.map(({id}) => id)) + 1 ;
  }

  generateHTML({id, title, author, price, editable}){
    // const insertList = document.getElementById('insetList');
    // ${~} : `인터폴레이션화`라고 한다.
    let str = '';
    const isEditable = editable || (editable === 'true');
    if (!isEditable){
      str = 
      `<tr class="row-${id}">
        <td class="collapsing">${id}</td> 
        <td colspan="2">${title}</td>
        <td colspan="2">${author}</td>
        <td colspan="2">${price}</td>
        <td colspan="2">
          <div class="ui olive inverted buttons">
            <button class="ui olive inverted button" data-item="${id}" data-type="edit">&#9997;</button>
            <button class="ui button" data-item="${id}" data-type="delete">&#128078;</button>
          </div>
        </div>
        </td>
      </tr>`

    } else {
      str = `
      <tr class="row-${id}">
        <td class="collapsing">${id}</td>
        <td colspan="2">
          <div class="ui form">
            <input type="text" id="titleForm" name = "title" value ="${title}">
          </div>
        </td>
        <td colspan="2">
          <div class="ui form">
            <input type="text" id="authorForm" name = "author" value ="${author}">
          </div>
        </td>
        <td colspan="2">
          <div class="ui form">
            <input type="text" id="priceForm" name = "price" value ="${price}">
          </div>  
        </td>
        <td colspan="2">
          <div class="ui olive inverted buttons">
            <button class="ui olive inverted button" id="" data-item="${id}" data-type="save">&#10004;</button>
            <button class="ui olive inverted button" id="cancleBtn" data-item="${id}" data-type="cancel" >&#9997;</button>
            <button class="ui button" id ="delBtn" data-item="${id}" data-type="delete">&#128078;</button>
          </div>
        </td>
      </tr>`
    }
    
    return str;
    // if
  }

  bindBooksToDom(){
    // innderHTML아니라 insertAdjacentHTML로 하면 뒤에 자꾸 추가가된다.
    // console.log(this.books);
    document.getElementById('insertList').innerHTML = 
    this.books.map(({id, title, author, price, editable}) => this.generateHTML({id, title, author, price, editable})).join('')
  }

  // 맨 처음에 그려지는 메서드
  init() {
    Ajax.get(this.url).then(data => {
      this.books = JSON.parse(data); //this.books에는 배열객체가 담아지게 된다.
      this.bindBooksToDom();
      bookList.bindEvent();
      // console.log(this.books);
      // join은 배열화되어있는 전체 데이터를 문자열화한다.
      // map의 리턴값은 배열. 배열들을 순수한 string으로 받는다.
      // console.log(html);
    });
  }

  // 이벤트만 묶어둠.
  bindEvent(){
    // add 버튼
    document.getElementById('addBtn').addEventListener('click', () => {
      // 새로운 row를 추가하고. 추가된 row는 입력이 가능한 상태이여야 한다.
      // 배열의 마지막 요소에 새로운 data를 갖고 있는 html을 push해 준다.
      this.books.push({
        id: this.lastBookId, 
        title: '',
        author: '',
        price: '',
        editable: true, 
        status: 'new' // 갱신은 'edit', 신규는 'new' // 나누는 이유는 edit은 put 신규는 post
      })

      // console.log(this.books);
      this.bindBooksToDom();
    })

    document.getElementById('insertList').addEventListener('click', e=> {
      if(!e.target || e.target.nodeName !== 'BUTTON') return;
      const dataId = e.target.dataset.item*1;
      // console.log(dataId);
      const {type} = e.target.dataset
      // console.log(dataId, type)
      switch (type) {
        // edit 버튼 이벤트 핸들러
        case 'edit': {
          // 해당 row의 editable을 true로 만들어줌.
          this.books.find(e => e.id === dataId).editable = true
          this.books.find(e => e.id === dataId).status = 'edit'
          this.bindBooksToDom();
          break;
        }
        case 'save': {
          const inputTitle = document.getElementById('titleForm');
          const inputAuthor = document.getElementById('authorForm');
          const inputPrice = document.getElementById('priceForm'); 
          const status = this.books.find(e => e.id === dataId).status
          const editData = {
            id: dataId,
            title: inputTitle.value, 
            author: inputAuthor.value, 
            price: inputPrice.value,
            editable: false,
            status: ''
          }

          if(status ==='edit'){
            // .status
            Ajax.put(this.url, dataId, editData)
              .then(data => {
                this.books = JSON.parse(data).books;
                // 이상합니다 ㅠㅠ sever.js를 고쳤어요
              this.bindBooksToDom();
            });
            // this.books = JSON.parse(data); 
          } else if(status === 'new'){
            // 1. 폼에서 새로운 값을 받는다.
            // 1-1. title 폼이 null일 경우 placeholder하이라이트, focus.
            // 2. post로 보내준다. url, data
            // 3. 다시 새롭게 그려준다.
            if(!inputTitle.value){
              // alert('동작');
              
            }
            Ajax.post(this.url, editData)

          }
          break;
        }
        case 'delete': {
          console.log("delete 출력")
          break;
        }
        case 'cancel': {
          console.log("cancel 출력")
          break;
        }
        default:
          break;
      }
      
    })
  }


}


const bookList = new BookList() ; // 인스턴스 생성
bookList.init(); //init이라는 메서드로 호출 // 데이터를 갖고 와서 innterhtml까지 해주는 방법





/*
// buttons
const addBtn = document.getElementById('addBtn')

// insetList
const insertList = document.querySelector('#insetList')


function insertListForm(num){
  let str = `
    <tr>
      <td class="collapsing">${num}</td>
      <td colspan="2">
        <div class="ui form">
          <input type="text" id="titleForm">
        </div>
      </td>
      <td colspan="2">
        <div class="ui form">
          <input type="text" id="authorForm">
        </div>
      </td>
      <td colspan="2">
        <div class="ui form">
          <input type="text" id="priceForm">
        </div>  
      </td>
      <td colspan="2">
        <div class="ui olive inverted buttons">
          <button class="ui olive inverted button">&#9997;</button>
          <button class="ui button">&#128078;</button>
        </div>
      </td>
    </tr>`
  
  insertList.insertAdjacentHTML('beforeend', str);

}

addBtn.addEventListener('click', insertListForm)
*/







// // buttons
// const getBtn = document.getElementById('get');
// const postBtn = document.getElementById('post');
// const putBtn = document.getElementById('put');
// const deleteBtn = document.getElementById('del');

// // innerTEXT
// const codeView = document.getElementById('viewer');
// const message = document.getElementById('message');


// // result
// function render (data) {
//   codeView.innerHTML = JSON.stringify(JSON.parse(data), null, 2);
// }
// function msg (data) {
//   message.innerHTML = data;
// }
// function emailMsg (data) {
//   message.innerHTML = data;
// }

// // getBtn
// getBtn.addEventListener('click', () => {  
//   const userid = inputUserid.value;
//   const password = inputPassword.value;
//   const checkEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
//   const checkPw = /^[A-Za-z0-9]{4,10}$/;
//   if (!userid || !userid.match(checkEmail) || !password.match(checkPw)) return msg('이메일 형식을 맞추고, 비밀번호는 영문숫자조합 4~10자리로 입력하세요');
//   Ajax.get(`/users/${userid}`)
//     .then(msg('')) // '다시 입력하세요 메세지가 있는 경우 지워줌'
//     .then(data => render(data))
// })

// // postBtn
// postBtn.addEventListener('click', () => {
//   const userid = inputUserid.value;
//   const password = inputPassword.value;
//   const firstname = inputFirstname.value;
//   const lastname = inputLastname.value;  
//   const checkEmail =  /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
//   const checkPw = /^[A-Za-z0-9]{4,10}$/;

//   if (!userid || !userid.match(checkEmail) || !password.match(checkPw)) return msg('이메일 형식에 맞게 입력해야 등록됩니다');
  
//   Ajax.post('/users', { userid, password, firstname, lastname })
//     .then(msg(''))
//     .then(data => render(data));
// })

// putBtn.addEventListener('click', () => {
//   const userid = inputUserid.value;
//   const password = inputPassword.value;
//   const firstname = inputFirstname.value;
//   const lastname = inputLastname.value; 

//   if(!userid) return msg('등록했던 email을 입력해야합니다');
//   Ajax.put('/users', `${userid}`, { userid, password, firstname, lastname })
//     .then(msg(''))
//     .then(data => render(data));
// })

// deleteBtn.addEventListener('click', () => {
//   const userid = inputUserid.value;
//   if(!userid) return alert('userid를 입력하세요')
//   Ajax.delete('/users', `${userid}`)
//     .then(data => render(data))
// })