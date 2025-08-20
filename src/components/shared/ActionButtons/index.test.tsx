import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActionButtons from "./index";

describe("ActionButtons", () => {
  const onEditMock = jest.fn();
  const onDeleteMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the action menu button", () => {
    render(<ActionButtons />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    expect(menuButton).toBeInTheDocument();
  });

  it("initially does not show the menu dropdown", () => {
    render(<ActionButtons />);

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("shows the menu dropdown when the menu button is clicked", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("hides the menu dropdown when the menu button is clicked again", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });

    // Open menu
    fireEvent.click(menuButton);
    expect(screen.getByText("Edit")).toBeInTheDocument();

    // Close menu
    fireEvent.click(menuButton);
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("calls onEdit when Edit button is clicked", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(onEditMock).toHaveBeenCalledTimes(1);
    expect(onEditMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "click",
      }),
    );
  });

  it("calls onDelete when Delete button is clicked", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "click",
      }),
    );
  });

  it("closes the menu after Edit button is clicked", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("closes the menu after Delete button is clicked", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("closes the menu when clicking outside the component", () => {
    render(
      <div>
        <ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />
        <div data-testid="outside-element">Outside element</div>
      </div>,
    );

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    expect(screen.getByText("Edit")).toBeInTheDocument();

    const outsideElement = screen.getByTestId("outside-element");
    fireEvent.mouseDown(outsideElement);

    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("does not close the menu when clicking inside the component", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    expect(screen.getByText("Edit")).toBeInTheDocument();

    // Click on the menu container (inside the component)
    const menuContainer = screen.getByText("Edit").closest("div");
    fireEvent.mouseDown(menuContainer!);

    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  it("works without onEdit callback", () => {
    render(<ActionButtons onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    // Should not throw an error and should close the menu
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });

  it("works without onDelete callback", () => {
    render(<ActionButtons onEdit={onEditMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    // Should not throw an error and should close the menu
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("works without any callbacks", () => {
    render(<ActionButtons />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const editButton = screen.getByText("Edit");

    // Should not throw errors when clicking buttons
    fireEvent.click(editButton);
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();

    // Re-open menu to test delete
    fireEvent.click(menuButton);
    const deleteButtonAfterReopen = screen.getByText("Delete");
    fireEvent.click(deleteButtonAfterReopen);
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("prevents event propagation on menu button click", () => {
    const parentClickMock = jest.fn();

    render(
      <div onClick={parentClickMock}>
        <ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />
      </div>,
    );

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    expect(parentClickMock).not.toHaveBeenCalled();
  });

  it("prevents event propagation on edit button click", () => {
    const parentClickMock = jest.fn();

    render(
      <div onClick={parentClickMock}>
        <ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />
      </div>,
    );

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(parentClickMock).not.toHaveBeenCalled();
  });

  it("prevents event propagation on delete button click", () => {
    const parentClickMock = jest.fn();

    render(
      <div onClick={parentClickMock}>
        <ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />
      </div>,
    );

    const menuButton = screen.getByRole("button", { name: "Actions" });
    fireEvent.click(menuButton);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(parentClickMock).not.toHaveBeenCalled();
  });

  it("has proper accessibility attributes", () => {
    render(<ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />);

    const menuButton = screen.getByRole("button", { name: "Actions" });
    expect(menuButton).toHaveAttribute("title", "Actions");

    fireEvent.click(menuButton);

    const editButton = screen.getByText("Edit");
    const deleteButton = screen.getByText("Delete");

    // Check that the buttons are indeed button elements
    expect(editButton.tagName).toBe("BUTTON");
    expect(deleteButton.tagName).toBe("BUTTON");
  });

  it("cleans up event listeners on unmount", () => {
    const addEventListenerSpy = jest.spyOn(document, "addEventListener");
    const removeEventListenerSpy = jest.spyOn(document, "removeEventListener");

    const { unmount } = render(
      <ActionButtons onEdit={onEditMock} onDelete={onDeleteMock} />,
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "mousedown",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
