import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell";
import CalendarPage from "./pages/CalendarPage";
import DashboardPage from "./pages/DashboardPage";
import FavoritesPage from "./pages/FavoritesPage";
import GeneratePage from "./pages/GeneratePage";
import IdeaDetailPage from "./pages/IdeaDetailPage";
import LibraryPage from "./pages/LibraryPage";
import NewIdeaPage from "./pages/NewIdeaPage";
import NotFoundPage from "./pages/NotFoundPage";
import { GenerationProvider } from "./store/GenerationContext";
import { IdeasProvider } from "./store/IdeasContext";
import { UIProvider } from "./store/UIContext";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/layout.css";
import "./styles/ideas.css";
import "./styles/calendar.css";
import "./styles/dashboard.css";

/**
 * Raíz de la aplicación: rutas + proveedores de estado.
 *   UIProvider         avisos, confirmaciones, diálogo de programación
 *   IdeasProvider      ideas (única puerta a services/ideasService)
 *   GenerationProvider borradores de Gemini pendientes de revisar
 */
export default function App() {
  return (
    <BrowserRouter>
      <UIProvider>
        <IdeasProvider>
          <GenerationProvider>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<DashboardPage />} />
                <Route path="generar" element={<GeneratePage />} />
                <Route path="ideas" element={<LibraryPage />} />
                <Route path="ideas/nueva" element={<NewIdeaPage />} />
                <Route path="ideas/:id" element={<IdeaDetailPage />} />
                <Route path="calendario" element={<CalendarPage />} />
                <Route path="favoritos" element={<FavoritesPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </GenerationProvider>
        </IdeasProvider>
      </UIProvider>
    </BrowserRouter>
  );
}
