import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TrainerInventory from "./index";
import { InventoryItem } from "@/types/trainer";

describe("TrainerInventory", () => {
  const mockOnUseItem = jest.fn();
  const mockOnAddItem = jest.fn();
  const mockOnIncreaseItem = jest.fn();
  const mockOnUpdatePokedollars = jest.fn();

  const sampleInventory: InventoryItem[] = [
    {
      id: "1",
      name: "Potion",
      quantity: 3,
      description: "Restores 20 HP",
    },
    {
      id: "2",
      name: "Pokeball",
      quantity: 5,
    },
    {
      id: "3",
      name: "Super Potion",
      quantity: 1,
      description: "Restores 50 HP",
    },
  ];

  const defaultProps = {
    inventory: sampleInventory,
    pokedollars: 100,
    onUseItem: mockOnUseItem,
    onAddItem: mockOnAddItem,
    onIncreaseItem: mockOnIncreaseItem,
    onUpdatePokedollars: mockOnUpdatePokedollars,
    isEditable: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders inventory section with correct item count", () => {
    render(<TrainerInventory {...defaultProps} />);

    expect(screen.getByText("Inventory (3)")).toBeInTheDocument();
  });

  it("renders empty inventory message when no items", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    expect(screen.getByText("Inventory (0)")).toBeInTheDocument();
  });

  it("initially does not show inventory items", () => {
    render(<TrainerInventory {...defaultProps} />);

    expect(screen.queryByText("Potion")).not.toBeInTheDocument();
    expect(screen.queryByText("Pokeball")).not.toBeInTheDocument();
  });

  it("shows inventory items when inventory is expanded", () => {
    render(<TrainerInventory {...defaultProps} />);

    const inventoryButton = screen.getByText("Inventory (3)");
    fireEvent.click(inventoryButton);

    expect(screen.getByText("Potion")).toBeInTheDocument();
    expect(screen.getByText("x3")).toBeInTheDocument();
    expect(screen.getByText("Restores 20 HP")).toBeInTheDocument();
    expect(screen.getByText("Pokeball")).toBeInTheDocument();
    expect(screen.getByText("x5")).toBeInTheDocument();
    expect(screen.getByText("Super Potion")).toBeInTheDocument();
    expect(screen.getByText("x1")).toBeInTheDocument();
    expect(screen.getByText("Restores 50 HP")).toBeInTheDocument();
  });

  it("hides inventory items when inventory is collapsed", () => {
    render(<TrainerInventory {...defaultProps} />);

    const inventoryButton = screen.getByText("Inventory (3)");

    // Expand
    fireEvent.click(inventoryButton);
    expect(screen.getByText("Potion")).toBeInTheDocument();

    // Collapse
    fireEvent.click(inventoryButton);
    expect(screen.queryByText("Potion")).not.toBeInTheDocument();
  });

  it("shows empty inventory message when expanded with no items", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    expect(screen.getByText("No items in inventory")).toBeInTheDocument();
  });

  it("calls onUseItem when Use button is clicked", () => {
    render(<TrainerInventory {...defaultProps} />);

    const inventoryButton = screen.getByText("Inventory (3)");
    fireEvent.click(inventoryButton);

    const useButtons = screen.getAllByText("Use");
    fireEvent.click(useButtons[0]);

    expect(mockOnUseItem).toHaveBeenCalledTimes(1);
    expect(mockOnUseItem).toHaveBeenCalledWith("1");
  });

  it("calls onIncreaseItem when + button is clicked", () => {
    render(<TrainerInventory {...defaultProps} />);

    const inventoryButton = screen.getByText("Inventory (3)");
    fireEvent.click(inventoryButton);

    const plusButtons = screen.getAllByText("+");
    fireEvent.click(plusButtons[0]);

    expect(mockOnIncreaseItem).toHaveBeenCalledTimes(1);
    expect(mockOnIncreaseItem).toHaveBeenCalledWith("1");
  });

  it("shows Add Item button when editable", () => {
    render(<TrainerInventory {...defaultProps} />);

    const inventoryButton = screen.getByText("Inventory (3)");
    fireEvent.click(inventoryButton);

    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });

  it("does not show Use buttons when not editable", () => {
    render(<TrainerInventory {...defaultProps} isEditable={false} />);

    const inventoryButton = screen.getByText("Inventory (3)");
    fireEvent.click(inventoryButton);

    expect(screen.queryByText("Use")).not.toBeInTheDocument();
    expect(screen.queryByText("+")).not.toBeInTheDocument();
  });

  it("does not show Add Item button when not editable", () => {
    render(<TrainerInventory {...defaultProps} isEditable={false} />);

    const inventoryButton = screen.getByText("Inventory (3)");
    fireEvent.click(inventoryButton);

    expect(screen.queryByText("Add Item")).not.toBeInTheDocument();
  });

  it("opens add item modal when Add Item button is clicked", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    expect(screen.getByText("Add New Item")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Item name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Quantity")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Description (optional)"),
    ).toBeInTheDocument();
  });

  it("closes add item modal when cancel button is clicked", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByText("Add New Item")).not.toBeInTheDocument();
  });

  it("closes add item modal when X button is clicked", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const closeButton = screen.getByRole("button", { name: "" }); // X button has no text
    fireEvent.click(closeButton);

    expect(screen.queryByText("Add New Item")).not.toBeInTheDocument();
  });

  it("calls onAddItem when item is added with valid data", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const nameInput = screen.getByPlaceholderText("Item name");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const descriptionInput = screen.getByPlaceholderText(
      "Description (optional)",
    );

    fireEvent.change(nameInput, { target: { value: "Test Item" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test description" },
    });

    const addButtons = screen.getAllByText("Add Item");
    const addButton = addButtons[1]; // The second one is in the modal
    fireEvent.click(addButton);

    expect(mockOnAddItem).toHaveBeenCalledTimes(1);
    expect(mockOnAddItem).toHaveBeenCalledWith({
      name: "Test Item",
      quantity: 2,
      description: "Test description",
    });
  });

  it("calls onAddItem without description when description is empty", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const nameInput = screen.getByPlaceholderText("Item name");
    const quantityInput = screen.getByPlaceholderText("Quantity");

    fireEvent.change(nameInput, { target: { value: "Test Item" } });
    fireEvent.change(quantityInput, { target: { value: "3" } });

    const addButtons = screen.getAllByText("Add Item");
    const addButton = addButtons[1]; // The second one is in the modal
    fireEvent.click(addButton);

    expect(mockOnAddItem).toHaveBeenCalledWith({
      name: "Test Item",
      quantity: 3,
      description: undefined,
    });
  });

  it("resets form fields after adding an item", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const nameInput = screen.getByPlaceholderText("Item name");
    const quantityInput = screen.getByPlaceholderText("Quantity");
    const descriptionInput = screen.getByPlaceholderText(
      "Description (optional)",
    );

    fireEvent.change(nameInput, { target: { value: "Test Item" } });
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Test description" },
    });

    const addButtons = screen.getAllByText("Add Item");
    const addButton = addButtons[1]; // The second one is in the modal
    fireEvent.click(addButton);

    // Modal should close and form should reset
    expect(screen.queryByText("Add New Item")).not.toBeInTheDocument();

    // Reopen modal to check if fields are reset
    fireEvent.click(addItemButton);

    const newNameInput = screen.getByPlaceholderText("Item name");
    const newQuantityInput = screen.getByPlaceholderText("Quantity");
    const newDescriptionInput = screen.getByPlaceholderText(
      "Description (optional)",
    );

    expect(newNameInput).toHaveValue("");
    expect(newQuantityInput).toHaveValue(1);
    expect(newDescriptionInput).toHaveValue("");
  });

  it("disables Add Item button when name is empty", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const addButtons = screen.getAllByText("Add Item");
    const addButton = addButtons[1]; // The second one is in the modal
    expect(addButton).toBeDisabled();
  });

  it("enables Add Item button when name is provided", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const nameInput = screen.getByPlaceholderText("Item name");
    fireEvent.change(nameInput, { target: { value: "Test Item" } });

    const addButtons = screen.getAllByText("Add Item");
    const addButton = addButtons[1]; // The second one is in the modal
    expect(addButton).toBeEnabled();
  });

  it("enforces minimum quantity of 1", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const quantityInput = screen.getByPlaceholderText("Quantity");
    fireEvent.change(quantityInput, { target: { value: "0" } });

    expect(quantityInput).toHaveValue(1);
  });

  it("handles invalid quantity input gracefully", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const quantityInput = screen.getByPlaceholderText("Quantity");
    fireEvent.change(quantityInput, { target: { value: "invalid" } });

    expect(quantityInput).toHaveValue(1);
  });

  it("trims whitespace from item name", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const nameInput = screen.getByPlaceholderText("Item name");
    fireEvent.change(nameInput, { target: { value: "  Test Item  " } });

    const addButtons = screen.getAllByText("Add Item");
    const addButton = addButtons[1]; // The second one is in the modal
    fireEvent.click(addButton);

    expect(mockOnAddItem).toHaveBeenCalledWith({
      name: "Test Item",
      quantity: 1,
      description: undefined,
    });
  });

  it("does not add item if name is only whitespace", () => {
    render(<TrainerInventory {...defaultProps} inventory={[]} />);

    const inventoryButton = screen.getByText("Inventory (0)");
    fireEvent.click(inventoryButton);

    const addItemButton = screen.getByText("Add Item");
    fireEvent.click(addItemButton);

    const nameInput = screen.getByPlaceholderText("Item name");
    fireEvent.change(nameInput, { target: { value: "   " } });

    const addButtons = screen.getAllByText("Add Item");
    const addButton = addButtons[1]; // The second one is in the modal
    fireEvent.click(addButton);

    expect(mockOnAddItem).not.toHaveBeenCalled();
    expect(screen.getByText("Add New Item")).toBeInTheDocument(); // Modal should stay open
  });

  describe("Pokedollars", () => {
    it("displays pokedollars with correct formatting", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={1234567} />);

      expect(screen.getByText("Pokedollars")).toBeInTheDocument();
      expect(screen.getByText("1,234,567")).toBeInTheDocument();
    });

    it("displays 0 pokedollars when amount is 0", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("shows pokedollar input and buttons when editable", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      expect(screen.getByPlaceholderText("Amount")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Subtract" }),
      ).toBeInTheDocument();
    });

    it("does not show pokedollar input and buttons when not editable", () => {
      render(
        <TrainerInventory
          {...defaultProps}
          pokedollars={100}
          isEditable={false}
        />,
      );

      expect(screen.queryByPlaceholderText("Amount")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Add" }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: "Subtract" }),
      ).not.toBeInTheDocument();
    });

    it("calls onUpdatePokedollars when Add button is clicked", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const amountInput = screen.getByPlaceholderText("Amount");
      const addButton = screen.getByRole("button", { name: "Add" });

      fireEvent.change(amountInput, { target: { value: "50" } });
      fireEvent.click(addButton);

      expect(mockOnUpdatePokedollars).toHaveBeenCalledWith(150);
    });

    it("calls onUpdatePokedollars when Subtract button is clicked", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const amountInput = screen.getByPlaceholderText("Amount");
      const subtractButton = screen.getByRole("button", { name: "Subtract" });

      fireEvent.change(amountInput, { target: { value: "30" } });
      fireEvent.click(subtractButton);

      expect(mockOnUpdatePokedollars).toHaveBeenCalledWith(70);
    });

    it("prevents pokedollars from going below 0", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={50} />);

      const amountInput = screen.getByPlaceholderText("Amount");
      const subtractButton = screen.getByRole("button", { name: "Subtract" });

      fireEvent.change(amountInput, { target: { value: "100" } });
      fireEvent.click(subtractButton);

      expect(mockOnUpdatePokedollars).toHaveBeenCalledWith(0);
    });

    it("clears amount input after adding pokedollars", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const amountInput = screen.getByPlaceholderText(
        "Amount",
      ) as HTMLInputElement;
      const addButton = screen.getByRole("button", { name: "Add" });

      fireEvent.change(amountInput, { target: { value: "50" } });
      fireEvent.click(addButton);

      expect(amountInput.value).toBe("");
    });

    it("clears amount input after subtracting pokedollars", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const amountInput = screen.getByPlaceholderText(
        "Amount",
      ) as HTMLInputElement;
      const subtractButton = screen.getByRole("button", { name: "Subtract" });

      fireEvent.change(amountInput, { target: { value: "25" } });
      fireEvent.click(subtractButton);

      expect(amountInput.value).toBe("");
    });

    it("disables Add and Subtract buttons when amount is empty", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const addButton = screen.getByRole("button", { name: "Add" });
      const subtractButton = screen.getByRole("button", { name: "Subtract" });

      expect(addButton).toBeDisabled();
      expect(subtractButton).toBeDisabled();
    });

    it("disables Add and Subtract buttons when amount is 0", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const amountInput = screen.getByPlaceholderText("Amount");
      const addButton = screen.getByRole("button", { name: "Add" });
      const subtractButton = screen.getByRole("button", { name: "Subtract" });

      fireEvent.change(amountInput, { target: { value: "0" } });

      expect(addButton).toBeDisabled();
      expect(subtractButton).toBeDisabled();
    });

    it("enables Add and Subtract buttons when valid amount is entered", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const amountInput = screen.getByPlaceholderText("Amount");
      const addButton = screen.getByRole("button", { name: "Add" });
      const subtractButton = screen.getByRole("button", { name: "Subtract" });

      fireEvent.change(amountInput, { target: { value: "25" } });

      expect(addButton).not.toBeDisabled();
      expect(subtractButton).not.toBeDisabled();
    });

    it("handles invalid amount input gracefully", () => {
      render(<TrainerInventory {...defaultProps} pokedollars={100} />);

      const amountInput = screen.getByPlaceholderText("Amount");
      const addButton = screen.getByRole("button", { name: "Add" });

      fireEvent.change(amountInput, { target: { value: "invalid" } });
      fireEvent.click(addButton);

      expect(mockOnUpdatePokedollars).not.toHaveBeenCalled();
    });
  });
});
