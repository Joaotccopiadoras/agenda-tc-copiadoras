import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Mail, ArrowLeft } from "lucide-react";

type ModoTela = 'login' | 'cadastro' | 'recuperacao';

export default function LoginPage() {
  const [modo, setModo] = useState<ModoTela>('login');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    setSucesso("");

    try {
      if (modo === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("Email ou senha incorretos.");
        navigate("/");

      } else if (modo === 'cadastro') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw new Error("Erro ao criar conta. A senha deve ter no mínimo 6 caracteres.");
        setSucesso("Conta criada com sucesso! Você já pode fazer login.");
        setModo('login');
        setPassword("");

      } else if (modo === 'recuperacao') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw new Error("Erro ao solicitar redefinição. Verifique o email digitado.");
        setSucesso("Se este email estiver cadastrado, você receberá um link para redefinir a senha.");
        setModo('login');
      }
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border relative">
        {modo !== 'login' && (
          <button 
            onClick={() => { setModo('login'); setErro(""); setSucesso(""); }}
            className="absolute top-6 left-6 text-gray-400 hover:text-gray-700 flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
        )}

        <div className="flex flex-col items-center mb-8 mt-4">
          <img src="/logo.png" alt="Logo" className="h-16 mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-gray-900">
            {modo === 'login' && "Gestão de Projetos"}
            {modo === 'cadastro' && "Criar Acesso"}
            {modo === 'recuperacao' && "Recuperar Senha"}
          </h1>
          <p className="text-sm text-gray-500 mt-1 text-center">
            {modo === 'login' && "Faça login para acessar o painel"}
            {modo === 'cadastro' && "Cadastre-se para acompanhar a programação"}
            {modo === 'recuperacao' && "Enviaremos um link para o seu email"}
          </p>
        </div>

        {erro && <div className="p-3 mb-4 bg-red-50 text-red-600 text-sm rounded-md border border-red-200 text-center">{erro}</div>}
        {sucesso && <div className="p-3 mb-4 bg-green-50 text-green-700 text-sm rounded-md border border-green-200 text-center">{sucesso}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input type="email" placeholder="seu@email.com" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          {modo !== 'recuperacao' && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input type="password" placeholder="••••••••" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
          )}

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-6" disabled={loading}>
            {loading ? "Aguarde..." : 
              modo === 'login' ? "Entrar no Sistema" : 
              modo === 'cadastro' ? "Confirmar Cadastro" : "Enviar Email"}
          </Button>
        </form>

        {modo === 'login' && (
          <div className="mt-6 flex flex-col items-center space-y-3 text-sm">
            <button onClick={() => { setModo('recuperacao'); setErro(""); setSucesso(""); }} className="text-blue-600 hover:underline">
              Esqueceu sua senha?
            </button>
            <div className="text-gray-500">
              Não tem acesso?{" "}
              <button onClick={() => { setModo('cadastro'); setErro(""); setSucesso(""); }} className="text-blue-600 hover:underline font-medium">
                Cadastre-se
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}