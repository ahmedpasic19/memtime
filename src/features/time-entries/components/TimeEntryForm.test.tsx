import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { defaultCreateValues } from "../schema";
import { TimeEntryForm } from "./TimeEntryForm";

const emptyInfinite = {
  data: { pages: [[]] },
  isLoading: false,
  isError: false,
  hasNextPage: false,
  fetchNextPage: vi.fn(),
  isFetchingNextPage: false,
};

vi.mock("@/features/hierarchy/hooks", () => ({
  useClients: () => emptyInfinite,
  useProjects: () => emptyInfinite,
  useTasks: () => emptyInfinite,
  useTask: () => ({ data: undefined, isLoading: false, isError: false }),
}));

describe("TimeEntryForm", () => {
  it("shows validation errors on invalid submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <TimeEntryForm
        mode="create"
        defaultValues={defaultCreateValues()}
        onSubmit={onSubmit}
        onCancel={() => {}}
        isSubmitting={false}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Create entry" }));

    await waitFor(() => {
      expect(screen.getByText(/select a task/i)).toBeInTheDocument();
    });
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
