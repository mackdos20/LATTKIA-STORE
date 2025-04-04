export type Schema = {
  login_logs: {
    id?: number;
    userId: string;
    timestamp?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    success: boolean;
    failureReason?: string | null;
  }
}