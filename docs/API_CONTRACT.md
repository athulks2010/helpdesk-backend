# HelpDesk API Contract Map

Laravel source → Node (GeoHaul-style) routes. Response envelope:

```json
{ "response": { "status": "SUCCESS|FAILED", "message": "", "code": 200, "errors": [] }, "data": {} }
```

Auth: `Authorization: Bearer {id}|{plain}` (Sanctum-compatible `personal_access_tokens`).

## Auth

| Laravel | Node |
|---------|------|
| POST /api/v1/auth/login | POST /auth/login |
| POST /api/v1/auth/register | POST /auth/register |
| POST /api/v1/auth/password/reset | POST /auth/password/reset |
| POST /api/v1/auth/password/reset/{token} | POST /auth/password/reset/:token |
| GET /api/v1/auth/me | GET /auth/me |
| POST /api/v1/auth/logout | POST /auth/logout |

Login data: `{ user, token, token_type: "Bearer" }` (same field names as Laravel).

## Resources (authenticated)

Pattern: `/resource/all|single|create|update|delete|restore`

| Domain | Base path |
|--------|-----------|
| tickets | /ticket |
| conversations | /conversation |
| users | /user |
| roles | /role |
| contacts | /contact |
| organizations | /organization |
| categories | /category |
| priorities | /priority |
| statuses | /status |
| departments | /department |
| types | /type |
| faqs | /faq |
| notes | /note |
| settings | /setting |
| languages | /language |
| email templates | /email-template |
| navigation menus | /navigation-menu |
| front pages | /front-page |
| services | /service |
| knowledge base | /knowledge-base |
| posts | /post |
| notifications | /notification |
| file upload | /file-upload |
| dashboard | /dashboard/metrics\|analytics\|performance\|charts |
| reports | /report/generate\|show |
| AI | /ai/classify\|suggestions\|sentiment\|status\|analytics\|settings |

Ticket extras: POST /ticket/comments, GET /ticket/comments  
Conversation extras: POST /conversation/messages, GET /conversation/messages, POST /conversation/mark-read

## Public

| Feature | Path |
|---------|------|
| FAQs | GET /public/faqs |
| Posts | GET /public/posts, /public/posts/single |
| KB | GET /public/knowledge-base |
| Services | GET /public/services |
| Front page | GET /public/front-page?slug= |
| Open ticket | POST /public/ticket/open |
| Newsletter | POST /public/subscribe/news |
| Chat init | POST /public/chat/init |
| Chat get | GET /public/chat/conversation?id= |
| Chat send | POST /public/chat/send-message |

## Realtime / cron

| Laravel | Node |
|---------|------|
| POST /broadcasting/auth | POST /broadcasting/auth |
| /cron/piping | GET /cron/piping + node-cron |

## Pagination query

`pageNumber`, `pageSize`, `sortField`, `sortOrder`, `searchText` (also accepts Laravel `page` / `per_page` / `search`).
