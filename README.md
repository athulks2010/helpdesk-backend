# HelpDesk Backend (Node / Express)

Express + TypeScript API using GeoHaul modular architecture against the **existing HelpDesk MySQL** database (no schema changes).

## Stack

- Express + TypeScript
- Sequelize → MySQL (freezeTableName, no alter/sync)
- Sanctum-compatible `personal_access_tokens` (Bearer `{id}|{plain}`)
- Nodemailer SMTP (no RabbitMQ)
- Pusher private channel auth
- node-cron for IMAP/piping hooks

## Setup

1. Copy `environments/local.env.example` → `environments/local.env`
2. Set `DB_*` to the same MySQL database as Laravel HelpDesk
3. Set `MAIL_*`, `PUSHER_*`, `OPENAI_*` as needed
4. `npm install`
5. `npm run local` → http://localhost:3000

## Docs

- [API contract map](docs/API_CONTRACT.md)
- `GET /routes` lists mounted endpoints (non-prod)

## Auth parity

Login/register/logout/me/password-reset mirror Laravel `Api\V1\AuthController` and use bcrypt password hashes already in `users`.
