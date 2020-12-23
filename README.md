# todoPlaces

<div style="display: flex">
<img width="500" height="350" src="https://user-images.githubusercontent.com/47317129/103020379-9eaf6e80-458b-11eb-82eb-fb8a7d8a3bd0.PNG">
<img width="500"  height="350" src="https://user-images.githubusercontent.com/47317129/103020283-76c00b00-458b-11eb-8095-d476d9e34c1a.PNG">
</div>

<!-- <img width="500" src="https://user-images.githubusercontent.com/47317129/103020372-9c4d1480-458b-11eb-9ee0-fd4d4e1d3161.PNG" style="display: block" > -->

## Inspiration

코로나 시대에 여행을 가지 못하게 되면서,
코로나가 끝나면 가고 싶은 곳을 공유하며 여행에 대한 갈증을 해소하고자 만든 어플리케이션입니다.

## What it does

가고 싶은 곳의 정보를 등록하면 구글 맵으로 해당 장소를 띄워줍니다.
다른 이들이 가고 싶은 장소도 볼 수 있습니다(간단한 반응형 작업도 완료했습니다).

<img width="500" src="https://user-images.githubusercontent.com/47317129/103020380-9f480500-458b-11eb-8e6a-25fb2a9aa454.PNG" style="display: block" >

- ###### 회원가입 및 로그인

<br><br>
<img width="500" src="https://user-images.githubusercontent.com/47317129/103020370-9bb47e00-458b-11eb-8597-e194e57c6515.PNG" style="display: block" >

- ###### 장소 등록

<br><br>

<div style="display: flex">
<img width="500" height="350" src="https://user-images.githubusercontent.com/47317129/103020381-9f480500-458b-11eb-8e67-ce67a5ff5009.PNG"  >
<img width="500" height="350" src="https://user-images.githubusercontent.com/47317129/103020379-9eaf6e80-458b-11eb-82eb-fb8a7d8a3bd0.PNG"  >
</div>

- ###### 유저 리스트 및 해당 유저가 올린 장소 확인

## How I built it

MERN: MongoDB, Express, React.js, Node.js 조합으로 만든 어플리케이션입니다.
<br>
프론트엔드에서는 useReducer, 커스텀훅 등 새로운 개념을 배워 사용하였고
백엔드는 express 서버를 사용, JWT를 사용하여 인증 방식을 구현하였고 Mongoose를 이용하여 MongoDB에 데이터를 저장하였습니다. MongoDB user와 place 컬렉션 두 개에 레퍼런스를 주어 관련 데이터에 대한 정보를 저장할 수 있도록 로직을 구현했습니다.

완성한 작품은 제 개인 서버(IWinV)에 Nginx를 통해 배포하였습니다.

## Accomplishments that I'am proud of

프론트엔드 부분만 구현하는 것이 아닌, 직접 백엔드 부분도 RESTFUL하게 로직을 짜서 앱의 완성도를 높인 것과 리액트 컴포넌트를 이전보다 더 재사용성이 높게 만든 점, 직접 커스텀 훅을 이용해 프론트 로직을 작성한 것 입니다.

## What I learned

컴포넌트를 재사용성 있게 짜는 것과 반복적으로 나오는 로직을 커스텀 훅으로 만들어서 사용하는 것이 얼마나 필요한지를 깨달았습니다.

그리고 좋은 라이브러리들이 굉장히 많다는 점과 보안 등 백엔드 부분은 아직 공부할 점이 매우 많다는 것을 배우는 시간이었습니다.

## What's next for todoPlaces

<!-- - google login
- Update address(for now only Add and Delete is possible) -->

- 구글 로그인
- 댓글 기능
- 좋아요 기능
- 다른 유저와 함께 가고 싶다고 태그할 수 있는 기능
- 간 곳 방문 완료 체크 기능
- 검색 기능(유저, 장소)
- 코드 보완

## Built With

- React.js
- HTML/CSS(PostCSS)
- Node.js
- Express.js
- MongoDB(Mongoose)
- PM2, express-validator, mongoose-unique-validator, multer, uuid, Axios, bcryptjs, jsonwebtoken, etc

# Try it out!

<a href="http://49.247.208.236/" target="_blank">이곳에서 직접 프로젝트를 확인해보세요.</a>
