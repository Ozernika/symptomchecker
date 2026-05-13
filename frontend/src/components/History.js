import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import {
  Box, Card, CardContent, Typography,
  Accordion, AccordionSummary, AccordionDetails,
  LinearProgress, Chip
} from "@mui/material";
import { ChevronDown } from "lucide-react";
import API from "./api";

const History = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    axios.get("${API}/history", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setHistory(res.data));
  }, [token]);

  if (!history.length) return (
    <Box sx={{ textAlign: "center", mt: 6, color: "#1976D2" }}>
      <Typography>История пуста</Typography>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 700, margin: "auto", mt: 4, px: 2 }}>
      <Typography variant="h5" sx={{ color: "#0D47A1", fontWeight: 700, mb: 3 }}>
        История опросов
      </Typography>
      {history.map(item => (
        <Accordion key={item.id} sx={{ borderRadius: 3, mb: 2, boxShadow: "0 4px 12px rgba(33,150,243,0.1)" }}>
          <AccordionSummary expandIcon={<ChevronDown />}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, width: "100%" }}>
              <Chip label={item.disease} color="primary" size="small" />
              <Typography variant="body2" sx={{ color: "#757575", ml: "auto" }}>
                {new Date(item.created_at).toLocaleDateString("ru-RU")}
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: "#1976D2", mb: 0.5 }}>
                Уверенность: {item.confidence}%
              </Typography>
              <LinearProgress variant="determinate" value={item.confidence}
                sx={{ height: 8, borderRadius: 4 }} />
            </Box>
            <Typography variant="body2" sx={{ color: "#424242", mb: 1 }}>
              {item.description}
            </Typography>
            <Typography variant="subtitle2" sx={{ color: "#0D47A1" }}>Рекомендации:</Typography>
            <ul>{item.recommendations.map((r, i) => (
              <li key={i}><Typography variant="body2">{r}</Typography></li>
            ))}</ul>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default History;