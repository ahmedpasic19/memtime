import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TreeNode } from "./TreeNode";

describe("TreeNode", () => {
  afterEach(() => {
    cleanup();
  });

  it("calls onToggle when clicked", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    const { rerender } = render(
      <TreeNode label="Client A" expanded={false} onToggle={onToggle}>
        <div>Child content</div>
      </TreeNode>,
    );

    await user.click(screen.getByRole("button", { name: /Client A/i }));
    expect(onToggle).toHaveBeenCalledOnce();

    rerender(
      <TreeNode label="Client A" expanded onToggle={onToggle}>
        <div>Child content</div>
      </TreeNode>,
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("shows loading skeleton when expanded and loading", () => {
    const { container } = render(
      <TreeNode label="Client A" expanded onToggle={() => {}} isLoading>
        <div>Child</div>
      </TreeNode>,
    );

    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("shows empty message when isEmpty", () => {
    render(
      <TreeNode
        label="Client A"
        expanded
        onToggle={() => {}}
        isEmpty
        emptyMessage="No projects"
      >
        <div>Child</div>
      </TreeNode>,
    );

    expect(screen.getByText("No projects")).toBeInTheDocument();
  });

  it("shows error alert when isError", () => {
    render(
      <TreeNode
        label="Client A"
        expanded
        onToggle={() => {}}
        isError
        errorMessage="Rate limited"
      />,
    );

    expect(screen.getByText("Rate limited")).toBeInTheDocument();
  });
});
