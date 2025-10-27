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

### All Collections
- `GET /api/db/diodes` - Get all diode records
- `GET /api/db/light-intensity` - Get all light intensity records
- `GET /api/db/temperatures` - Get all temperature records
- `GET /api/db/water-levels` - Get all water level records
- `GET /api/db/humidities` - Get all humidity records

### Date Range Filtering
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

### Get Temperature Data for Today
```bash
curl "http://localhost:3001/api/db/temperatures/date-range?startDate=2025-10-27&endDate=2025-10-27"
```

### Authenticated Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/auth/me
```
