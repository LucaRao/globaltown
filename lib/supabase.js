import { createClient } from 'supabase-wechat-stable'
const url = "https://cd71ps25g6h3ij26om3g.baseapi.memfiredb.com"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiZXhwIjozMjAzOTgzNjYyLCJpYXQiOjE2NjYwNjM2NjIsImlzcyI6InN1cGFiYXNlIn0.6_-Q-8n-qsvCajNwtCCsQFUwZkkbAtIFnvWwQulQnuM"

export const supabase = createClient(url, key)