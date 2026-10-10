-- Roles for the goals database. Locally a superuser runs this; on Neon
-- `goals-db provision` creates the same roles through the migrator.
--
-- goals_migrator  owns the schema and runs migrations only.
-- goals_api       the API at runtime: no superuser, no BYPASSRLS, owns nothing.
-- goals_publisher sweeps and marks the outbox across workspaces; nothing else.

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'goals_migrator') THEN
        CREATE ROLE goals_migrator LOGIN NOSUPERUSER NOCREATEROLE NOBYPASSRLS;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'goals_api') THEN
        CREATE ROLE goals_api LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS NOINHERIT;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'goals_publisher') THEN
        CREATE ROLE goals_publisher LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOBYPASSRLS NOINHERIT;
    END IF;
END
$$;
