import pickle
import pandas as pd
import numpy as np

RECOMMENDATIONS = {

    "healthy": {
        "description": "На основе введённых данных выраженных признаков заболеваний кожи головы не выявлено.",
        "advice": [
            "Продолжайте поддерживать текущий уход за волосами",
            "Поддерживайте сбалансированное питание",
        ]
    },

    "androgenetic_alopecia": {
        "description": "Андрогенная алопеция — постепенное истончение волос, часто связанное с наследственностью.",
        "advice": [
            "Рекомендуется консультация трихолога",
            "Возможна терапия миноксидилом",
            "Контролируйте стресс и питание",
            "При раннем начале лечение обычно эффективнее"
        ]
    },

    "telogen_effluvium": {
        "description": "Телогеновое выпадение волос часто связано со стрессом, болезнью или дефицитами.",
        "advice": [
            "Проверить уровень железа и витамина D",
            "Оценить уровень стресса и качество сна",
            "Нормализовать питание",
            "При длительном выпадении обратиться к врачу"
        ]
    },

    "alopecia_areata": {
        "description": "Очаговая алопеция — аутоиммунное состояние, при котором появляются участки выпадения волос.",
        "advice": [
            "Рекомендуется консультация трихолога",
            "Не использовать агрессивные средства для волос",
            "Проверить наличие аутоиммунных заболеваний",
            "Избегать травмирования кожи головы"
        ]
    },

    "seborrheic_dermatitis": {
        "description": "Себорейный дерматит — воспалительное состояние кожи головы с зудом и жирными чешуйками.",
        "advice": [
            "Использовать лечебные шампуни",
            "Избегать агрессивных средств ухода",
            "Снизить уровень стресса",
            "При выраженном воспалении обратиться к врачу"
        ]
    },

    "psoriasis": {
        "description": "Псориаз кожи головы сопровождается покраснением и плотными белыми чешуйками.",
        "advice": [
            "Рекомендуется консультация специалиста",
            "Не травмировать кожу головы",
            "Использовать назначенные врачом средства",
            "Избегать раздражающих косметических продуктов"
        ]
    },

    "dry_scalp": {
        "description": "Сухость кожи головы может быть связана с уходом, климатом или недостатком увлажнения.",
        "advice": [
            "Использовать увлажняющие средства",
            "Избегать слишком частого мытья головы",
            "Пить достаточно воды",
            "Использовать мягкие шампуни"
        ]
    },

    "inconclusive": {
        "description": "Симптомы не позволяют уверенно определить состояние кожи головы.",
        "advice": [
            "Следите за динамикой симптомов",
            "Проверьте уровень витаминов и гормонов",
            "Смените уход (некоторые компоненты шампуней могут вызывать аллергию, например экстракты перца, цитруса, формальдегиды или агрессивные сульфаты)",
            "При усилении выпадения волос обратитесь к врачу"
        ]
    }
}

DISEASE_NAMES = {
    "healthy": "Выраженных проблем не выявлено",
    "androgenetic_alopecia": "Андрогенная алопеция",
    "telogen_effluvium": "Телогеновое выпадение волос",
    "alopecia_areata": "Очаговая алопеция",
    "seborrheic_dermatitis": "Себорейный дерматит",
    "psoriasis": "Псориаз кожи головы",
    "dry_scalp": "Сухость кожи головы",
    "inconclusive": "Требуется дополнительная оценка"
}

with open("model/model.pkl", "rb") as f:
    model = pickle.load(f)

with open("model/encoder.pkl", "rb") as f:
    le = pickle.load(f)

FEATURES = [
    "hair_loss",
    "patchy_loss",
    "diffuse_thinning",
    "frontal_recession",
    "crown_thinning",
    "itching",
    "oily_scalp",
    "dryness",
    "redness",
    "dandruff",
    "white_scales",
    "greasy_flakes",
    "stress_event",
    "family_history",
    "hormonal_changes",
    "fatigue",
    "brittle_hair",
    "weight_loss",
    "autoimmune_history",
    "thinning"
]

def predict_disease(data):

    row = {}

    for feature in FEATURES:
        row[feature] = int(data.get(feature, 0))

    df = pd.DataFrame([row])

    pred = model.predict(df)
    proba = model.predict_proba(df)

    disease_en = le.inverse_transform(pred)[0]

    confidence = float(np.max(proba[0]))

    if confidence < 0.45:
        disease_en = "inconclusive"

    info = RECOMMENDATIONS.get(disease_en, {})

    top_indices = np.argsort(proba[0])[::-1][:3]

    possible_conditions = []

    for idx in top_indices:

        disease_code = le.inverse_transform([idx])[0]

        possible_conditions.append({
            "disease": DISEASE_NAMES.get(disease_code, disease_code),
            "probability": round(float(proba[0][idx]) * 100, 2)
        })

    return {
        "disease": DISEASE_NAMES.get(disease_en, disease_en),
        "confidence": round(confidence * 100, 2),
        "description": info.get("description", ""),
        "recommendations": info.get("advice", []),
        "possible_conditions": possible_conditions
    }