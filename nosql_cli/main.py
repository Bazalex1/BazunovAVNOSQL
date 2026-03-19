from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["nosql_hw"]


def show_student_grades():
    sid = input("student_id: ").strip()
    docs = list(db.grades.find({"student_id": sid}, {"_id": 0}))
    if not docs:
        print("Нет оцнок")
        return
    for doc in docs:
        print(doc)


def add_grade():
    doc = {
        "student_id": input("student_id: ").strip(),
        "subject_id": input("subject_id: ").strip(),
        "teacher_id": input("teacher_id: ").strip(),
        "grade": int(input("grade: ").strip()),
        "weight": float(input("weight: ").strip()),
    }
    db.grades.insert_one(doc)
    print("Оценка добавлена")


def avg_student():
    sid = input("student_id: ").strip()
    pipeline = [
        {"$match": {"student_id": sid}},
        {"$group": {"_id": "$student_id", "avg": {"$avg": "$grade"}}},
    ]
    result = list(db.grades.aggregate(pipeline))
    if result:
        print("Средний Балл:", round(result[0]["avg"], 2))
    else:
        print("Нет данных")


def show_final_grades():
    sid = input("student_id: ").strip()
    docs = list(db.final_grades.find({"student_id": sid}, {"_id": 0}))
    if not docs:
        print("Нет итоговых оценок")
        return
    for doc in docs:
        print(doc)


while True:
    print("\n1 - Показать оценки студента")
    print("2 - Добавить оценку")
    print("3 - Средний балл студента")
    print("4 - Итоговые оценки студента")
    print("0 - Выход")
    cmd = input("> ").strip()

    if cmd == "1":
        show_student_grades()

    elif cmd == "2":
        add_grade()
    elif cmd == "3":
        avg_student()
    elif cmd == "4":
        show_final_grades()
    elif cmd == "0":
        break
    else:
        print("Неизвестная команда")
