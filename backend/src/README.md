# API Rate Limiter

A scalable backend infrastructure project implementing multiple API rate limiting algorithms using Node.js, Express.js, and Redis.

## Features

- Fixed Window Rate Limiter
- Sliding Window Rate Limiter
- Token Bucket Algorithm
- Leaky Bucket Algorithm
- Redis-based Distributed Rate Limiting
- HTTP 429 Response Handling
- Rate Limit Headers

## Tech Stack

- Node.js
- Express.js
- Redis
- REST APIs

## Algorithms Implemented

### Fixed Window
Counts requests within a fixed time interval.

### Sliding Window
Tracks requests dynamically over a rolling time window.

### Token Bucket
Uses refillable tokens to allow controlled bursts.

### Leaky Bucket
Processes requests at a constant rate.

## Installation

```bash
npm install
npm run dev
```

## API Endpoint

```text
GET /api
```

## Response

```json
{
  "message": "Too many requests"
}
```

## Status Code

```text
429 Too Many Requests
```
