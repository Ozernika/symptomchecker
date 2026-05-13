import { useState } from "react";
import axios from "axios";
import { Button, Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";
import { Activity } from "lucide-react";
import API from "./api";

const questions = [
  {
    key: "hair_loss",
    label: "Есть ли повышенное выпадение волос?",
    explanation: "Можно проверить с помощью pull-теста: аккуратно потяните прядь волос в 3 разных зонах головы. Если выпадает более 5–6 волос за раз — это может указывать на повышенное выпадение."
  },
  { key: "patchy_loss", label: "Есть ли очаговое выпадение волос (залысины)?" },
  { key: "diffuse_thinning", label: "Есть ли равномерное поредение волос?" },
  { key: "frontal_recession", label: "Есть ли залысины в лобной зоне?" },
  { key: "crown_thinning", label: "Есть ли поредение на макушке?" },

  { key: "itching", label: "Есть ли зуд кожи головы?" },
  {
    key: "oily_scalp",
    label: "Кожа головы быстро становится жирной?",
    explanation: "Признак - необходимость мытья головы каждый день."
  },
  { key: "dryness", label: "Есть ли выраженная сухость кожи головы?",  explanation: "Признак - редкое мытье раз в 4-5 дней, ощущение стянутости кожи головы сразу после мытья"},
  { key: "redness", label: "Есть ли покраснение кожи головы?" },

  {
    key: "dandruff",
    label: "Есть ли перхоть?",
    explanation: "Перхоть — это мелкие белые чешуйки кожи, которые легко осыпаются."
  },
  {
    key: "scaling",
    label: "Есть ли шелушение?",
    explanation: "Шелушение — это более плотные участки отслоившейся кожи, часто крупнее перхоти."
  },
  {
  key: "greasy_flakes",
  label: "Есть ли жирные чешуйки?",
  explanation: "Жирные чешуйки — это плотные, липкие, желтоватые или сероватые скопления кожного сала и клеток кожи. Они плохо осыпаются, прилипают к коже головы и волосам и часто связаны с повышенной жирностью кожи."
},

  { key: "stress_event", label: "Был ли сильный стресс за последние 3 месяца?" },
  { key: "family_history", label: "Есть ли наследственная предрасположенность к облысению?" },
  { key: "hormonal_changes", label: "Были ли гормональные изменения?" },

  { key: "fatigue", label: "Есть ли хроническая усталость?" },
  { key: "brittle_hair", label: "Стали ли волосы ломкими?" },
  { key: "weight_loss", label: "Была ли резкая потеря веса?" },

  { key: "autoimmune_history", label: "Есть ли аутоиммунные заболевания?" },
  { key: "thinning", label: "Замечаете общее истончение волос?" }
];


const StepForm = ({ setResult }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(
    Object.fromEntries(questions.map(q => [q.key, 0]))
  );
  const [showInfo, setShowInfo] = useState(false);

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [questions[step].key]: value };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      submitData(newAnswers);
    }
  };

  const submitData = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${API}/predict`, data, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      setResult(res.data);
    } catch (err) {
      alert("Ошибка при запросе");
      console.error(err);
    }
  };

  const progress = ((step + 1) / questions.length) * 100;

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", mt: 4, px: 2 }}>

      {/* Заголовок */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Box sx={{
            display: "inline-flex", p: 2, borderRadius: 3,
            background: "linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)",
            boxShadow: "0 4px 12px rgba(66, 165, 245, 0.3)",
          }}>
            <Activity size={32} color="white" />
          </Box>
        </Box>
        <Typography variant="h3" sx={{
          fontWeight: 800, color: "#0D47A1", mb: 1,
          fontSize: { xs: "2rem", md: "2.5rem" },
        }}>
          ИИ-трихолог
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 1, color: "#1976D2", fontWeight: 500 }}>
          Вопрос {step + 1} из {questions.length}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 8, borderRadius: 4, backgroundColor: "#E3F2FD",
            "& .MuiLinearProgress-bar": { backgroundColor: "#42A5F5", borderRadius: 4 }
          }}
        />
      </Box>

      {/* Question Card */}
      <Card sx={{
        borderRadius: 5,
        boxShadow: "0 8px 32px rgba(33, 150, 243, 0.15)",
        background: "linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)",
        border: "1px solid rgba(66, 165, 245, 0.2)"
      }}>
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>

  {/* Вопрос + info button */}
  <Box sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 1
  }}>
    <Typography variant="h5" sx={{
      color: "#0D47A1",
      fontWeight: 600,
      fontSize: { xs: "1.3rem", md: "1.5rem" }
    }}>
      {questions[step].label}
    </Typography>

    {/* info button */}
    {questions[step].explanation && (
      <Box
        onClick={() => setShowInfo(!showInfo)}
        sx={{
          cursor: "pointer",
          color: "#1976D2",
          fontWeight: 700,
          fontSize: 18,
          ml: 1,
          "&:hover": { opacity: 0.7 }
        }}
      >
        ℹ️
      </Box>
    )}
  </Box>

  {/* explanation block */}
  {showInfo && questions[step].explanation && (
    <Box sx={{
      mt: 2,
      px: 2,
      py: 1.5,
      borderRadius: 3,
      backgroundColor: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(66,165,245,0.3)",
      color: "#0D47A1",
      fontSize: "0.9rem",
      lineHeight: 1.5,
      maxWidth: "90%",
      margin: "12px auto 0"
    }}>
      {questions[step].explanation}
    </Box>
  )}
</Box>

          <Box sx={{
            display: "flex", gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center"
          }}>
            <Button
              variant="contained"
              onClick={() => handleAnswer(1)}
              sx={{
                flex: 1, py: 2, borderRadius: 3, fontSize: "1.1rem", fontWeight: 600,
                backgroundColor: "#42A5F5", boxShadow: "0 4px 12px rgba(66, 165, 245, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": { backgroundColor: "#1E88E5", transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(66, 165, 245, 0.4)" }
              }}
            >
              Да
            </Button>

            <Button
              variant="outlined"
              onClick={() => handleAnswer(0)}
              sx={{
                flex: 1, py: 2, borderRadius: 3, fontSize: "1.1rem", fontWeight: 600,
                borderColor: "#42A5F5", color: "#1976D2", borderWidth: 2,
                transition: "all 0.3s ease",
                "&:hover": { borderColor: "#1E88E5", borderWidth: 2,
                  backgroundColor: "rgba(66, 165, 245, 0.08)", transform: "translateY(-2px)" }
              }}
            >
              Нет
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepForm;