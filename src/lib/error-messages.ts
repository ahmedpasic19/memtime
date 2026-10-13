import { isApiError } from "@/lib/errors";

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        return error.message || "Please check your input.";
      case 404:
        return error.message || "Resource not found.";
      case 429:
        return "Too many requests, please wait a minute and try again.";
      default:
        return error.message || "Something went wrong. Please try again.";
    }
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}
