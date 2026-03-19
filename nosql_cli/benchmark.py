import random
import string
import time
from statistics import mean
from pymongo import MongoClient

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["nosql_hw"]
col = db["grades_benchmark"]


def random_student():
    return "S" + str(random.randint(1000, 9999))


def random_subject():
    return random.choice(["PY1", "NS1", "DB1", "ML1"])


def random_teacher():
    return random.choice(["T135", "T136", "T137"])


def generate_docs(n):
    docs = []
    for _ in range(n):
        docs.append(
            {
                "student_id": random_student(),
                "subject_id": random_subject(),
                "teacher_id": random_teacher(),
                "grade": random.randint(4, 10),
                "weight": round(random.choice([0.1, 0.2, 0.3, 0.4, 0.5, 1.0]), 1),
            }
        )
    return docs


def benchmark_insert(total_docs=20000, batch_size=1000):
    col.drop()
    col.create_index("student_id")

    batches = total_docs // batch_size
    times = []

    start_all = time.perf_counter()
    for _ in range(batches):
        docs = generate_docs(batch_size)
        t1 = time.perf_counter()
        col.insert_many(docs, ordered=False)
        t2 = time.perf_counter()
        times.append(t2 - t1)
    end_all = time.perf_counter()

    total_time = end_all - start_all
    throughput = total_docs / total_time
    print(f"INSERT total_docs={total_docs}")
    print(f"total_time={total_time:.4f} sec")
    print(f"avg_batch_time={mean(times):.4f} sec")
    print(f"throughput={throughput:.2f} docs/sec")


def benchmark_read(iterations=1000):
    ids = [
        doc["student_id"]
        for doc in col.find({}, {"student_id": 1, "_id": 0}).limit(500)
    ]
    if not ids:
        print("Нет данных для read")
        return

    times = []
    start_all = time.perf_counter()
    for _ in range(iterations):
        sid = random.choice(ids)
        t1 = time.perf_counter()
        list(col.find({"student_id": sid}))
        t2 = time.perf_counter()
        times.append(t2 - t1)
    end_all = time.perf_counter()

    total_time = end_all - start_all
    throughput = iterations / total_time
    print(f"READ iterations={iterations}")
    print(f"total_time={total_time:.4f} sec")
    print(f"avg_latency={mean(times)*1000:.4f} ms")
    print(f"throughput={throughput:.2f} ops/sec")


def benchmark_aggregate(iterations=300):
    ids = [
        doc["student_id"]
        for doc in col.find({}, {"student_id": 1, "_id": 0}).limit(500)
    ]
    if not ids:
        print("Нет данных для aggregate")
        return

    times = []
    start_all = time.perf_counter()
    for _ in range(iterations):
        sid = random.choice(ids)
        pipeline = [
            {"$match": {"student_id": sid}},
            {"$group": {"_id": "$student_id", "avg": {"$avg": "$grade"}}},
        ]
        t1 = time.perf_counter()
        list(col.aggregate(pipeline))
        t2 = time.perf_counter()
        times.append(t2 - t1)
    end_all = time.perf_counter()

    total_time = end_all - start_all
    throughput = iterations / total_time
    print(f"AGGREGATE iterations={iterations}")
    print(f"total_time={total_time:.4f} sec")
    print(f"avg_latency={mean(times)*1000:.4f} ms")
    print(f"throughput={throughput:.2f} ops/sec")


if __name__ == "__main__":
    benchmark_insert()
    benchmark_read()
    benchmark_aggregate()
