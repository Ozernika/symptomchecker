import { Card, CardContent, Typography, LinearProgress, Alert, Box, Button } from "@mui/material";
import { CheckCircle, RefreshCw } from "lucide-react";

const Result = ({ result, onReset }) => {
  if (!result) return null;

  return (
    <Box sx={{
      maxWidth: 700,
      margin: "auto",
      mt: 4,
      px: 2
    }}>
      <Card
        sx={{
          borderRadius: 5,
          boxShadow: '0 8px 32px rgba(33, 150, 243, 0.15)',
          background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
          border: '1px solid rgba(66, 165, 245, 0.2)'
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>

            <Typography
              variant="h5"
              sx={{
                color: '#0D47A1',
                fontWeight: 700,
                mb: 1
              }}
            >
              Результат анализа
            </Typography>
          </Box>

          {/* Disease */}
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              p: 3,
              mb: 3,
              border: '1px solid rgba(66, 165, 245, 0.2)'
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                color: '#1976D2',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                letterSpacing: 1
              }}
            >
              Возможное состояние
            </Typography>
            <Typography
              variant="h5"
              sx={{
                color: '#0D47A1',
                fontWeight: 700
              }}
            >
              {result.disease}
            </Typography>
          </Box>

          {/* Confidence */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#1976D2',
                  fontWeight: 600
                }}
              >
                Уверенность модели
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#1976D2',
                  fontWeight: 700
                }}
              >
                {result.confidence}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={result.confidence}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: '#E3F2FD',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: result.confidence > 70 ? '#42A5F5' : '#42A5F5',
                  borderRadius: 6
                }
              }}
            />
          </Box>

          {/* Description */}
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 3,
              p: 3,
              mb: 3,
              border: '1px solid rgba(66, 165, 245, 0.2)'
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#424242',
                lineHeight: 1.7
              }}
            >
              {result.description}
            </Typography>
          </Box>

          {/* Recommendations */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: '#0D47A1',
                fontWeight: 700
              }}
            >
              Рекомендации:
            </Typography>
            <Box component="ul" sx={{
              pl: 3,
              '& li': {
                color: '#424242',
                mb: 1.5,
                lineHeight: 1.7
              }
            }}>
              {result.recommendations.map((rec, i) => (
                <li key={i}>
                  <Typography variant="body1">{rec}</Typography>
                </li>
              ))}
            </Box>
          </Box>

          {/* Warning Alert */}
          <Alert
            severity="warning"
            sx={{
              mb: 3,
              borderRadius: 3,
              backgroundColor: '#FFF3E0',
              border: '1px solid #FFB74D',
              '& .MuiAlert-icon': {
                color: '#F57C00'
              }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Данный результат носит информационный характер и не является медицинским диагнозом.
              Для точной диагностики и назначения лечения рекомендуется обратиться к врачу-трихологу.
            </Typography>
          </Alert>

          {/* Reset Button */}
          {onReset && (
            <Box sx={{ textAlign: 'center' }}>
              <Button
                onClick={onReset}
                variant="outlined"
                startIcon={<RefreshCw size={20} />}
                sx={{
                  borderRadius: 3,
                  py: 1.5,
                  px: 4,
                  borderColor: '#42A5F5',
                  color: '#1976D2',
                  borderWidth: 2,
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#1E88E5',
                    borderWidth: 2,
                    backgroundColor: 'rgba(66, 165, 245, 0.08)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Пройти тест заново
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Result;
