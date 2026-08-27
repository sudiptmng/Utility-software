import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Register from "./Register";

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Register page", () => {
  it("renders username and password fields", () => {
    renderWithRouter(<Register />);
    expect(
      screen.getByPlaceholderText(/choose a username/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/choose a password/i),
    ).toBeInTheDocument();
  });

  it("shows an error when password is too short", () => {
    renderWithRouter(<Register />);

    fireEvent.change(screen.getByPlaceholderText(/choose a username/i), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByPlaceholderText(/choose a password/i), {
      target: { value: "123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /register/i }));

    expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
  });
});
