vaccines = [
    {
        "vaccine_name": "BCG",
        "description": "Given at birth to protect infants from severe forms of tuberculosis.",
        "protect_against": "Tuberculosis",
        "doses_needed": 1,
        "is_mandatory": True
    },
    {
        "vaccine_name": "OPV (Oral Polio Vaccine)",
        "description": "Oral vaccine that protects against poliovirus.",
        "protect_against": "Polio",
        "doses_needed": 4,
        "is_mandatory": True
    },
    {
        "vaccine_name": "Pentavalent (DTP-HepB-Hib)",
        "description": "Combination vaccine protecting against 5 serious diseases.",
        "protect_against": "Diphtheria, Tetanus, Pertussis, Hepatitis B, Hib",
        "doses_needed": 3,
        "is_mandatory": True
    },
    {
        "vaccine_name": "PCV (Pneumococcal Conjugate Vaccine)",
        "description": "Protects against pneumococcal infections like pneumonia and meningitis.",
        "protect_against": "Pneumonia, Meningitis",
        "doses_needed": 3,
        "is_mandatory": True
    },
    {
        "vaccine_name": "Rotavirus",
        "description": "Oral vaccine to prevent severe diarrhea in infants.",
        "protect_against": "Rotavirus diarrhea",
        "doses_needed": 2,
        "is_mandatory": False
    },
    {
        "vaccine_name": "Measles / MR",
        "description": "Protects against measles (and rubella in MR/MMR forms).",
        "protect_against": "Measles, Rubella",
        "doses_needed": 2,
        "is_mandatory": True
    },
    {
        "vaccine_name": "MMR",
        "description": "Protects against measles, mumps, and rubella.",
        "protect_against": "Measles, Mumps, Rubella",
        "doses_needed": 2,
        "is_mandatory": False
    },
    {
        "vaccine_name": "Varicella",
        "description": "Protects against chickenpox.",
        "protect_against": "Chickenpox",
        "doses_needed": 2,
        "is_mandatory": False
    },
    {
        "vaccine_name": "Hepatitis A",
        "description": "Protects against Hepatitis A liver infection.",
        "protect_against": "Hepatitis A",
        "doses_needed": 2,
        "is_mandatory": False
    },
    {
        "vaccine_name": "HPV",
        "description": "Prevents infections that can lead to cervical and other cancers.",
        "protect_against": "Human Papillomavirus (HPV)",
        "doses_needed": 2,
        "is_mandatory": False
    }
]


schedules = [
  {
    "vaccine_id": "35808979-4d3e-4afd-92ff-61ef484c6846",
    "dose_num": 1,
    "min_age_days": 0,
    "max_age_days": 56
  },

  {
    "vaccine_id": "9ce1e351-4bc8-43e3-91a6-13623d43ddc7",
    "dose_num": 1,
    "min_age_days": 0,
    "max_age_days": 14
  },
  {
    "vaccine_id": "9ce1e351-4bc8-43e3-91a6-13623d43ddc7",
    "dose_num": 2,
    "min_age_days": 42,
    "max_age_days": 70
  },
  {
    "vaccine_id": "9ce1e351-4bc8-43e3-91a6-13623d43ddc7",
    "dose_num": 3,
    "min_age_days": 70,
    "max_age_days": 98
  },
  {
    "vaccine_id": "9ce1e351-4bc8-43e3-91a6-13623d43ddc7",
    "dose_num": 4,
    "min_age_days": 98,
    "max_age_days": 126
  },

  {
    "vaccine_id": "1b449273-3f13-42bc-8ad5-12444db30cb1",
    "dose_num": 1,
    "min_age_days": 42,
    "max_age_days": 70
  },
  {
    "vaccine_id": "1b449273-3f13-42bc-8ad5-12444db30cb1",
    "dose_num": 2,
    "min_age_days": 70,
    "max_age_days": 98
  },
  {
    "vaccine_id": "1b449273-3f13-42bc-8ad5-12444db30cb1",
    "dose_num": 3,
    "min_age_days": 98,
    "max_age_days": 126
  },

  {
    "vaccine_id": "0ae85ad9-b948-423e-8c25-f3a8a9414652",
    "dose_num": 1,
    "min_age_days": 42,
    "max_age_days": 70
  },
  {
    "vaccine_id": "0ae85ad9-b948-423e-8c25-f3a8a9414652",
    "dose_num": 2,
    "min_age_days": 70,
    "max_age_days": 98
  },
  {
    "vaccine_id": "0ae85ad9-b948-423e-8c25-f3a8a9414652",
    "dose_num": 3,
    "min_age_days": 98,
    "max_age_days": 126
  },

  {
    "vaccine_id": "cf888f1e-7aa4-4328-9cc6-6e34fcb0a60f",
    "dose_num": 1,
    "min_age_days": 42,
    "max_age_days": 70
  },
  {
    "vaccine_id": "cf888f1e-7aa4-4328-9cc6-6e34fcb0a60f",
    "dose_num": 2,
    "min_age_days": 70,
    "max_age_days": 112
  },

  {
    "vaccine_id": "f1baf3e0-ab33-4dcc-851e-7e80d4781d53",
    "dose_num": 1,
    "min_age_days": 270,
    "max_age_days": 365
  },
  {
    "vaccine_id": "f1baf3e0-ab33-4dcc-851e-7e80d4781d53",
    "dose_num": 2,
    "min_age_days": 450,
    "max_age_days": 540
  },

  {
    "vaccine_id": "7b0df439-2c50-4a7a-85c2-fa058ab0448f",
    "dose_num": 1,
    "min_age_days": 365,
    "max_age_days": 455
  },
  {
    "vaccine_id": "7b0df439-2c50-4a7a-85c2-fa058ab0448f",
    "dose_num": 2,
    "min_age_days": 1460,
    "max_age_days": 2190
  },

  {
    "vaccine_id": "beaf068e-bb5b-465d-8167-c19c9ea1976d",
    "dose_num": 1,
    "min_age_days": 365,
    "max_age_days": 455
  },
  {
    "vaccine_id": "beaf068e-bb5b-465d-8167-c19c9ea1976d",
    "dose_num": 2,
    "min_age_days": 1460,
    "max_age_days": 2190
  },

  {
    "vaccine_id": "82ed04fe-1268-407d-a1f2-ce00eaaa0b99",
    "dose_num": 1,
    "min_age_days": 365,
    "max_age_days": 455
  },
  {
    "vaccine_id": "82ed04fe-1268-407d-a1f2-ce00eaaa0b99",
    "dose_num": 2,
    "min_age_days": 545,
    "max_age_days": 730
  },

  {
    "vaccine_id": "63e9de20-0ffb-418b-8dff-edd8191df35d",
    "dose_num": 1,
    "min_age_days": 3285,
    "max_age_days": 4015
  },
  {
    "vaccine_id": "63e9de20-0ffb-418b-8dff-edd8191df35d",
    "dose_num": 2,
    "min_age_days": 3465,
    "max_age_days": 4380
  }
]


import requests

API_URL = "http://localhost:8000/api/vaccines/create-vaccine-option"  # <-- change this

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_TOKEN_HERE"  # remove if not needed
}

print("{Das}")
for v in vaccines:
    response = requests.post(API_URL, json=v, headers=headers)
    
    if response.status_code in (200, 201):
        print(f"✅ Created")
    else:
        print(f"❌ Failed: ")
        # print(response.status_code, response.text)