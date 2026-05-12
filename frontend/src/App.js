import { useState } from "react";
import { Box, Container, Typography, AppBar, Tabs, Tab, Button } from "@mui/material";
import { Activity } from "lucide-react";
import StepForm from "./components/StepForm";
import Result from "./components/Result";
import AuthForm from "./components/AuthForm";
import History from "./components/History";
import { AuthProvider, useAuth } from "./components/AuthContext";

function Inner() {
  const { isAuth, email, logout } = useAuth();
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState(0);

  const handleTabChange = (_, newTab) => {
    setTab(newTab);
    setResult(null);
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #E3F2FD 0%, #F0F7FF 50%, #E3F2FD 100%)",
    }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: "#E3F2FD" }}>
        <Box sx={{
          display: "flex",
          alignItems: "center",
          px: 2,
        }}>
          {/* Иконка + название */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 3, py: 1 }}>
            <Box sx={{
              display: "inline-flex", p: 1, borderRadius: 2,
              background: "linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)",
              boxShadow: "0 2px 8px rgba(66, 165, 245, 0.4)",
            }}>
              <Activity size={20} color="white" />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#0D47A1", fontSize: "1rem", whiteSpace: "nowrap" }}>
          Трихолог AI
        </Typography>
          </Box>

          {/* Табы */}
         <Tabs
              value={tab}
              onChange={handleTabChange}
              TabIndicatorProps={{ style: { backgroundColor: "#1976D2" } }}
              sx={{
                flexGrow: 1,
                "& .MuiTab-root": { color: "#1976D2" },
                "& .Mui-selected": { color: "#0D47A1", fontWeight: 700 }
              }}
>
            <Tab label="Пройти тест" />
            {isAuth
              ? <Tab label="История" />
              : <Tab label="Войти / Зарегистрироваться" />
            }
          </Tabs>

          {/* Email + выход справа */}
          {isAuth && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, ml: 2 }}>
              <Typography variant="body2" sx={{ color: "#1976D2", opacity: 0.85, whiteSpace: "nowrap" }}>
                  {email}
                </Typography>
              <Button
                size="small"
                onClick={() => { logout(); setTab(0); }}
                sx={{ color: "#1976D2", whiteSpace: "nowrap" }}
              >
                Выйти
              </Button>
            </Box>
          )}
        </Box>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {tab === 0 && (
          result
            ? <Result result={result} onReset={() => setResult(null)} />
            : <StepForm setResult={setResult} />
        )}
        {tab === 1 && isAuth && <History />}
        {tab === 1 && !isAuth && <AuthForm onSuccess={() => setTab(0)} />}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}

export default App;