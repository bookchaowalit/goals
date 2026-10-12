import { defineRailway, project, service } from "railway/iac";

// goals: the Goals cell. Variables stay unmanaged (secrets live in Railway only).
// goals-api sleeps when idle (Railway Serverless) and wakes on the next request.
// goals-publisher is a cron sweep of the outbox that exits after each run.
// Every service runs in Singapore next to Neon (aws-ap-southeast-1) and empire-platform; the IaC does not
// carry the region, so after the first deploy: railway scale --service <svc> asia-southeast1-eqsg3a=1 us-east4-eqdc4a=0
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

  return project("goals", {
    variables: { managed: false },
    resources: [api, publisher],
  });
});
