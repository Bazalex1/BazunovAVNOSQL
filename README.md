# Итоговое задание по модулю 3

Здесь размещены инструкции по запуску, отчет находится в файле "Базунов.Алексей. Итоговое задание по модулю 3".


## Структура проекта

- `init.js` — инициализация обычной MongoDB-базы;
- `init_sharded_full.js` — загрузка данных в шардированный кластер;
- `nosql_cli/main.py` — консольный интерфейс;
- `nosql_cli/benchmark.py` — нагрузочное тестирование;
- `README.md` — инструкция по запуску;
- `Базунов.Алексей. Итоговое задание по модулю 3.pdf` — отчёт.
- `Базунов.Алексей. Итоговое задание по модулю 3.docx` — отчёт.

## Требования

- MongoDB
- Python 3.10+

## Установка зависимостей Python

Перейти в папку с клиентом:

```bash
cd ~/Desktop/project/nosql_cli
```

Создать виртуальное окружение:

```bash
python3 -m venv venv
```

Активировать его:

```bash
source venv/bin/activate
```

Установить PyMongo:

```bash
pip install pymongo
```

---

# 1. Запуск обычной MongoDB

## Запуск сервера

Если MongoDB установлена как system service:

```bash
sudo systemctl start mongod
sudo systemctl status mongod
```


## Инициализация базы

Подключиться к MongoDB:

```bash
mongosh
```

Загрузить файл инициализации:

```javascript
load("/home/alex/Desktop/project/init.js")
```

## Проверка данных

```javascript
use nosql_hw
show collections
db.students.countDocuments()
db.grades.countDocuments()
```

---

# 2. Запуск CLI

Перейти в папку клиента и активировать окружение:

```bash
cd ~/Desktop/project/nosql_cli
source venv/bin/activate
```

Запустить программу:

```bash
python main.py
```

CLI поддерживает следующие действия:

- показать оценки студента;
- добавить оценку;
- вычислить средний балл студента;
- показать итоговые оценки студента.

---

# 3. Первичное тестирование

Для запуска benchmark в обычной MongoDB:

```bash
cd ~/Desktop/project/nosql_cli
source venv/bin/activate
python benchmark.py
```

Benchmark выполняет:

- массовую вставку 20000 документов;
- 1000 операций чтения;
- 300 aggregate-запросов.

---

# 4. Запуск шардированного кластера

Данный кластер является **учебным концептуальным вариантом** шардинга и запускается на одной машине с несколькими MongoDB-инстансами на разных портах.

## Создание каталогов

```bash
mkdir -p ~/mongo-cluster/config
mkdir -p ~/mongo-cluster/shard1
mkdir -p ~/mongo-cluster/shard2
mkdir -p ~/mongo-cluster/logs
```

## Запуск config server

```bash
mongod --configsvr --replSet cfgRS --dbpath ~/mongo-cluster/config --port 27019 --bind_ip 127.0.0.1 --fork --logpath ~/mongo-cluster/logs/config.log
```

## Запуск shard 1

```bash
mongod --shardsvr --replSet shard1RS --dbpath ~/mongo-cluster/shard1 --port 27018 --bind_ip 127.0.0.1 --fork --logpath ~/mongo-cluster/logs/shard1.log
```

## Запуск shard 2

```bash
mongod --shardsvr --replSet shard2RS --dbpath ~/mongo-cluster/shard2 --port 27020 --bind_ip 127.0.0.1 --fork --logpath ~/mongo-cluster/logs/shard2.log
```

## Запуск mongos

```bash
mongos --configdb cfgRS/127.0.0.1:27019 --bind_ip 127.0.0.1 --port 27017 --fork --logpath ~/mongo-cluster/logs/mongos.log
```

---

# 5. Настройка шардинга

Подключиться к роутеру:

```bash
mongosh --port 27017
```

Добавить шарды:

```javascript
sh.addShard("shard1RS/127.0.0.1:27018")
sh.addShard("shard2RS/127.0.0.1:27020")
sh.status()
```

Включить шардирование для базы и коллекции:

```javascript
sh.enableSharding("nosql_hw")
sh.shardCollection("nosql_hw.grades", { student_id: "hashed" })
```

---

# 6. Загрузка данных в шардированный кластер

В `mongosh`, подключённом к `mongos`:

```javascript
use nosql_hw
db.dropDatabase()
sh.enableSharding("nosql_hw")
sh.shardCollection("nosql_hw.grades", { student_id: "hashed" })
load("/home/alex/Desktop/project/init_sharded_full.js")
```

Проверка количества документов:

```javascript
db = db.getSiblingDB("nosql_hw")
db.students.countDocuments()
db.teachers.countDocuments()
db.subjects.countDocuments()
db.grades.countDocuments()
db.final_grades.countDocuments()
```

Проверка распределения данных:

```javascript
db.grades.getShardDistribution()
```

---

# 7. Тестирование после шардинга

Для запуска benchmark через `mongos`:

```bash
cd ~/Desktop/project/nosql_cli
source venv/bin/activate
python benchmark.py
```

Важно: в `main.py` и `benchmark.py` строка подключения должна указывать на `mongos`:

```python
MongoClient("mongodb://127.0.0.1:27017/")
```

---


