# solo-goals

The Goals cell: its own API (Railway, serverless) and its own Neon
database, made from `cell.yaml` with [solo-cell-kit](../solo-cell-kit). It
reuses empire-platform for identity, authorization, executions and audit over
HTTP with the caller's token.

| | |
|---|---|
| API | Railway project `solo-goals`, service `goals-api` (Serverless) |
| Publisher | service `goals-publisher` (Railway cron, `*/15 * * * *`) |
| Data | Neon project `solo-goals`, database `goals` |
| Registry | solo-empire `repository-catalog/registries/online-systems.yaml` (`goals`) |

## API

Every resource has list, stats, get, get-by-legacy-id, create, patch and delete
(see `cellkit/app.py`). Permissions are `goals.<resource>:read|write|delete`.

| Path | Resource | Filters |
|---|---|---|
| `/v1/goals` | goal | `status`, `type`, `category`, `domain`, `priority` |
| `/v1/goal-tasks` | goal-task | `goal_id`, `status`, `priority` |
| `/v1/goal-metrics` | goal-metric | `goal_id`, `status`, `metric_type` |
| `/v1/goal-portfolio-mappings` | goal-portfolio-mapping | `goal_id`, `portfolio_bucket`, `attention_class`, `current_season`, `collision_group`, `canonical_goal` |
| `/v1/productivity-goals` | productivity-goal | `goal_type`, `is_active` |
| `/v1/goal-project-links` | goal-project-link | `goal_id`, `project_id`, `relation_type` |
| `/v1/goal-context-links` | goal-context-link | `goal_id`, `context_id`, `relation_type` |
| `/v1/goal-task-project-links` | goal-task-project-link | `goal_task_id`, `project_id`, `relation_type` |

## Develop and operate

```bash
uv venv .venv && uv pip install --python .venv/bin/python -e ".[dev]"
.venv/bin/pytest -q
NEON_API_KEY=... .venv/bin/goals-db provision
npm install && railway config apply && railway up --ci --service goals-api
```

Railway variables: `GOALS_DB_MODE=hosted`, `GOALS_DB_URL_API`,
`GOALS_JWT_PUBLIC_KEY_PEM`, `GOALS_JWT_ISSUER`, `EMPIRE_PLATFORM_URL`, and for the publisher `GOALS_DB_URL_PUBLISHER` and `GOALS_PUBLISHER_TOKEN`.
