# DriverOps Production Readiness

Status: pre-production  
Architecture status: frozen for alpha validation

## Production goals

DriverOps should not be treated as production-ready until it has:

1. Durable persistence
2. Authentication
3. Environment validation
4. Backup/export path
5. Deployment checklist
6. Real data import path
7. Monitoring plan
8. Rollback process

## Required environment variables

- `NEXT_PUBLIC_DRIVEROPS_APP_ENV`
- `DRIVEROPS_STORAGE_BACKEND`
- `DRIVEROPS_DATABASE_URL`
- `DRIVEROPS_AUTH_REQUIRED`
- `DRIVEROPS_BACKUP_ENABLED`

## Deployment checklist

Before production deployment:

- `npm run check` passes
- `npm audit` reports zero vulnerabilities
- architecture remains frozen
- storage backend is explicitly configured
- database URL exists if backend is database-backed
- auth requirement is explicitly configured
- backup setting is explicitly configured
- snapshot export remains available
- prelaunch warnings remain enabled

## Alpha constraint

Until real operating data exists, production deployment should be treated as hosted alpha only.
