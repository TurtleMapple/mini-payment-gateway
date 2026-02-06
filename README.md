# Notification System with RabbitMQ (Mini Project)

## Project Overview

Project ini merupakan **mini project berbasis event-driven architecture** yang menggunakan **RabbitMQ** sebagai message broker, dengan studi kasus **pembuatan payment event**.

Tujuan utama dari project ini **bukan membangun sistem payment secara penuh**, melainkan untuk **mendemonstrasikan alur asynchronous processing** menggunakan RabbitMQ, mulai dari:
- HTTP request masuk ke API,
- event dipublish ke message broker,
- hingga event diproses secara terpisah oleh worker (consumer).

Dalam project ini, API dan worker **dipisahkan secara tanggung jawab (separation of concerns)**:
- API hanya bertugas menerima request, melakukan validasi, dan mengirim event ke RabbitMQ.
- Worker bertugas mengonsumsi event dari queue dan menjalankan proses lanjutan (misalnya menyimpan data ke database).

Studi kasus “payment” dipilih karena:
- Relatable dengan sistem nyata,
- Mudah dikembangkan menjadi workflow yang lebih kompleks di masa depan,
- Cocok untuk merepresentasikan event-based processing.

Namun, untuk menjaga scope tetap kecil dan fokus pada arsitektur RabbitMQ, **status payment pada project ini disederhanakan**:
- Tidak ada lifecycle `pending → paid / failed`
- Tidak ada callback atau webhook
- Setiap payment dianggap sebagai satu event final

Dengan demikian, project ini lebih tepat dipandang sebagai:
> **Event-driven notification system menggunakan RabbitMQ dengan payment sebagai contoh kasus**

Project ini cocok digunakan sebagai:
- Media belajar RabbitMQ (connection, channel, exchange, queue, producer, consumer)
- Contoh pemisahan API dan worker dalam satu codebase
- Dasar untuk pengembangan sistem asynchronous yang lebih kompleks

------------------------------------------------------------------------------------------------------------------

## Tech Stack

Project ini dibangun menggunakan beberapa teknologi utama yang dipilih untuk merepresentasikan **stack backend modern** dengan pendekatan modular dan event-driven.

### Runtime & Language
- **Node.js**
  Digunakan sebagai runtime utama karena ekosistemnya yang matang untuk backend dan message broker.
- **TypeScript**
  Memberikan type-safety, struktur kode yang lebih jelas, serta memudahkan scaling dan maintenance pada project jangka panjang.

### Package Manager
- **pnpm**
  Digunakan sebagai package manager karena:
  - Lebih efisien dalam penggunaan disk,
  - Dependency resolution yang cepat,
  - Cocok untuk project modular.

### Web Framework & API Layer
- **Hono**
  Framework HTTP yang ringan dan cepat, cocok untuk membangun API tanpa overhead besar seperti framework monolitik.
- **Zod**
  Digunakan untuk validasi data dan definisi schema secara deklaratif.
- **Zod OpenAPI**
  Digunakan untuk:
  - Menghasilkan dokumentasi OpenAPI secara otomatis,
  - Menjaga konsistensi antara request/response dan dokumentasi API.

### API Documentation
- **Scalar UI**
  Digunakan sebagai UI dokumentasi OpenAPI yang developer-friendly, memudahkan testing endpoint selama development.

### Database & ORM
- **MySQL**
  Digunakan sebagai relational database untuk menyimpan data payment.
- **MikroORM**
  Digunakan sebagai ORM karena:
  - Mendukung TypeScript secara native,
  - Memiliki Entity & Repository pattern yang jelas,
  - Mendukung migration secara terstruktur.

### Message Broker
- **RabbitMQ**
  Digunakan sebagai message broker untuk menerapkan asynchronous processing dengan konsep:
  - Connection
  - Channel
  - Exchange
  - Queue
  - Producer & Consumer

RabbitMQ dipilih karena:
- Cocok untuk message-based communication,
- Mendukung routing berbasis exchange,
- Banyak digunakan pada sistem production.

### Architecture Pattern
- **Event-Driven Architecture**
  Digunakan untuk memisahkan proses synchronous (API) dan asynchronous (worker).
- **Separation of Concerns**
  Diterapkan dengan pemisahan:
  - Route
  - Service (business logic)
  - Repository (data access)
  - Messaging (RabbitMQ)
  - Worker (consumer)

Tech stack ini dirancang agar project:
- Mudah dipahami sebagai media belajar,
- Tetap mendekati praktik real-world,
- Fleksibel untuk dikembangkan lebih lanjut (misalnya menambah worker atau message broker lain).

------------------------------------------------------------------------------------------------------------------

## High-Level Architecture

Project ini menggunakan pendekatan **Event-Driven Architecture** dengan pemisahan yang jelas antara **API Layer** dan **Worker (Background Process)**.

Secara umum, sistem terdiri dari tiga komponen utama:
1. **API Service**
2. **Message Broker (RabbitMQ)**
3. **Worker Service**

### Diagram Arsitektur (High-Level)

Client
|
| HTTP Request
v
API (Hono + Zod OpenAPI)
|
| 1. Validate Request
| 2. Insert Payment (MySQL)
| 3. Publish Event
v
RabbitMQ (Exchange -> Queue)
|
| Consume Message
v
Worker
|
| Process Event (Async)
v
(Logging / Side Effect)

### Komponen Utama

#### 1. API Service
API Service bertanggung jawab atas:
- Menerima HTTP request dari client,
- Validasi input menggunakan Zod,
- Menyimpan data payment ke database,
- Mempublikasikan event ke RabbitMQ.

API **tidak menangani proses asynchronous secara langsung**, melainkan hanya memicu event.

