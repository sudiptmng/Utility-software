import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("renders all navigation links", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
    expect(screen.getByRole("link", { name: /todos/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /passwords/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /notes/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /bookmarks/i }),
    ).toBeInTheDocument();
  });

  it("renders the logout button", () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>,
    );
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });
});
