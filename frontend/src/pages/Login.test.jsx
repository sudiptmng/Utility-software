import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

function renderWithRouter(ui) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe("Login page", () => {
  it("renders username and password fields", () => {
    renderWithRouter(<Login />);
    expect(
      screen.getByPlaceholderText(/enter your username/i),
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter your password/i),
    ).toBeInTheDocument();
  });

  it("renders the login button", () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  it("renders a link to the register page", () => {
    renderWithRouter(<Login />);
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });
});
