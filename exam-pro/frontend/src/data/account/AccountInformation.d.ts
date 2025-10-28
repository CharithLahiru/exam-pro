export interface AccountInformation {
  userId?: number;
  username: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  mobile?: string | null;
  accountType?: string | null;
  isActive: boolean;
  password: string;
}

export interface SignInInformation {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}