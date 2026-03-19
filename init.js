db= db.getSiblingDB("nosql_hw")

db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["student_id", "name", "group", "admission_year"],
      properties: {
        student_id: { bsonType: "string" },
        name: { bsonType: "string" },
        group: { bsonType: "string" },
        admission_year: { bsonType: "int" }
      }
    }
  }
})
 
db.createCollection("teachers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["teacher_id", "name"],
      properties: {
        teacher_id: { bsonType: "string" },
        name: { bsonType: "string" },
        department: { bsonType: "string" }
      }
    }
  }
})
 
db.createCollection("subjects", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["subject_id", "title", "term"],
      properties: {
        subject_id: { bsonType: "string" },
        title: { bsonType: "string" },
        term: { bsonType: "int" }
      }
    }
  }
})
 
db.createCollection("grades", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["student_id", "subject_id", "teacher_id", "grade", "weight"],
      properties: {
        student_id: { bsonType: "string" },
        subject_id: { bsonType: "string" },
        teacher_id: { bsonType: "string" },
        grade: { bsonType: "int", minimum: 1, maximum: 10 },
        weight: { bsonType: "double" },
        date: { bsonType: "date" }
      }
    }
  }
})
 
db.createCollection("final_grades", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["student_id", "subject_id", "teacher_id", "grade", "term"],
      properties: {
        student_id: { bsonType: "string" },
        subject_id: { bsonType: "string" },
        teacher_id: { bsonType: "string" },
        grade: { bsonType: "int", minimum: 1, maximum: 10 },
        term: { bsonType: "int" }
      }
    }
  }
})

db.students.createIndex({ student_id: 1 }, { unique: true })
db.teachers.createIndex({ teacher_id: 1 }, { unique: true })
db.subjects.createIndex({ subject_id: 1 }, { unique: true })
 
db.grades.createIndex({ student_id: 1 })
db.grades.createIndex({ subject_id: 1 })
db.grades.createIndex({ teacher_id: 1 })
 
db.final_grades.createIndex({ student_id: 1 })
 
db.students.insertMany([
  { student_id: "S1234", name: "Иванов Иван", group: "ИД101", admission_year: 2025 },
  { student_id: "S1235", name: "Петров Петр", group: "ИД101", admission_year: 2025 },
  { student_id: "S1236", name: "Федоров Федор", group: "ИД102", admission_year: 2025 },
  { student_id: "S1237", name: "Екатеринова Екатирина", group: "ИД101", admission_year: 2025 },
  { student_id: "S1238", name: "Мариева Мария", group: "ИД102", admission_year: 2025 },
  { student_id: "S1239", name: "Николаев Николай", group: "ИД102", admission_year: 2025 }
])
 
db.teachers.insertMany([
  { teacher_id: "T135", name: "Смоктуновский Афанасий", department: "ФКН" }, 
  { teacher_id: "T136", name: "Никулин Николай", department: "ФКН" }
])
 
db.subjects.insertMany([
  { subject_id: "PY1", title: "Python", term: 1 },
  { subject_id: "NS1", title: "NOSQL", term: 1 }
])

db.grades.insertMany([
  { student_id: "S1234", subject_id: "PY1", teacher_id: "T135", grade: 8, weight: 0.3 },
  { student_id: "S1234", subject_id: "PY1", teacher_id: "T135", grade: 9, weight: 0.3 },
  { student_id: "S1234", subject_id: "PY1", teacher_id: "T135", grade: 7, weight: 0.4 },
 
  { student_id: "S1235", subject_id: "PY1", teacher_id: "T135", grade: 6, weight: 0.5 },
  { student_id: "S1235", subject_id: "PY1", teacher_id: "T135", grade: 7, weight: 0.5 },
 
  { student_id: "S1236", subject_id: "NS1", teacher_id: "T136", grade: 9, weight: 0.5 },
  { student_id: "S1236", subject_id: "NS1", teacher_id: "T136", grade: 10, weight: 0.5 },
 
  { student_id: "S1237", subject_id: "PY1", teacher_id: "T135", grade: 10, weight: 0.5 },
  { student_id: "S1237", subject_id: "PY1", teacher_id: "T135", grade: 9, weight: 0.5 },
 
  { student_id: "S1238", subject_id: "NS1", teacher_id: "T136", grade: 7, weight: 0.5 },
  { student_id: "S1238", subject_id: "NS1", teacher_id: "T136", grade: 8, weight: 0.5 }
])
 
db.final_grades.insertMany([
  { student_id: "S1234", subject_id: "PY1", teacher_id: "T135", grade: 8, term: 1 },
  { student_id: "S1235", subject_id: "PY1", teacher_id: "T135", grade: 7, term: 1 },
  { student_id: "S1236", subject_id: "NS1", teacher_id: "T136", grade: 10, term: 1 },
  { student_id: "S1237", subject_id: "PY1", teacher_id: "T135", grade: 10, term: 1 },
  { student_id: "S1238", subject_id: "NS1", teacher_id: "T136", grade: 8, term: 1 }
])
