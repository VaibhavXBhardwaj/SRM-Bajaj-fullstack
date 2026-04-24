# Node Hierarchy Processor

A full stack application that processes directed graph edges and returns structured tree hierarchies, cycle detection, and validation insights.

Built for the SRM and Bajaj Full Stack Engineering Challenge.

## Live:
- Frontend: https://vaibhav-bfhl.onrender.com
- API: https://vaibhav-bfhl.onrender.com/bfhl

## What it does
- Parses edges like `A->B`, `A->C` and builds tree hierarchies
- Detects cycles using DFS with 3-color marking
- Identifies invalid entries and duplicate edges
- Returns depth of each tree and the largest tree root

## Tech Stack
- **Backend:** Node.js, Express
- **Frontend:** Vanilla HTML, CSS, JavaScript

## API

**POST** `/bfhl`

Request:
```json
{
  "data": ["A->B", "A->C", "B->D", "X->Y", "Y->Z", "Z->X"]
}
```

Response includes hierarchies, cycle flags, depth, invalid entries, duplicates, and summary.

## Run Locally
```bash
npm install
node index.js
```

Server runs on `http://localhost:3000`

## Author
Vaibhav Bhardwaj — RA2311028030045 — SRMIST
