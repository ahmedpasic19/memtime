import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/errors";

import { getErrorMessage } from "./error-messages";

describe("getErrorMessage", () => {
  it.each([
    [new ApiError(400, "Bad field"), "Bad field"],
    [new ApiError(404, "Time entry not found"), "Time entry not found"],
    [
      new ApiError(429, "Too many"),
      "Too many requests, please wait a minute and try again.",
    ],
    [new ApiError(500, "Server broke"), "Server broke"],
    [new Error("Oops"), "Oops"],
    [null, "Something went wrong. Please try again."],
  ])("maps errors to user-facing copy", (error, expected) => {
    expect(getErrorMessage(error)).toBe(expected);
  });
});
