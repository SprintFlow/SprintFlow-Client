import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import NotFoundPage from "./NotFoundPage";
import { vi } from "vitest";

// Mockeamos el componente Home para evitar que cargue todas sus dependencias (iconos, etc.)
vi.mock("./Home", () => ({
  default: () => <div>Página de Inicio Mock</div>,
}));

describe("Routing - NotFoundPage", () => {
  test("debería mostrar la página 404 para una ruta no válida", () => {
    const badRoute = "/una-ruta-que-no-existe";

    // MemoryRouter nos permite simular la navegación en la memoria.
    // Le decimos que la URL actual es 'badRoute'.
    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <Routes>
          {/* Definimos un conjunto mínimo de rutas para la prueba */}
          <Route path="/" element={<div />} /> {/* Usamos un elemento simple */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Verificamos que el contenido de la página 404 está presente
    expect(
      screen.getByRole("heading", { name: /404/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument();

    // También podemos verificar que el contenido de otra página (como Home) NO está presente
    expect(
      screen.queryByText(/página de inicio mock/i)
    ).not.toBeInTheDocument();
  });
});
