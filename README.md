# Processing Videos

A microservices-based system for processing MP4 files and extracting initialization segments. Built with Node.js (NestJS) and Go, communicating via NATS, with PostgreSQL as the database.

---

## Services

### media-api (Node.js / NestJS)
- REST API service handling user interaction
- Listens for NATS messages from the processor service
- Stores file processing status in PostgreSQL
- Runs on port `4001`

### mp4-processor (Go)
- Listens for NATS messages from the API service
- Parses MP4 files and extracts the initialization segment (`ftyp` + `moov` boxes)
- Writes the init segment to a new file and reports back via NATS

### PostgreSQL
- Stores file records with processing status (`processing`, `failed`, `successful`)
- Stores the output path of the extracted init segment on success
- Stores the error message on failure

### NATS
- Message broker for communication between `media-api` and `mp4-processor`

---

## Requirements

- Docker
- Docker Compose

---

## How to Run

### 1. Clone the repository
```bash
git clone https://github.com/FrankDev-327/processing_videos.git
cd processing_videos
```

### 2. Create the shared folder
```bash
mkdir shared
```

### 3. Set up environment variables

There are two `.env` files required:

**Root `.env`** — used by Docker Compose for PostgreSQL configuration.
Create a `.env` file in the project root. This file will be provided separately via email.

**`media-api/.env`** — used by the NestJS API service.
This file will be provided separately via email. Place it inside the `media-api/` folder:

### 4. Run the project
```bash
docker-compose up
```

The API will be available at `http://localhost:4001`

Swagger documentation is available at `http://localhost:4001/media-docs`

---

## Volume Mounts

The `./shared` folder on your machine is mounted into both containers at `/shared`:

```yaml
media-api:  ./shared → /shared
processor:  ./shared → /shared
```

This means any MP4 file placed in `./shared` on your machine is automatically accessible to both services. The processor will write the extracted init segment back to the same folder.

---

## API Endpoints

| Method | Endpoint     | Description                         |
| ------ | ------------ | ----------------------------------- |
| POST   | `/media`     | Start processing a file             |
| GET    | `/media`     | List all files                      |
| GET    | `/media/:id` | Get single file detail              |
| DELETE | `/media/:id` | Delete file record and init segment |

### Start Processing
```http
POST /media
Content-Type: application/json

{
  "path": "/shared/video.mp4"
}

OR

{
  "path": "/shared/books.mp4"
}

OR

{
  "path": "/shared/cars.mp4"
}
```

The path must be an absolute path accessible inside the container via the shared volume.

---

## Flow

Client → POST /media { "path": "/shared/video.mp4" }
→ media-api saves record with status "processing"
→ media-api publishes to NATS "file.process"
→ mp4-processor receives message
→ mp4-processor extracts ftyp + moov boxes
→ mp4-processor writes /shared/video_init.mp4
→ mp4-processor publishes result to NATS "file.result"
→ media-api receives result and updates DB

---

## Unresolved Issues

- No retry mechanism if the processor fails to connect to NATS on startup
- No file validation on the API side (no check if the path exists or if the file is a valid MP4 before sending to the processor)
- No authentication on the API endpoints

---

## Notes

- The original MP4 file is never modified or deleted
- Only the extracted init segment (`_init.mp4`) is deleted when calling `DELETE /media/:id`
- Database migrations run automatically on startup before the API starts

---

## Testing

A Postman collection JSON file is included in the repository. Import it into Postman to test all available endpoints.