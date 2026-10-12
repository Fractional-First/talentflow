import type { AuthError } from "@supabase/supabase-js"

// supabase-js does not export ErrorCode; AuthError["code"] is ErrorCode | (string & {}).
type KnownLiterals<T> = T extends string ? (string extends T ? never : T) : never

export type AuthErrorCode = KnownLiterals<AuthError["code"]>

// RFC 6749 §4.1.2.1
export type OAuthErrorType =
  | "invalid_request"
  | "unauthorized_client"
  | "access_denied"
  | "unsupported_response_type"
  | "invalid_scope"
  | "server_error"
  | "temporarily_unavailable"

export type AuthRedirectParam =
  | "access_token"
  | "refresh_token"
  | "error"
  | "error_code"
  | "error_description"

export const AUTH_ERROR_CODE = {
  otpExpired: "otp_expired",
} as const satisfies Record<string, AuthErrorCode>

export const OAUTH_ERROR = {
  accessDenied: "access_denied",
  serverError: "server_error",
} as const satisfies Record<string, OAuthErrorType>
