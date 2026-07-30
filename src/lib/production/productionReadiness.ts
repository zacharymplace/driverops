import { ARCHITECTURE_FREEZE_STATUS } from "@/lib/architecture/architectureFreeze";
import type {
  ProductionReadinessCheck,
  ProductionReadinessReport,
} from "@/types/production";

export type ProductionEnv =
  NodeJS.ProcessEnv & {
    NEXT_PUBLIC_DRIVEROPS_APP_ENV?: string;
    DRIVEROPS_STORAGE_BACKEND?: string;
    DRIVEROPS_DATABASE_URL?: string;
    DRIVEROPS_AUTH_REQUIRED?: string;
    DRIVEROPS_BACKUP_ENABLED?: string;
  };

export function getProductionReadinessReport(
  env: ProductionEnv = process.env
): ProductionReadinessReport {
  const storageBackend = env.DRIVEROPS_STORAGE_BACKEND ?? "localStorage";
  const databaseBacked = ["sqlite", "postgres"].includes(storageBackend);

  const checks: ProductionReadinessCheck[] = [
    {
      id: "architecture-freeze",
      label: "Architecture freeze",
      passed: ARCHITECTURE_FREEZE_STATUS.frozen,
      detail: "Architecture must remain frozen during alpha validation.",
    },
    {
      id: "app-env",
      label: "App environment",
      passed: Boolean(env.NEXT_PUBLIC_DRIVEROPS_APP_ENV),
      detail: "NEXT_PUBLIC_DRIVEROPS_APP_ENV must be set.",
    },
    {
      id: "storage-backend",
      label: "Storage backend",
      passed: Boolean(env.DRIVEROPS_STORAGE_BACKEND),
      detail: "DRIVEROPS_STORAGE_BACKEND must be explicitly configured.",
    },
    {
      id: "database-url",
      label: "Database URL",
      passed: !databaseBacked || Boolean(env.DRIVEROPS_DATABASE_URL),
      detail: "Database-backed deployments require DRIVEROPS_DATABASE_URL.",
    },
    {
      id: "auth-required",
      label: "Authentication setting",
      passed: env.DRIVEROPS_AUTH_REQUIRED === "true",
      detail: "Production should explicitly require authentication.",
    },
    {
      id: "backups",
      label: "Backups",
      passed: env.DRIVEROPS_BACKUP_ENABLED === "true",
      detail: "Production should explicitly enable backups.",
    },
  ];

  const blockers = checks.filter((check) => !check.passed);

  return {
    status: blockers.length === 0 ? "READY" : "BLOCKED",
    checks,
    blockers,
  };
}
