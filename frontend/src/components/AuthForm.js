import { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import {
  Box, Card, CardContent, TextField,
  Button, Typography, Tabs, Tab, Alert
} from "@mui/material";

const AuthForm = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    setError(""); setSuccess("");
    const url = tab === 0
      ? "http://127.0.0.1:5000/login"
      : "http://127.0.0.1:5000/register";
    try {
      const res = await axios.post(url, { email, password });
      if (tab === 0) {
        login(res.data.token, res.data.email);
      } else {
        setSuccess("Регистрация успешна! Теперь войдите.");
        setTab(0);
      }
    } catch (e) {
      setError(e.response?.data?.error || "Ошибка");
    }
  };

  return (
    <Box sx={{ maxWidth: 440, margin: "auto", mt: 6, px: 2 }}>
      <Card sx={{ borderRadius: 5, boxShadow: "0 8px 32px rgba(33,150,243,0.15)" }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ color: "#0D47A1", fontWeight: 700, textAlign: "center", mb: 2 }}>
            Войти в аккаунт
          </Typography>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
            <Tab label="Вход" />
            <Tab label="Регистрация" />
          </Tabs>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <TextField
            fullWidth label="Email" value={email} type="email"
            onChange={e => setEmail(e.target.value)}
            sx={{ mb: 2 }} size="small"
          />
          <TextField
            fullWidth label="Пароль" value={password} type="password"
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            sx={{ mb: 3 }} size="small"
          />
          <Button
            fullWidth variant="contained" onClick={handleSubmit}
            sx={{ borderRadius: 3, py: 1.5, backgroundColor: "#42A5F5",
              "&:hover": { backgroundColor: "#1E88E5" } }}
          >
            {tab === 0 ? "Войти" : "Зарегистрироваться"}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthForm;