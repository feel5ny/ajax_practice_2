# Backlog
backlog
* Eslint맞추서진행하기
* 주석작성하기

1. 환경셋팅
2. html layout짜기
3. Json 스키마 2가지 추가
4. server.js에서 스키마 조정
5. 기능 (및 프로세스)
    1. addBtn
        1. form이 리스트 하단에 추가
        2. 입력값을 받음
        3. check버튼 클릭
            1. input.value를 main.js에서 받음
            2. main.js에서 ajax.js를 이용해서 server.js에 post로 뿌림
            3. json에 추가
            4. 추가된 것 중 마지막 리스트만 하단에 넣어줌
                1. 혹은 다시 그려줘야하나?
        4. 입력도중 취소버튼 누르면 form태그 삭제됨
        * 고려해야할 부분
            1. 추가 등록 버튼 누르지 않은 상태에서 새로고침을 누를 경우 다시 reload
            2. 중간 번호가 삭제되면, 리스트 숫자중 가장 큰 숫자에 +1하여 등록할 수 있도록
                1. 그래야 마지막 리스트가 삭제 되어도 추가될 때 마지막 리스트의 번호+1이 된다.
            3. 글을 써주지 않을 경우 (title value가 없을 경우)
                1. title input이 focus되면서, placeholder로 메세지 알림
            4. Price가 입력될 때 000앞에 쉼표 넣기
    2. editBtn
        1. 프로세스
            1. 해당 value값이 들어있는 form태그가 그려짐
            2. 수정 후에 다시 json에 put으로 넘김
            3. 넘긴 json중 해당 데이터를 뿌림
        2. 고려해야할 사항
            1. 버튼 누르면, cancel 버튼 활성화
                1. tbody에 이벤트핸들러를 달아놓고 
                2. 이벤트객체의 타겟 : 이벤트를 발생시킨 놈
                    1. e.target.nodeName : 태그네임
                3. data-item으로 id값을 셀렉한다.
                4. e.target.dataset.type(type혹은 item)
                5. type에 따라서 작동할 수 있도록 switch사용
    3. delBtn
        1. 해당 리스트 filter로 삭제
---
참고
1. init_ Ajax콜을 진행한다. (table구조를 렌더) 
2. bindBooksToDom() (react는 이 행위를 자동으로 해준다) : 상태와 dom을 일치시켜주는 역할
3. makeHtmlTableRow > 2가지 경우를 둔다. (수정할때와 안할때. 이걸 가르는 기준은 editable)
4. 수정버튼 : 이벤트 델리게이션
    1. tbody에 이벤트핸들러를 달아놓고 
    2. 이벤트객체의 타겟 : 이벤트를 발생시킨 놈
        1. e.target.nodeName : 태그네임
    3. data-item으로 id값을 셀렉한다.
    4. e.target.dataset.type(type혹은 item)
    5. type에 따라서 작동할 수 있도록 switch사용
    6. add할때 아무것도 안넣을 경우 title input에 focus


<hr>
# 1. Front-end Set-up

## 1.1 Dependency

- Webpack
- Babel
- [Babel polyfill](https://babeljs.io/docs/usage/polyfill/)
- Sass

```bash
$ npm init -y

# eslint
$ eslint --init
$ npm install eslint-plugin-html --save-dev

# babel
$ npm install babel-cli babel-preset-env --save-dev
# polyfill은 소스코드 이전에 실행되어야 한다. 따라서 devDependency가 아닌 dependency로 설치하여야 한다.
# polyfill 적용: js entry point의 가장 선두에 import 또는 webpack.config.js의 bundle 프로퍼티에 추가
$ npm install babel-polyfill

# webpack
$ npm install webpack babel-loader node-sass css-loader sass-loader style-loader file-loader extract-text-webpack-plugin --save-dev
```

## 1.2 Configuration

**webpack.config.js**

```javascript
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: ['babel-polyfill', './src/js/main.js', './src/sass/style.scss']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loaders: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader?outputStyle=expanded']
        }),
        exclude: /node_modules/
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              // css내의 path: publicPath + outputPath => ../assets/fonts/
              publicPath: '../',
              outputPath: 'assets/fonts/'
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({ // define where to save the file
      filename: 'css/[name].bundle.css',
      allChunks: true
    })
  ],
  devtool: 'source-map'
};
```

**package.json**

```json
  ...
  "scripts": {
    "build": "webpack -w"
  },
```

## 1.3 TEST Files

TEST를 위한 파일 구조

```
/
├── src/
│   ├── assets/
│   │   └── font/
│   │       ├── Roboto-Regular-webfont.eot
│   │       ├── Roboto-Regular-webfont.ttf
│   │       └── Roboto-Regular-webfont.woff
│   ├── js/
│   │   ├── lib.js
│   │   └── main.js
│   └── sass/
│       ├── partial/
│       │   ├── _body.scss
│       │   └── _font.scss
│       └── style.scss
└── index.html
```

**index.html**

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <link rel="stylesheet" href="public/css/app.bundle.css">
  <script src="public/js/app.bundle.js" defer></script>
</head>
<body>
  <h1 id="res">Hello world</h1>
</body>
</html>
```

**src/sass/partial/_body.scss**

```scss
body {
  font-family: 'RobotoNormal', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

**src/sass/partial/_font.scss**

src/assets/fonts 폴더에 Roboto-Regular-webfont.eot, Roboto-Regular-webfont.ttf, Roboto-Regular-webfont.woff 파일이 존재하여야 한다.

```scss
@font-face {
  font-family: 'RobotoNormal';
  src: url('../assets/fonts/Roboto-Regular-webfont.eot');
  src: url('../assets/fonts/Roboto-Regular-webfont.eot?#iefix') format('embedded-opentype'),
       url('../assets/fonts/Roboto-Regular-webfont.woff') format('woff'),
       url('../assets/fonts/Roboto-Regular-webfont.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
```

**src/sass/style.scss**

```scss
@import "partial/_font";
@import "partial/_body";

$res-color: #6900FF;
#res {
  color: $res-color;
}
```

**src/js/lib.js**

```javascript
export default function (x) {
  return x * x;
}
```

**src/js/main.js**

```javascript
import square from './lib';

console.log(square(3)); // 9

let html = '';
square(3) === 9 ? html = 'Webpack is working!' : html = 'Somethig wrong!';

document.getElementById('res').innerHTML = html;
```

## 1.4 Build

```bash
$ npm run build
```

Build 결과 생성된 파일 구조

```
/
├── public/
│   ├── asserts/
│   │   └── font/
│   │       ├── Roboto-Regular-webfont.eot
│   │       ├── Roboto-Regular-webfont.ttf
│   │       └── Roboto-Regular-webfont.woff
│   ├── css/
│   │   ├── app.bundle.css
│   │   └── app.bundle.css.map
│   ├── js/
│   │   ├── app.bundle.js
│   │   └── app.bundle.js.map
├── src/
│   ├── asserts/
│   │   └── font/
│   │       ├── Roboto-Regular-webfont.eot
│   │       ├── Roboto-Regular-webfont.ttf
│   │       └── Roboto-Regular-webfont.woff
│   ├── js/
│   │   ├── lib.js
│   │   └── main.js
│   └── sass/
│       ├── partial/
│       │   ├── _body.scss
│       │   └── _font.scss
│       └── style.scss
└── index.html
```

# 2. Back-end Set-up

## 2.1 Dependency

- express
- body-parser
- express-handlebars

```bash
$ npm install nodemon -g

$ npm install express body-parser express-handlebars
```

## 2.2 Configuration

**package.json**

```json
  ...
  "scripts": {
    "build": "webpack -w",
    "start": "nodemon server.js --ignore 'data/*'"
  },
```

**JSON DB**

/data/users.json

```json
{
  "users": [
    {
      "userid": "ungmo2@gmail.com",
      "password": "1234",
      "firstname": "Ung-mo",
      "lastname": "Lee"
    },
    {
      "userid": "user@somewhere.com",
      "password": "ps1000",
      "firstname": "",
      "lastname": ""
    }
  ]
}
```

## 2.3 server.js 작성

### 2.3.1 GET User

```
GET /users
GET /users/:userid
```

### 2.3.2 CREATE User

```
POST /users
```

### 2.3.3 Update user

```
PUT /users/:userid
```

### 2.3.4 DELETE User

```
DELETE /users/:userid
```

## 2.4 Serve

```bash
$ npm start
```

[http://localhost:3000](http://localhost:3000)

# 3. Request



array.some(user => user.userid !== userid)
조건에 부합하는 요소가 하나라도 있으면 true를 반환하는 메소드