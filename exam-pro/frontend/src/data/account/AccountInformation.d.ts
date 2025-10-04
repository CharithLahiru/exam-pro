export interface AccountInformation {
  userId?: number;
  userName: string;
  firstNane: string;
  lastNane: string;
  email?: string | null;
  mobile?: string | null;
  accountType?: string | null;
  isActive: boolean;
}