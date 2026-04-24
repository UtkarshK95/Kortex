import http from 'k6/http'
import { check, sleep } from 'k6'
import { Trend, Rate } from 'k6/metrics'

const responseTime = new Trend('response_time')
const errorRate = new Rate('error_rate')

const BASE_URL = 'http://localhost:8000'

const QUESTIONS = [
  'What are the phases of cloud migration?',
  'How does RAG reduce hallucinations?',
  'What is a headless CMS?',
  'What is domain ownership in data mesh?',
  'What are the key microservices patterns?',
]

export const options = {
  scenarios: {
    baseline: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { scenario: 'baseline' },
    },
    concurrent: {
      executor: 'constant-vus',
      vus: 10,
      duration: '30s',
      startTime: '40s',
      tags: { scenario: 'concurrent' },
    },
    stress: {
      executor: 'ramping-vus',
      startVUs: 1,
      stages: [
        { duration: '20s', target: 10 },
        { duration: '20s', target: 20 },
        { duration: '10s', target: 0 },
      ],
      startTime: '80s',
      tags: { scenario: 'stress' },
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<10000'],
    error_rate: ['rate<0.1'],
  },
}

export default function () {
  const question = QUESTIONS[
    Math.floor(Math.random() * QUESTIONS.length)
  ]

  const payload = JSON.stringify({
    question,
    top_k: 5,
    provider: 'gemini',
  })

  const params = {
    headers: { 'Content-Type': 'application/json' },
    timeout: '30s',
  }

  const res = http.post(
    `${BASE_URL}/query`,
    payload,
    params
  )

  const success = check(res, {
    'status is 200': (r) => r.status === 200,
    'has answer': (r) => {
      try {
        return JSON.parse(r.body).answer !== undefined
      } catch {
        return false
      }
    },
    'response time < 10s': (r) =>
      r.timings.duration < 10000,
  })

  responseTime.add(res.timings.duration)
  errorRate.add(!success)

  sleep(1)
}
