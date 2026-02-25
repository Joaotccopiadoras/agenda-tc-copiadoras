import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "@/pages/DashboardPage";
import LoginPage from "@/pages/LoginPage";

// Componente que protege a rota: se não tiver sessão, chuta pro login
const RotaProtegida = ({ session, children }: { session: any, children: React.ReactNode }) => {
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a sessão atual quando o app abre
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta se o usuário fez login ou logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Verificando acesso...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/" />} />
        
        <Route 
          path="/" 
          element={
            <RotaProtegida session={session}>
              <DashboardPage />
            </RotaProtegida>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;