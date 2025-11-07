# AGH-IoT-BACKEND

Backend API for AGH IoT system with authentication and database endpoints.

## Quick Start

```bash
npm install
npm run dev
```

## Authentication Endpoints

### Token Generation
- `GET /auth/test-tokens` - Get predefined test tokens
- `GET /auth/me` - Get current user info (requires auth)

### Health Check
- `GET /auth/health` - Check authentication services status

## Database Endpoints

### All Collections (GET)
- `GET /api/db/diodes` - Get all diode records
- `GET /api/db/light-intensity` - Get all light intensity records
- `GET /api/db/temperatures` - Get all temperature records
- `GET /api/db/water-levels` - Get all water level records
- `GET /api/db/humidities` - Get all humidity records

### Create Records (POST)

#### Create Diode Record
- `POST /api/db/diodes`
```json
{
  "status": true,
  "date": "2025-11-07T10:30:00Z"  // optional, defaults to now
}
```

#### Create Light Intensity Record
- `POST /api/db/light-intensity`
```json
{
  "value": 150.5,
  "date": "2025-11-07T10:30:00Z"  // optional, defaults to now
}
```

#### Create Temperature Record
- `POST /api/db/temperatures`
```json
{
  "value": 22.5,
  "date": "2025-11-07T10:30:00Z"  // optional, defaults to now
}
```

#### Create Water Level Record
- `POST /api/db/water-levels`
```json
{
  "value": 75.0,
  "date": "2025-11-07T10:30:00Z"  // optional, defaults to now
}
```

#### Create Humidity Record
- `POST /api/db/humidities`
```json
{
  "value": 65.5,
  "date": "2025-11-07T10:30:00Z"  // optional, defaults to now
}
```

**Validation Rules:**
- `status` (diode) - must be boolean (true/false)
- `value` (light intensity, water level) - must be number ≥ 0
- `value` (temperature) - must be number ≥ -273.15°C
- `value` (humidity) - must be number between 0-100
- `date` - optional, ISO 8601 format, defaults to current time

### Date Range Filtering (GET)
- `GET /api/db/diodes/date-range?startDate=2025-01-01&endDate=2025-01-31`
- `GET /api/db/light-intensity/date-range?startDate=2025-01-01&endDate=2025-01-31`
- `GET /api/db/temperatures/date-range?startDate=2025-01-01&endDate=2025-01-31`
- `GET /api/db/water-levels/date-range?startDate=2025-01-01&endDate=2025-01-31`
- `GET /api/db/humidities/date-range?startDate=2025-01-01&endDate=2025-01-31`

### Database Health
- `GET /api/db/health` - Check database connection
- `GET /api/db/stats` - Get database statistics

## Usage Examples

### Generate Test Token
```bash
curl http://localhost:3001/auth/test-tokens
```

### Create Temperature Record
```bash
curl -X POST http://localhost:3001/api/db/temperatures \
  -H "Content-Type: application/json" \
  -d '{"value": 22.5}'
```

### Create Humidity Record with Custom Date
```bash
curl -X POST http://localhost:3001/api/db/humidities \
  -H "Content-Type: application/json" \
  -d '{"value": 65.5, "date": "2025-11-07T10:30:00Z"}'
```

### Get Temperature Data for Today
```bash
curl "http://localhost:3001/api/db/temperatures/date-range?startDate=2025-11-07&endDate=2025-11-07"
```

### Get Paginated Results
```bash
curl "http://localhost:3001/api/db/temperatures?limit=10&skip=0"
```

### Authenticated Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/auth/me
```
