# uglyus 사전과제




 본 레포지토리는 도커로 실행되게 구성되어 있으며 도커 컴포즈 파일으로 실행하시면 됩니다.

````
실행스크립트

# root dir

docker-compose -f docker-compose.yml --env-file app/api/.env up
````

스크립트로 실행하게 되면 컨테이너로 열리게 되며 app/api안에 env 파일에 환경 변수를 가지게 됩니다.
환경 변수의 내용은 아래와 같습니다.
````
DB_HOST=mysql
DB_PORT=3306
MYSQL_ROOT_USER=root
MYSQL_ROOT_PASSWORD=uglyus
MYSQL_USER=admin
MYSQL_PASSWORD=uglyus
DB_SCHEMA=tennis_lesson_db
````


## 느낀점
 먼저 api 3,4 번을 이해를 잘못해서 시간을 많이 허비 한게 조금 아쉽습니다. 최대한 다른 라이브러리를 지양하려고 노력했습니다. 아키텍처 부분은 제가 애용하는 헥사곤(포트엔어뎁터) 아키텍처이며 jest-mock-extended 라이브러리와 더불어
테스트 모킹 하기에 정말 편한 것이 장점이라고 생각합니다. 원래는 트랜잭션 처리도 해보려 시도 했지만 기존에 사용하는 sqlbase class 가 잘못 설계가 되어 있다는 것을 느끼게 되었습니다. 구현을 하면서 트랜잭션없이 구현을 한다는게 어색할정도로 시간만 더 있더라면 더 좋을 텐데 하는 생각이 많이 들었습니다.



## API 설정
### API 1 : 레슨 가능 일정 정보 받기

### 테스트 
메소드 : GET
````
url : 
 - 1. http://localhost:3000/lesson?coachName=김민준&lessonType=trial&lessonTime=60
 - 2. http://localhost:3000/lesson?coachName=김민준&lessonType=three_times_a_week&lessonTime=30
````
응답
 - 디비에 레슨을 제외한 시간대 (30분,1시간) 구분해서 리턴합니다.
````
1.
{
    "success": true,
    "data": [
        "2023-09-03 07:00:00",
        "2023-09-03 08:00:00",
        "2023-09-03 09:00:00",
        "2023-09-03 10:00:00",
        "2023-09-03 11:00:00",
        "2023-09-03 12:00:00",
        "2023-09-03 13:00:00",
        ....
        ]
}
2.
{
    "success": true,
    "data": [
        "2023-09-03 07:00:00",
        "2023-09-03 07:30:00",
        "2023-09-03 08:00:00",
        "2023-09-03 08:30:00",
        "2023-09-03 09:00:00",
        "2023-09-03 09:30:00",
        ...
        ]
}
````

### API 2 : 레슨 신청하기
메소드 : POST
### 테스트
````
url : 
 - 1. http://localhost:3000/lesson
````
BODY
````
{
  "customerName": "John Doe",
  "phoneNumber": "1234567890",
  "coachName": "김민준",
  "isRegularLesson": true,
  "timesPerWeek": 3,
  "endTime":"30min",
  "lessonTimes": ["2023-09-04T10:00:00.000Z", "2023-09-06T14:00:00.000Z", "2023-09-08T13:00:00.000Z"]
}
````
응답
 - 디비에 그 시간 정규 레슨같은 경우 그 요일, 시간에 레슨이 이미 있다면 충돌 이셉션을 이르킵니다.
````
1.성공
{
    "success": true,
    "data": {
        "id": "qQx7tpoVpu",
        "password": "UZFyfarIqMB1XV8"
    }
}

2.오류
{
    "success": false,
    "message": "Collision detected at 2023-09-04T10:00:00.000Z"
}
````

### API 3 : 레슨 정보 확인하기
메소드 : GET

이해를 잘못해서 유져 아이디와 비밀번호를 갖고 와서 그 유저의 모든 레슨을 확인합니다.

### 테스트
````
url : 
  - 1. http://localhost:3000/lesson/info?username=qQx7tpoVpu&password=UZFyfarIqMB1XV8
  - 2. http://localhost:3000/lesson/info?username=qQx7tpoVpu&password=aaaaa
````
응답
````
1. {
    "success": true,
    "data": [
        {
            "id": 20,
            "customerId": 15,
            "coachId": 1,
            "courtId": 1,
            "startTime": "2023-09-04T10:00:00.000Z",
            "endTime": "30min",
            "lessonType": "three_times_a_week",
            "dayOfweek": "Monday",
            "isCancelled": false
        },
        {
            "id": 21,
            "customerId": 15,
            "coachId": 1,
            "courtId": 1,
            "startTime": "2023-09-08T13:00:00.000Z",
            "endTime": "30min",
            "lessonType": "three_times_a_week",
            "dayOfweek": "Friday",
            "isCancelled": false
        },
        {
            "id": 22,
            "customerId": 15,
            "coachId": 1,
            "courtId": 1,
            "startTime": "2023-09-06T14:00:00.000Z",
            "endTime": "30min",
            "lessonType": "three_times_a_week",
            "dayOfweek": "Wednesday",
            "isCancelled": false
        }
    ]
}
2. 오류시
{
    "success": false,
    "message": "유저를 찾지 못했습니다"
}
````

### API 4 : 레슨 수정하기
메소드 : PUT

이것 또한 이해를 잘못해서 유져 아이디와 비밀번호를 갖고 와서 그 유저의 모든 레슨을 수정합니다.

테스트
 ````
 url :
 - 1. http://localhost:3000/lesson?username=qQx7tpoVpu&password=UZFyfarIqMB1XV8
 - 2. http://localhost:3000/lesson?username=qQx7tpoVpu&password=aaaa // 실패
 ````
BODY
````
{
  "customerName": "fuck1 Doe1",
  "phoneNumber": "+821011",
  "coachName": "김민준",
  "timesPerWeek": 2,
  "endTime":"30min",
  "lessonTimes": ["2023-09-01T10:00", "2023-09-02T14:00"]
}

````
응답
````
1.
{
    "success": true
},
2.
{
    "success": false,
    "message": "유저를 찾지 못했습니다"
},
3.// 정기 레슨이 아닐 
{
    "success": false,
    "message": "정기 레슨이 아닙니다."
},
4.// 코치가 이름이 잘못됐을시 
{
    "success": false,
    "message": "코치를 찾을수 없습니다"
},
````

### API 5 : 레슨 취소하기
메소드 : DELETE
path params 레슨 id 값을 보내어 soft delete 합니다.
````
 url :
    - 1. http://localhost:3000/lesson/15?password=UZFyfarIqMB1XV8
````

응답
````
1.
{
    "success": true
},
2.
{
    "success": false,
    "message": "레슨을 찾을수 없습니다"
}
3.
{
    "success": false,
    "message": "유저를 찾지 못했습니다"
},
````