Komponen di dalam API:
- **Route**: Mendefinisikan endpoint HTTP.
- **Service**: Menangani business logic.
- **Repository**: Akses data ke database.
- **Publisher**: Mengirim message ke RabbitMQ.

---

#### 2. RabbitMQ (Message Broker)
RabbitMQ berfungsi sebagai perantara antara API dan Worker.

Peran utama RabbitMQ dalam sistem ini:
- Menyimpan message yang dikirim oleh API,
- Menjamin message dapat diproses secara asynchronous,
- Memisahkan lifecycle API dan Worker.

Topologi yang digunakan:
- **Exchange**: Titik masuk message dari producer.
- **Queue**: Menyimpan message sebelum dikonsumsi worker.
- **Binding**: Menghubungkan exchange dan queue.

Penggunaan exchange memungkinkan sistem:
- Lebih fleksibel,
- Mudah dikembangkan untuk multiple consumer,
- Tidak terikat langsung ke satu queue.

---

#### 3. Worker Service
Worker bertugas untuk:
- Mengonsumsi message dari RabbitMQ,
- Menjalankan proses asynchronous,
- Mensimulasikan pemrosesan lanjutan dari payment event.

Worker berjalan sebagai proses terpisah dari API sehingga:
- Tidak memblokir request API,
- Bisa di-scale secara independen,
- Lebih mendekati arsitektur production.

---

### Karakteristik Arsitektur

- **Loose Coupling**
  API tidak mengetahui bagaimana event diproses oleh worker.
- **Scalable**
  Worker dapat ditambah tanpa mengubah API.
- **Maintainable**
  Perubahan logic worker tidak mempengaruhi API.
- **Extensible**
  Message broker dapat diganti atau ditambah (misalnya SQS) dengan perubahan minimal.

---

### Catatan Scope Project

Pada mini project ini:
- Status payment hanya memiliki **satu status awal** (misalnya `CREATED`),
- Tidak ada callback eksternal (seperti payment gateway real),
- Fokus utama adalah **alur messaging dan arsitektur**, bukan fitur payment kompleks.

Arsitektur ini sengaja dibuat lebih "production-like" meskipun scope fungsionalnya kecil, dengan tujuan pembelajaran dan eksplorasi praktik terbaik.

## Project Structure (Folder & File Explanation)

Struktur project ini dirancang untuk memisahkan tanggung jawab (separation of concerns) antara:
- API Layer,
- Business Logic,
- Database Access,
- Message Broker (RabbitMQ),
- Background Worker.

```
├── 📁 src
│   ├── 📁 api
│   │   ├── 📁 config
│   │   │   └── 📄 env.ts
│   │   ├── 📁 routes
│   │   │   ├── 📄 health.route.ts
│   │   │   └── 📄 payments.route.ts
│   │   ├── 📁 schemas
│   │   │   └── 📄 payment.schema.ts
│   │   ├── 📁 services
│   │   │   └── 📄 create-payment.service.ts
│   │   ├── 📄 api.ts
│   │   └── 📄 app.ts
│   ├── 📁 db
│   │   ├── 📁 entities
│   │   │   └── 📄 payment.entity.ts
│   │   ├── 📁 migrations
│   │   │   ├── ⚙️ .snapshot-mini_payment.json
│   │   │   ├── 📄 Migration20260205020647.ts
│   │   │   └── 📄 Migration20260205024934.ts
│   │   ├── 📁 repositories
│   │   │   └── 📄 payment.repository.ts
│   │   └── 📄 mikro-orm.config.ts
│   ├── 📁 rabbitmq
│   │   ├── 📁 publisher
│   │   │   └── 📄 payment.publisher.ts
│   │   ├── 📄 channel.ts
│   │   ├── 📄 connection.ts
│   │   └── 📄 topology.ts
│   ├── 📁 worker
│   │   └── 📄 payment.consumer.ts
│   ├── 📄 index.ts
│   └── 📄 server.ts
├── ⚙️ .env.example
├── 📝 README.md
├── ⚙️ package.json
├── ⚙️ pnpm-lock.yaml
└── ⚙️ tsconfig.json
```

### `src/api/`
Berisi seluruh komponen yang berkaitan dengan **HTTP API**.

Folder ini **tidak berisi logic asynchronous processing** (worker), hanya fokus pada request–response.

#### `src/api/config/`
- `env.ts`  
  Mengelola dan memvalidasi environment variable untuk API.

#### `src/api/routes/`
- `payments.route.ts`  
  Mendefinisikan endpoint HTTP `/payments`.

Tanggung jawab:
- Mapping HTTP method & path,
- Memanggil service,
- Mengembalikan response.

> Tidak berisi logic bisnis.

## Request Flow (Step by Step)

Bagian ini menjelaskan alur lengkap ketika client membuat payment melalui endpoint API, hingga event tersebut diproses oleh worker secara asynchronous.

---

### 1. Client Mengirim Request

Client mengirim HTTP request ke API:

```http
POST /payments
Content-Type: application/json

Client
  → API Route
    → Service
      → Repository (Database)
      → Publisher (RabbitMQ)
  ← HTTP Response

RabbitMQ
  → Worker
    → Async Processing

    ### Sedikit uji logika (biar makin solid)

Asumsi implisit yang kamu buat:
> *“Publish event setelah DB insert selalu aman.”*

Ini **benar untuk mini project**, tapi di production:
- Ada edge case: DB commit sukses, publish gagal.

Solusi production-grade:
- Outbox pattern
- Transactional messaging

Kamu **tidak perlu** implement itu sekarang, tapi menyebutnya di README (sebagai catatan) justru nilai plus.

Kalau mau lanjut, bagian yang *paling powerful secara teknis* berikutnya:
- **RabbitMQ Topology Detail** (exchange, queue, routing key)
atau
- **How to Run (Local Development)**

Pilih mana dulu.