export type Schema = {
  login_logs: {
    id?: number;
    userId: string;
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    success: boolean;
    failureReason?: string | null;
  }
}