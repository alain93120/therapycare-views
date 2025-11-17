# Liste des catégories et spécialités TherapyCare

CATEGORIES = {
    "psychologie": {
        "name": "Psychologie & Psychothérapie",
        "description": "Thérapies mentales, émotionnelles, troubles anxieux, soutien psychologique",
        "specialties": [
            "Psychologue",
            "Psychologue Clinicien",
            "Psychopraticien",
            "Psychothérapeute",
            "Psychologue-Psychothérapeute",
            "Psychanalyste",
            "Neuropsychologue",
            "Thérapeute de couple",
            "Thérapeute familial",
            "Thérapeute systémique",
            "Thérapeute du sommeil",
            "Psychomotricien",
            "Thérapeute ICV",
            "Somatic Experiencing",
            "Thérapie ACT",
            "Thérapie narrative",
            "Analyse transactionnelle",
            "Thérapie transgénérationnelle",
            "Thérapie sensorielle",
            "Thérapie désensibilisation phobies",
            "Constellations familiales",
            "Hypnose spirituelle",
            "Thérapie spirituelle",
            "Thérapie holistique",
            "Sophro-analyse"
        ]
    },
    "hypnose": {
        "name": "Hypnose & Thérapies brèves",
        "description": "Interventions rapides, troubles ciblés, gestion du stress",
        "specialties": [
            "Hypnothérapeute",
            "Praticien en Hypnose",
            "Praticien EMDR",
            "Praticien EFT",
            "Praticien en Thérapies Brèves",
            "PNL avancée",
            "Thérapie brève intégrative",
            "Rebirth / Respiration consciente",
            "Respiration holotropique",
            "Cohérence cardiaque"
        ]
    },
    "medecines-douces": {
        "name": "Médecines douces & Soins naturels",
        "description": "Approches naturelles, prévention, santé globale",
        "specialties": [
            "Naturopathe",
            "Phytothérapeute",
            "Aromathérapeute",
            "Aromatologue",
            "Iridologue",
            "Micronutritionniste",
            "Nutritionniste holistique",
            "Naturopathe enfants",
            "Naturopathe sportifs",
            "Conseiller anti-inflammatoire",
            "Conseiller compléments alimentaires",
            "Conseiller en phytothérapie"
        ]
    },
    "energetique": {
        "name": "Énergétique & Thérapies vibratoires",
        "description": "Soins par l'énergie, harmonisation, rééquilibrage",
        "specialties": [
            "Praticien Reiki",
            "Maître Reiki",
            "Reiki Usui",
            "Reiki Karuna",
            "Reiki Shamballa",
            "Praticien LaHoChi",
            "Bioénergéticien",
            "Psycho-Énergéticien",
            "Énergéticien quantique",
            "Magnétiseur",
            "Guérisseur énergétique",
            "Thérapeute essénien",
            "Thérapeute angélique",
            "Lithothérapeute",
            "Chromothérapeute",
            "Guérison prânique",
            "ThetaHealing",
            "Soins akashiques",
            "Passeurs d'âmes",
            "Praticien en Énergétique",
            "Praticien en Énergétique Chinoise"
        ]
    },
    "medecine-chinoise": {
        "name": "Médecine chinoise & pratiques asiatiques",
        "description": "Equilibre des énergies, méridiens, traditions ancestrales",
        "specialties": [
            "Praticien en Médecine Chinoise",
            "Acupuncteur",
            "Praticien Tuina",
            "Cupping therapy (ventouses)",
            "Praticien Shiatsu",
            "Amma assis",
            "Qi Gong thérapeutique",
            "Tai Chi thérapeutique"
        ]
    },
    "massages": {
        "name": "Massages & Thérapies corporelles",
        "description": "Bien-être, relâchement musculaire, détente physique",
        "specialties": [
            "Praticien en Massage Bien-être",
            "Massothérapeute",
            "Fasciathérapeute",
            "Praticien en Drainage Lymphatique",
            "Drainage lymphatique Renata França",
            "Stretching thérapeutique",
            "Ostéopathe",
            "Étiopathe",
            "Chiropracteur",
            "Thérapie cranio-sacrée",
            "Bowen",
            "Posturologue",
            "Podologue postural",
            "Gym douce & mobilité",
            "Pilates thérapeutique"
        ]
    },
    "yoga": {
        "name": "Yoga, respiration & pratiques corps-esprit",
        "description": "Alignement, mouvement conscient, respiration",
        "specialties": [
            "Professeur de Yoga",
            "Yoga thérapeute",
            "Instructeur Pilates",
            "Coach Breathwork",
            "Instructeur méditation",
            "Méthode Feldenkrais",
            "Méthode Alexander",
            "Méthode Wim Hof"
        ]
    },
    "sonotherapie": {
        "name": "Bien-être sonore & vibrations",
        "description": "Sons, fréquences, relaxation profonde",
        "specialties": [
            "Sonothérapeute",
            "Praticien bols tibétains",
            "Praticien diapasons thérapeutiques",
            "Tambours sacrés"
        ]
    },
    "coaching-personnel": {
        "name": "Coaching personnel",
        "description": "Accompagnement de vie, motivation, mindset",
        "specialties": [
            "Coach de Vie",
            "Coach en Bien-être",
            "Coach en Développement Personnel",
            "Coach Professionnel Certifié",
            "Coach confiance en soi",
            "Coach gestion du stress",
            "Coach hypersensibilité",
            "Coach relations amoureuses",
            "Coach séparation/divorce",
            "Coach en image",
            "Coach Relooking",
            "Coach organisation & gestion du temps",
            "Coach leadership",
            "Coach parentalité positive",
            "Coach parental et familial",
            "Coach scolaire",
            "Coach mental sportif"
        ]
    },
    "coaching-professionnel": {
        "name": "Coaching professionnel & business",
        "description": "Performance, reconversion, objectifs",
        "specialties": [
            "Coach business",
            "Coach réorientation professionnelle",
            "Coach reconversion",
            "Coach finances personnelles"
        ]
    },
    "nutrition": {
        "name": "Nutrition & alimentation",
        "description": "Équilibre alimentaire, perte de poids",
        "specialties": [
            "Diététicien-Nutritionniste",
            "Conseiller en Nutrition",
            "Coach Nutritionnel",
            "Coach perte de poids",
            "Coach rééquilibrage alimentaire",
            "Alimentation intuitive",
            "Praticien jeûne & détox"
        ]
    },
    "maternite-famille": {
        "name": "Accompagnement maternité / famille",
        "description": "Périnatalité, parentalité, accompagnement familial",
        "specialties": [
            "Doula",
            "Accompagnant périnatal",
            "Coach parental et familial",
            "Coach parentalité positive",
            "Graphothérapeute"
        ]
    }
}

def get_all_categories():
    return [{
        "slug": slug,
        "name": data["name"],
        "description": data["description"],
        "specialties_count": len(data["specialties"])
    } for slug, data in CATEGORIES.items()]

def get_category_by_slug(slug):
    return CATEGORIES.get(slug)

def get_all_specialties():
    specialties = []
    for category_slug, category_data in CATEGORIES.items():
        for specialty in category_data["specialties"]:
            specialties.append({
                "name": specialty,
                "category_slug": category_slug,
                "category_name": category_data["name"]
            })
    return specialties
