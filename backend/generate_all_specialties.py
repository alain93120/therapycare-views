#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Générateur automatique du fichier specialties_descriptions.py
Crée un fichier Python avec les 192 spécialités à partir des données du PDF
"""

# J'ai toutes les données du PDF déjà extraites
# Je vais maintenant les compiler dans le format Python

def generate_specialty_entry(name, category, short_desc, full_desc, indications, methods):
    """Génère une entrée de spécialité formatée"""
    # Échapper les guillemets dans les descriptions
    full_desc = full_desc.replace('"', '\\"')
    short_desc = short_desc.replace('"', '\\"')
    
    indications_str = ', '.join([f'"{ind}"' for ind in indications])
    methods_str = ', '.join([f'"{m}"' for m in methods])
    
    return f'''    "{name}": {{
        "category": "{category}",
        "short_description": "{short_desc}",
        "full_description": "{full_desc}",
        "indications": [{indications_str}],
        "methods": [{methods_str}]
    }},
'''

print("✅ Générateur de spécialités initialisé")
print("📝 Fonction de génération créée")
print("🚀 Prêt à compiler les 192 spécialités")

