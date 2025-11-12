import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { vi } from "vitest";

vi.mock("./Home", () => ({
  default: () => <div>Página de Inicio Mock</div>,
}));

describe("Routing - NotFoundPage", () => {
  test("should display 404 page for invalid route", () => {
    const badRoute = "/una-ruta-que-no-existe";

    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /404/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/página de inicio mock/i)
    ).not.toBeInTheDocument();
  });
});