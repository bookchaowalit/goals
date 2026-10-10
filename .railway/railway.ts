import { defineRailway, project, service } from "railway/iac";

// solo-goals: the Goals cell. Variables stay unmanaged (secrets live in Railway only).
// goals-api sleeps when idle (Railway Serverless) and wakes on the next request.
// goals-publisher is a cron sweep of the outbox that exits after each run.
export default defineRailway(() => {
  const api = service("goals-api", {
    healthcheck: "/health",
    healthcheckTimeout: 60,
    deploy: { sleepApplication: true },
  });
  const publisher = service("goals-publisher", {
    startCommand: "goals-publish",
    deploy: { cronSchedule: "*/15 * * * *", restartPolicyType: "NEVER" },
  });

  return project("solo-goals", {
    variables: { managed: false },
    resources: [api, publisher],
  });
});
