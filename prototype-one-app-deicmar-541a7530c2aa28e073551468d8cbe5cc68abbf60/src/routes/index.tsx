import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAppDrawerContext } from "../shared/contexts";
import { Dashboard, Dashboard2, Dashboard3, Dashboard5, ListagemDeCidades, Blog, Update } from "../pages";
export const AppRoutes = () => {
  const { setDrawerOptions } = useAppDrawerContext();
  useEffect(() => {
    setDrawerOptions([
      { icon: "fact_check", path: "/direct", label: "Escolher Gate" },
      { icon: "fact_check", path: "/lista-checklists", label: "Ultimos checklists" },
    ]);
  }, []);

  return (
    <Routes>
      <Route path="/cadastro-facial" element={<Dashboard />} />
      <Route path="/cadastro-lacre" element={<Dashboard2 />} />
      <Route path="/checklist" element={<Dashboard3 />} />
      <Route path="/agendamento2" element={<Dashboard5 />} />
      <Route path="/lista-checklists" element={<ListagemDeCidades />} />
      <Route path="/direct" element={<Blog />} />
      <Route path="/update" element={<Update />} />

      <Route path="*" element={<Navigate to="/cadastro-facial" />} />
    </Routes>
  );
};
