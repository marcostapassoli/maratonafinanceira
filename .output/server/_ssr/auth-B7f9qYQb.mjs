import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { B as Button, I as Input } from "./input-DF1O2QaK.mjs";
import { L as Label } from "./label-DCgNtzF1.mjs";
import { a as useAuth, s as supabase } from "./router-B5HLbIzO.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { A as Activity, M as Mail, s as Lock, t as LoaderCircle, d as ArrowRight } from "../_libs/lucide-react.mjs";

import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/unenv.mjs";


import "../_libs/seroval-plugins.mjs";


import "../_libs/react-dom.mjs";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/tslib.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/zod.mjs";
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
function AuthPage() {
  const {
    user,
    ready
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (ready && user) navigate({
      to: "/"
    });
  }, [ready, user, navigate]);
  async function handleEmail(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        toast.success("Conta criada! Você já está dentro.");
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
      }
    } catch (err) {
      toast.error(err?.message || "Não foi possível continuar.");
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogle() {
    if (loading) return;
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin
      });
      if (result.error) throw result.error;
    } catch (err) {
      toast.error(err?.message || "Falha no login com Google.");
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-5 w-5 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold tracking-wide uppercase text-primary", children: "Maratona Financeira" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight", children: mode === "signin" ? "Bem-vindo de volta" : "Crie sua conta" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground mt-2 text-sm", children: mode === "signin" ? "Entre para acessar seus dados em qualquer dispositivo." : "Seus dados ficam salvos na nuvem, sincronizados automaticamente." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "button", variant: "outline", size: "lg", className: "w-full mt-6 font-semibold", onClick: handleGoogle, disabled: loading, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(GoogleIcon, { className: "h-4 w-4 mr-2" }),
      "Continuar com Google"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 my-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: "ou com e-mail" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmail, className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "E-mail" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", required: true, autoComplete: "email", className: "pl-9", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "voce@exemplo.com" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", required: true, minLength: 6, autoComplete: mode === "signup" ? "new-password" : "current-password", className: "pl-9", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "lg", className: "w-full font-semibold", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        mode === "signin" ? "Entrar" : "Criar conta",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4 ml-1" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-muted-foreground mt-6", children: mode === "signin" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Ainda não tem conta?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "text-primary font-medium hover:underline", onClick: () => setMode("signup"), children: "Criar conta" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      "Já tem conta?",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", className: "text-primary font-medium hover:underline", onClick: () => setMode("signin"), children: "Entrar" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground text-center mt-8 leading-relaxed", children: "Seus dados ficam salvos com segurança e disponíveis em qualquer celular ou computador que você usar para entrar." })
  ] }) });
}
function GoogleIcon({
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { viewBox: "0 0 24 24", className, "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#EA4335", d: "M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6H12z" }) });
}
export {
  AuthPage as component
};
