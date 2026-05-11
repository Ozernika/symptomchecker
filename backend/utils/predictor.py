import pickle
import pandas as pd

RECOMMENDATIONS = {
    "healthy": {
    "description": "На основе введённых данных выраженных проблем не выявлено.",
    "advice": [
        "Продолжайте поддерживать текущий уход за волосами",
        "Соблюдайте сбалансированное питание",
        "При появлении симптомов обратитесь к специалисту"
    ]
    },
    "androgenetic_alopecia": {
        "description": "Генетически обусловленное выпадение волос.",
        "advice": [
            "Обратиться к трихологу",
            "Использовать препараты с миноксидилом",
            "Сбалансировать питание",
            "Снизить уровень стресса"
        ]
    },
    "diffuse_alopecia": {
        "description": "Равномерное выпадение волос, часто связано со стрессом или дефицитами.",
        "advice": [
            "Проверить уровень витаминов",
            "Нормализовать питание",
            "Обратиться к врачу"
        ]
    },
    "seborrheic_dermatitis": {
        "description": "Воспалительное заболевание кожи головы.",
        "advice": [
            "Использовать лечебные шампуни",
            "Избегать жирной пищи",
            "Обратиться к дерматологу"
        ]
    },
    "dandruff": {
        "description": "Перхоть, связанная с нарушением микрофлоры кожи головы.",
        "advice": [
            "Использовать шампуни от перхоти",
            "Регулярно мыть голову",
            "Избегать стрессов"
        ]
    },
    "psoriasis": {
        "description": "Хроническое заболевание кожи головы.",
        "advice": [
            "Обратиться к врачу",
            "Избегать раздражающих средств",
            "Использовать назначенные препараты"
        ]
    },
    "dry_scalp": {
        "description": "Сухость кожи головы.",
        "advice": [
            "Использовать увлажняющие средства",
            "Избегать частого мытья",
            "Пить больше воды"
        ]
    },
    "oily_seborrhea": {
        "description": "Повышенная жирность кожи головы.",
        "advice": [
            "Использовать шампуни для жирной кожи",
            "Снизить потребление жирной пищи",
            "Регулярно очищать кожу головы"
        ]
    }
}

DISEASE_NAMES = {
    "healthy": "Состояние без выраженных симптомов",
    "dandruff": "Синдром перхоти",
    "androgenetic_alopecia": "Андрогенная алопеция",
    "diffuse_alopecia": "Диффузная алопеция",
    "seborrheic_dermatitis": "Себорейный дерматит",
    "psoriasis": "Псориаз кожи головы",
    "dry_scalp": "Сухость кожи головы",
    "oily_seborrhea": "Себорея"
}

with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/encoder.pkl", "rb") as f:
    le = pickle.load(f)

FEATURES = [
    "hair_loss", "itching", "oily_scalp", "dryness",
    "redness", "dandruff", "scaling", "thinning"
]

def predict_disease(data):
    df = pd.DataFrame([data], columns=FEATURES)

    pred = model.predict(df)
    proba = model.predict_proba(df)

    disease_en = le.inverse_transform(pred)[0]
    confidence = float(max(proba[0]))

    info = RECOMMENDATIONS.get(disease_en, {})

    return {
        "disease": DISEASE_NAMES.get(disease_en, disease_en),
        "confidence": round(confidence * 100, 2),
        "description": info.get("description", ""),
        "recommendations": info.get("advice", [])
    }