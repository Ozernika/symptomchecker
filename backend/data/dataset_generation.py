import random
import pandas as pd

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

DISEASES = {
    "androgenetic_alopecia": {
        "required": ["hair_loss", "thinning"],
        "common": {
            "frontal_recession": 0.8,
            "crown_thinning": 0.75,
            "family_history": 0.7
        },
        "rare": {
            "itching": 0.15,
            "dandruff": 0.2,
            "oily_scalp": 0.2
        }
    },

    "telogen_effluvium": {
        "required": ["hair_loss", "diffuse_thinning"],
        "common": {
            "stress_event": 0.8,
            "fatigue": 0.6,
            "brittle_hair": 0.5,
            "weight_loss": 0.4,
            "hormonal_changes": 0.5
        },
        "rare": {
            "dryness": 0.2,
            "itching": 0.15
        }
    },

    "alopecia_areata": {
        "required": ["hair_loss", "patchy_loss"],
        "common": {
            "autoimmune_history": 0.6
        },
        "rare": {
            "itching": 0.1
        }
    },

    "seborrheic_dermatitis": {
        "required": ["itching", "oily_scalp", "dandruff"],
        "common": {
            "redness": 0.7,
            "greasy_flakes": 0.8
        },
        "rare": {
            "hair_loss": 0.25,
            "thinning": 0.2
        }
    },

    "psoriasis": {
        "required": ["redness", "white_scales"],
        "common": {
            "itching": 0.7,
            "dryness": 0.5
        },
        "rare": {
            "hair_loss": 0.2,
            "thinning": 0.15
        }
    },

    "dry_scalp": {
        "required": ["dryness"],
        "common": {
            "itching": 0.4
        },
        "rare": {
            "white_scales": 0.3
        }
    },

    "healthy": {
        "required": [],
        "common": {},
        "rare": {
            "itching": 0.05,
            "dandruff": 0.05,
            "oily_scalp": 0.05
        }
    }
}


def generate_case(disease_name, template):

    row = {f: 0 for f in FEATURES}

    # required
    for f in template["required"]:
        if f in row:
            row[f] = 1

    # common
    for f, p in template["common"].items():
        if f in row and random.random() < p:
            row[f] = 1

    # rare
    for f, p in template["rare"].items():
        if f in row and random.random() < p:
            row[f] = 1

    noise_count = random.randint(0, 2)
    noise_features = random.sample(FEATURES, k=noise_count)

    for f in noise_features:
        if f not in template["required"] and random.random() < 0.05:
            row[f] = 1

    row["disease"] = disease_name

    return row

rows = []

SAMPLES = {
    "androgenetic_alopecia": 120,
    "telogen_effluvium": 120,
    "alopecia_areata": 100,
    "seborrheic_dermatitis": 120,
    "psoriasis": 100,
    "dry_scalp": 80,
    "healthy": 120
}

for disease, count in SAMPLES.items():
    template = DISEASES[disease]

    for _ in range(count):
        rows.append(generate_case(disease, template))

for _ in range(40):
    row = {f: random.randint(0, 1) for f in FEATURES}
    row["disease"] = "inconclusive"
    rows.append(row)


df = pd.DataFrame(rows)

df = df[FEATURES + ["disease"]]

df = df.sample(frac=1, random_state=42).reset_index(drop=True)

df.to_csv("trichology_dataset.csv", index=False)

print(df.head())
print("\nDataset distribution:")
print(df["disease"].value_counts())