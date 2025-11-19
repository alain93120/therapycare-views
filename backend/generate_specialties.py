#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de génération du fichier specialties_descriptions.py
avec les 192 spécialités extraites du PDF
"""

# En-tête du fichier
header = '''# Descriptions détaillées des spécialités TherapyCare
# VERSION COMPLÈTE - 192 spécialités réparties en 11 catégories
# Généré automatiquement à partir du PDF fourni

SPECIALTIES_DESCRIPTIONS = {
'''

footer = '''
}

def get_specialty_description(specialty_name):
    """Retourne la description complète d'une spécialité"""
    return SPECIALTIES_DESCRIPTIONS.get(specialty_name)

def get_specialties_by_category(category_slug):
    """Retourne toutes les spécialités d'une catégorie avec leurs descriptions"""
    return {
        name: desc for name, desc in SPECIALTIES_DESCRIPTIONS.items()
        if desc.get("category") == category_slug
    }
'''

print("✅ Script de génération prêt")
print("📝 En-tête créé")
