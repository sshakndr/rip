# **РИП**
Лабораторные представлены в виде 2 проектов на REST API и WebSocket. Для работы требуется NodeJS, PostgeSQL и Docker
- serverREST и clientREST это 1,2,3 и 8 лабораторные
- serverWS и clientWS это 5 и 6 лабораторные, готовые к реализации 4 и 7

## **REST API**
#### ***serverREST***
##### Подготовка: 
- выполнить в директории `npm install`
- заменить в файле db.ts юзера, пароль, название БД и прочее если нужно
- создать в БД таблицы:
```SQL
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email VARCHAR(100),
    pswd VARCHAR(100)
); 

DROP TABLE IF EXISTS tasks CASCADE;
CREATE TABLE tasks (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    text VARCHAR(200),
    readiness BOOLEAN,
    user_id INT,
    CONSTRAINT fk_users
        FOREIGN KEY(user_id)
        REFERENCES users(id)
);
```

##### Запуск:
Первый запуск `npm run dev`, потом если не внесены изменения `npm start`

#### ***clientREST***
##### Подготовка: 
- выполнить в директории `npm install`

##### Запуск:
`npm start`

##### Управление:
Интуитивно понятное. Регистрируешься, входишь, изменяешь задачи, выходишь

## **WebSocket**
#### ***serverWS***
##### Подготовка:
- выполнить в директории `npm install`
- добавить в докер образ RabbitMQ и перейти в браузере на `localhost:15672`:
```
docker run -d --hostname my-rabbit --name some-rabbit -p 15672:15672 -p 5672:5672 -e RABBITMQ_DEFAULT_USER=user -e RABBITMQ_DEFAULT_PASS=password rabbitmq:3-management
```

##### Докеризация:
В директории выполнить
```Shell
docker build --tag test-proj:1.0.0 .
```
После сборки образа выполнить
```Shell
docker run -p 5000:5000 --name server test-proj:1.0.0
```
Последующие запуски можно производить из приложения докера
**Работа с RabbitMQ из образа не придусмотрена!!!**

##### Запуск:
`npm start`

#### ***clientWS***
##### Подготовка:
- выполнить в директории `npm install`

##### Запуск:
`npm start`

##### Управление:
Интуитивно понятный чат.
/nt ТЕМА --- создать тему в очереди
/t --- взять тему из очереди

