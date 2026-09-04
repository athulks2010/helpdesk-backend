# Parity & cutover checklist

Run Node API + Angular against the **same MySQL** as Laravel. Do not alter schema.

## Auth

- [ ] Login with existing admin/agent/customer users (bcrypt hashes)
- [ ] Token stored as `{id}|{plain}`; row in `personal_access_tokens`
- [ ] `/auth/me` returns user + role + access JSON
- [ ] Logout revokes token
- [ ] Password reset email via SMTP + `password_resets`

## Domains

- [ ] Tickets list/create/update/delete/restore + comments
- [ ] Conversations + messages + Pusher `chat.{id}`
- [ ] Contacts / customers / users / organizations soft-delete restore
- [ ] Taxonomy: category, priority, status, department, type, roles
- [ ] CMS: faq, post, knowledge-base, service, front-page
- [ ] Settings SMTP/Pusher values readable/writable
- [ ] Dashboard metrics / reports
- [ ] AI endpoints when `AI_ENABLED=true`
- [ ] File upload lands under `public/files`
- [ ] Public open-ticket + chat init

## UI

- [ ] Login/register visual match to Laravel Vue pages
- [ ] Dashboard shell navigation covers all former Inertia routes
- [ ] Ticket CRUD screens functional
- [ ] Chat pane sends/receives with Pusher when configured

## Cutover

1. Point production Angular `apiUrl` to Node
2. Stop Laravel PHP-FPM / web only (keep DB)
3. Keep `public/files` and `public/images` paths reachable (copy or symlink Laravel public assets)
4. Smoke all roles once more
