#!/usr/bin/env python3
"""
MITHAQ TENDER AI — TEST PROCUREMENT PDF GENERATOR
=================================================
Generates realistic bilingual (French / Arabic) test tender envelopes and dossiers
conforming to Algerian procurement regulations (Loi n° 23-12 and Décret 15-247):
1. `Dossier_Candidature_Atlas.pdf` (contains 142-day expired Extrait de Rôle + missing wet stamp on probité)
2. `Offre_Technique_Atlas.pdf` (contains 20 CNAS engineers list with IDs + IP68 datasheets + 10-month planning)
3. `Offre_Financiere_Atlas.pdf` (contains BPU 850,000 DZD in words vs DQE 805,000 DZD in figures discrepancy)
4. `PV_Reception_Provisoire_Wilaya16.pdf` (official provisional handover PV freeing the 20 engineers)
5. `Offre_Complete_HydroTech.pdf` (competing bidder 2: fully compliant, 28 CNAS engineers)
6. `Offre_Complete_Cosider.pdf` (competing bidder 3: tier-1 national enterprise, 180 engineers)
7. `Offre_Complete_Tell.pdf` (competing bidder 4: missing CACOBATPH, IP65 sub-threshold spec)
"""

from __future__ import annotations
import os
import fitz  # PyMuPDF

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "test_dossiers")
os.makedirs(OUTPUT_DIR, exist_ok=True)


def draw_header(page, doc_title: str, sub_title: str = ""):
    rect = fitz.Rect(30, 25, 565, 80)
    page.draw_rect(rect, color=(0.15, 0.2, 0.3), fill=(0.95, 0.97, 1.0), width=0.8)
    page.insert_text(
        (45, 42),
        "RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE",
        fontsize=10,
        fontname="helv",
        color=(0.1, 0.15, 0.25),
    )
    page.insert_text(
        (45, 55),
        "الجمهورية الجزائرية الديمقراطية الشعبية — MARCHÉS PUBLICS (LOI 23-12 & DÉCRET 15-247)",
        fontsize=8.5,
        fontname="helv",
        color=(0.3, 0.35, 0.45),
    )
    page.insert_text(
        (45, 72),
        f"{doc_title.upper()} {('— ' + sub_title) if sub_title else ''}",
        fontsize=11,
        fontname="helv",
        color=(0.0, 0.3, 0.6),
    )


def draw_stamp_box(page, rect: fitz.Rect, text: str, is_stamped: bool = True):
    bg_color = (0.9, 0.98, 0.9) if is_stamped else (1.0, 0.92, 0.92)
    border_color = (0.1, 0.6, 0.2) if is_stamped else (0.8, 0.2, 0.2)
    page.draw_rect(rect, color=border_color, fill=bg_color, width=1.0)
    status_icon = "[CACHET HUMIDE : DÉTECTÉ ET CONFORME]" if is_stamped else "[ATTENTION : CACHET HUMIDE MANQUANT]"
    page.insert_text(
        (rect.x0 + 8, rect.y0 + 15),
        status_icon,
        fontsize=8.5,
        fontname="helv",
        color=border_color,
    )
    page.insert_text(
        (rect.x0 + 8, rect.y0 + 30),
        text,
        fontsize=8,
        fontname="helv",
        color=(0.2, 0.2, 0.2),
    )


def generate_dossier_candidature_atlas():
    path = os.path.join(OUTPUT_DIR, "Dossier_Candidature_Atlas.pdf")
    doc = fitz.open()

    # Page 1: Déclaration de candidature
    p1 = doc.new_page(width=595, height=842)
    draw_header(p1, "Dossier de Candidature", "Annexe I · Déclaration de Candidature")
    y = 105
    p1.insert_text((40, y), "APPEL D'OFFRES NATIONAL OUVERT N° 04/2026 — EPH DE MOHAMMADIA", fontsize=10, fontname="helv")
    y += 22
    p1.insert_text((40, y), "1. Dénomination de l'entreprise : SARL ATLAS CONSTRUCTIONS & HYDRAULIQUE", fontsize=9.5, fontname="helv")
    y += 16
    p1.insert_text((40, y), "2. Numéro d'Identification Fiscale (NIF) : 001216098442190", fontsize=9.5, fontname="helv")
    y += 16
    p1.insert_text((40, y), "3. Registre de Commerce (CNRC) : 16/00-0984421B16 délivré à Alger", fontsize=9.5, fontname="helv")
    y += 16
    p1.insert_text((40, y), "4. Numéro Employeur Cotisant CNAS : 16-884102-99 (Agence d'Alger)", fontsize=9.5, fontname="helv")
    y += 16
    p1.insert_text((40, y), "5. Capital Social : 50 000 000,00 DZD — Siège Social : 14 Rue Didouche Mourad, Alger", fontsize=9.5, fontname="helv")
    y += 16
    p1.insert_text((40, y), "6. Gérant & Signataire habilité : M. BENSALEM Karim (Ingénieur en Chef)", fontsize=9.5, fontname="helv")

    y += 35
    p1.insert_text((40, y), "Déclaration sur l'honneur de non-exclusion des marchés publics (Art. 75 Décret 15-247) :", fontsize=9.5, fontname="helv")
    y += 16
    p1.insert_text((40, y), "Le soussigné atteste sur l'honneur ne faire l'objet d'aucune interdiction légale de soumissionner.", fontsize=8.5, fontname="helv")
    draw_stamp_box(p1, fitz.Rect(40, 280, 555, 340), "Signé à Alger le 12/10/2026 par M. Bensalem Karim. Cachet de la SARL apposé.", is_stamped=True)

    # Page 2: Déclaration de probité (INTENTIONALLY MISSING WET STAMP FOR TEST AUDIT)
    p2 = doc.new_page(width=595, height=842)
    draw_header(p2, "Dossier de Candidature", "Annexe II · Déclaration de Probité (Loi n° 23-12)")
    y = 110
    p2.insert_text((40, y), "ENGAGEMENT SOLENNEL DE PROBITÉ ET DE TRANSPARENCE :", fontsize=10, fontname="helv")
    y += 20
    text_probite = (
        "Je soussigné, M. BENSALEM Karim, agissant en qualité de gérant de la SARL ATLAS CONSTRUCTIONS, "
        "déclare sur l'honneur m'engager à ne consentir aucun avantage indû, commission ou rémunération "
        "à tout agent ou représentant du service contractant pendant la passation et l'exécution du marché."
    )
    p2.insert_textbox(fitz.Rect(40, y, 555, y + 60), text_probite, fontsize=9, fontname="helv")
    y += 80
    p2.insert_text((40, y), "Fait à Alger, le 12/10/2026. Le Gérant : M. Bensalem Karim [Signature manuscrite apposée]", fontsize=9, fontname="helv")
    draw_stamp_box(p2, fitz.Rect(40, y + 25, 555, y + 90), "SIGNATURE PRÉSENTE — AUCUN CACHET HUMIDE DÉTECTÉ DANS LA ZONE RÉSERVÉE (ANOMALIE BLOQUANTE FR-05/FR-11)", is_stamped=False)

    # Page 3: Extrait de Rôle (INTENTIONALLY EXPIRED 142 DAYS OLD FOR TEST AUDIT)
    p3 = doc.new_page(width=595, height=842)
    draw_header(p3, "Dossier de Candidature", "Direction Générale des Impôts · Extrait de Rôle (Apurement Fiscal)")
    y = 110
    p3.insert_text((40, y), "DIRECTION DES IMPÔTS DE LA WILAYA D'ALGER — RECETTE CENTRALE", fontsize=10, fontname="helv")
    y += 20
    p3.insert_text((40, y), "Extrait du Registre des Rôles délivré pour soumission aux marchés publics :", fontsize=9, fontname="helv")
    y += 18
    p3.insert_text((40, y), "• Contribuable : SARL ATLAS CONSTRUCTIONS & HYDRAULIQUE", fontsize=9, fontname="helv")
    y += 16
    p3.insert_text((40, y), "• NIF : 001216098442190 — Article d'imposition : 16041029841", fontsize=9, fontname="helv")
    y += 16
    p3.insert_text((40, y), "• Date de délivrance : 02 JUIN 2026 (02/06/2026)", fontsize=10, fontname="helv", color=(0.8, 0.1, 0.1))
    y += 16
    p3.insert_text((40, y), "• Situation : Rôle APURÉ de toute imposition échue à la date du 02/06/2026.", fontsize=9, fontname="helv")
    draw_stamp_box(p3, fitz.Rect(40, y + 30, 555, y + 100), "DGI Alger Centre — Visa de l'Inspecteur des Impôts (02/06/2026).\nÂge à l'ouverture des plis (22/10/2026) : 142 JOURS > PLAFOND RÉGLEMENTAIRE DE 90 JOURS.", is_stamped=False)

    # Page 4: Attestation de mise à jour CNAS
    p4 = doc.new_page(width=595, height=842)
    draw_header(p4, "Dossier de Candidature", "CNAS · Attestation de Mise à Jour & Effectif Déclaré (Q3 2026)")
    y = 110
    p4.insert_text((40, y), "CAISSE NATIONALE DES ASSURANCES SOCIALES DES TRAVAILLEURS SALARIÉS (CNAS)", fontsize=10, fontname="helv")
    y += 20
    p4.insert_text((40, y), "Attestation de régularité cotisations & Déclaration Annuelle des Salaires (DAS) :", fontsize=9, fontname="helv")
    y += 18
    p4.insert_text((40, y), "• Cotisant : SARL ATLAS CONSTRUCTIONS (N° Employeur 16-884102-99)", fontsize=9, fontname="helv")
    y += 16
    p4.insert_text((40, y), "• Date de délivrance : 25/09/2026 — Validité : jusqu'au 31/12/2026", fontsize=9, fontname="helv")
    y += 16
    p4.insert_text((40, y), "• TOTAL EFFECTIF DÉCLARÉ CNAS : 20 INGÉNIEURS DIPLÔMÉS À TEMPS PLEIN", fontsize=10, fontname="helv", color=(0.0, 0.4, 0.8))
    draw_stamp_box(p4, fitz.Rect(40, y + 30, 555, y + 95), "CNAS Agence d'Alger — Cachet humide et signature officielle apposés. Document en cours de validité.", is_stamped=True)

    # Page 5: Bilans Financiers CAC
    p5 = doc.new_page(width=595, height=842)
    draw_header(p5, "Dossier de Candidature", "Bilans Financiers Certifiés Commissaire aux Comptes (2023–2025)")
    y = 110
    p5.insert_text((40, y), "ATTESTATION DE CERTIFICATION DES COMPTES SOCIAUX (LOI N° 10-01) :", fontsize=10, fontname="helv")
    y += 20
    p5.insert_text((40, y), "• Exercice 2023 : Chiffre d'Affaires = 312 000 000 DZD | Résultat Net = +24 150 000 DZD", fontsize=9, fontname="helv")
    y += 16
    p5.insert_text((40, y), "• Exercice 2024 : Chiffre d'Affaires = 398 000 000 DZD | Résultat Net = +31 800 000 DZD", fontsize=9, fontname="helv")
    y += 16
    p5.insert_text((40, y), "• Exercice 2025 : Chiffre d'Affaires = 445 000 000 DZD | Résultat Net = +38 420 000 DZD", fontsize=9, fontname="helv")
    draw_stamp_box(p5, fitz.Rect(40, y + 30, 555, y + 95), "Cabinet d'Audit & Commissariat aux Comptes M. Belkacem (Alger) — Comptes certifiés réguliers et sincères.", is_stamped=True)

    doc.save(path)
    doc.close()
    return path


def generate_offre_technique_atlas():
    path = os.path.join(OUTPUT_DIR, "Offre_Technique_Atlas.pdf")
    doc = fitz.open()

    # Page 1: Déclaration à souscrire
    p1 = doc.new_page(width=595, height=842)
    draw_header(p1, "Offre Technique", "Annexe III · Déclaration à Souscrire & Mémoire Technique")
    y = 110
    p1.insert_text((40, y), "APPEL D'OFFRES N° 04/2026 — ÉTABLISSEMENT PUBLIC HOSPITALIER DE MOHAMMADIA", fontsize=10, fontname="helv")
    y += 22
    p1.insert_text((40, y), "Le soussigné M. Bensalem Karim s'engage à livrer et installer l'ensemble des équipements", fontsize=9, fontname="helv")
    y += 16
    p1.insert_text((40, y), "conformément aux prescriptions techniques et dans un délai strict de 10 mois.", fontsize=9, fontname="helv")
    draw_stamp_box(p1, fitz.Rect(40, y + 25, 555, y + 85), "Déclaration à souscrire datée du 12/10/2026, signée et paraphée « Lu et accepté ».", is_stamped=True)

    # Page 2: Fiches Techniques Equipements
    p2 = doc.new_page(width=595, height=842)
    draw_header(p2, "Offre Technique", "Spécifications & Conformité aux Normes Constructeur (Lot 1 & Lot 4)")
    y = 110
    p2.insert_text((40, y), "TABLEAU DE CONFORMITÉ SPÉCIFICATION PAR SPÉCIFICATION :", fontsize=10, fontname="helv")
    y += 20
    specs = [
        ("Indice d'étanchéité & protection", "IP68 exigé au CDC", "IP68 certifié TÜV Rheinland (Conforme)"),
        ("Norme qualité biomédicale", "ISO 13485 exigée", "ISO 13485:2016 certifiée"),
        ("Rendement hydraulique / débit", "Minimum 80% requis", "84.2% vérifié aux essais en banc d'essai"),
        ("Alimentation de secours", "Onduleur online 3kVA", "Onduleur double conversion 3.5kVA inclus"),
    ]
    for param, cdc_req, sub_prop in specs:
        p2.insert_text((40, y), f"• {param} :", fontsize=9, fontname="helv")
        p2.insert_text((230, y), f"{cdc_req}", fontsize=8.5, fontname="helv", color=(0.4, 0.4, 0.4))
        p2.insert_text((380, y), f"→ {sub_prop}", fontsize=8.5, fontname="helv", color=(0.1, 0.5, 0.2))
        y += 18
    draw_stamp_box(p2, fitz.Rect(40, y + 20, 555, y + 80), "Fiches techniques constructeur originales traduites en français. Conformité technique vérifiée.", is_stamped=True)

    # Page 3: Liste nominative des 20 ingénieurs (EXACT RESOURCE OVERLAP TRIGGER)
    p3 = doc.new_page(width=595, height=842)
    draw_header(p3, "Offre Technique", "Moyens Humains · Liste Nominative des 20 Ingénieurs CNAS")
    y = 110
    p3.insert_text((40, y), "ENCADREMENT TECHNIQUE DÉDIÉ AU PROJET EPH MOHAMMADIA :", fontsize=10, fontname="helv")
    y += 20
    engineers = [
        ("M. BENSALEM Karim", "Directeur de Projet", "CNAS #19840512-442", "18 ans exp."),
        ("M. MANSOURI Yacine", "Ingénieur Biomédical Principal", "CNAS #19891103-118", "12 ans exp."),
        ("M. BOUZID Sofiane", "Ingénieur Électronique", "CNAS #19910425-773", "9 ans exp."),
        ("M. AMMARI Walid", "Ingénieur Fluides Médicaux", "CNAS #19880814-329", "11 ans exp."),
        ("M. CHERIF Lyes", "Ingénieur Automatisme", "CNAS #19930219-661", "8 ans exp."),
        ("M. HADDAD Farouk", "Ingénieur Maintenance UMC", "CNAS #19901201-447", "10 ans exp."),
        ("14 Autres Ingénieurs", "Équipe Technique & Installation", "Liste CNAS DAS-Q3-8841", "5 à 8 ans exp."),
    ]
    for name, role, cnas, exp in engineers:
        p3.insert_text((40, y), f"• {name}", fontsize=9, fontname="helv")
        p3.insert_text((200, y), f"{role}", fontsize=8.5, fontname="helv")
        p3.insert_text((380, y), f"{cnas}", fontsize=8.5, fontname="helv", color=(0.0, 0.4, 0.7))
        p3.insert_text((500, y), f"{exp}", fontsize=8.5, fontname="helv")
        y += 18
    y += 10
    draw_stamp_box(p3, fitz.Rect(40, y + 10, 555, y + 80), "CONFLIT DE CAPACITÉ INTER-MARCHÉS DÉTECTÉ :\nCes 20 mêmes ingénieurs sont engagés simultanément sur AOON/11/2025/WILAYA-16 et 4 autres appels d'offres en cours.", is_stamped=False)

    doc.save(path)
    doc.close()
    return path


def generate_offre_financiere_atlas():
    path = os.path.join(OUTPUT_DIR, "Offre_Financiere_Atlas.pdf")
    doc = fitz.open()

    # Page 1: Lettre de soumission
    p1 = doc.new_page(width=595, height=842)
    draw_header(p1, "Offre Financière", "Lettre de Soumission (Modèle Réglementaire Décret 15-247)")
    y = 110
    p1.insert_text((40, y), "APPEL D'OFFRES N° 04/2026 — EPH DE MOHAMMADIA", fontsize=10, fontname="helv")
    y += 22
    p1.insert_text((40, y), "Le soumissionnaire s'engage à exécuter les prestations pour un montant global de :", fontsize=9, fontname="helv")
    y += 18
    p1.insert_text((40, y), "EN CHIFFRES : 48 500 000,00 DZD Hors Taxes (57 715 000,00 DZD Toutes Taxes Comprises)", fontsize=9.5, fontname="helv")
    y += 18
    p1.insert_text((40, y), "EN TOUTES LETTRES : Quarante-huit millions cinq cent mille dinars algériens HT.", fontsize=9.5, fontname="helv")
    draw_stamp_box(p1, fitz.Rect(40, y + 30, 555, y + 90), "Lettre de soumission dûment signée par le représentant légal avec cachet humide.", is_stamped=True)

    # Page 2: BPU vs DQE (INTENTIONAL ARITHMETIC DISCREPANCY ON ITEM 4.2)
    p2 = doc.new_page(width=595, height=842)
    draw_header(p2, "Offre Financière", "Bordereau des Prix Unitaires (BPU) & Détail Quantitatif et Estimatif (DQE)")
    y = 110
    p2.insert_text((40, y), "EXTRAIT COMPARATIF BPU VS DQE — POSTE 4.2 :", fontsize=10, fontname="helv")
    y += 22
    p2.insert_text((40, y), "• BPU Poste 4.2 (Prix Unitaire en Lettres) :", fontsize=9, fontname="helv")
    p2.insert_text((40, y + 16), "  « HUIT CENT CINQUANTE MILLE DINARS ALGÉRIENS » (850 000,00 DZD HT)", fontsize=9.5, fontname="helv", color=(0.1, 0.5, 0.2))
    y += 40
    p2.insert_text((40, y), "• DQE Poste 4.2 (Prix Unitaire reporté en Chiffres) :", fontsize=9, fontname="helv")
    p2.insert_text((40, y + 16), "  805 000,00 DZD HT pour une quantité de 6 unités = 4 830 000,00 DZD HT", fontsize=9.5, fontname="helv", color=(0.8, 0.1, 0.1))
    y += 40
    p2.insert_text((40, y), "• Écart arithmétique unitaire : 45 000,00 DZD HT / unité", fontsize=9, fontname="helv", color=(0.8, 0.1, 0.1))
    p2.insert_text((40, y + 16), "• Écart arithmétique total sur la ligne (6 unités) : 270 000,00 DZD HT", fontsize=9.5, fontname="helv", color=(0.8, 0.1, 0.1))
    draw_stamp_box(p2, fitz.Rect(40, y + 35, 555, y + 105), "ANOMALIE ARITHMÉTIQUE DÉTECTÉE (ARTICLE 19 DU CDC & ART. 72 DÉCRET 15-247) :\nLe prix en toutes lettres du BPU (850 000 DZD) prévaut légalement sur le DQE (805 000 DZD).", is_stamped=False)

    doc.save(path)
    doc.close()
    return path


def generate_pv_reception_provisoire_wilaya16():
    path = os.path.join(OUTPUT_DIR, "PV_Reception_Provisoire_Wilaya16.pdf")
    doc = fitz.open()
    p1 = doc.new_page(width=595, height=842)
    draw_header(p1, "Procès-Verbal de Réception Provisoire", "Projet Hydraulique Wilaya d'Alger · AOON/11/2025/WILAYA-16")
    y = 110
    p1.insert_text((40, y), "DIRECTION DES RESSOURCES EN EAU DE LA WILAYA D'ALGER", fontsize=10, fontname="helv")
    y += 22
    p1.insert_text((40, y), "PROCÈS-VERBAL DE RÉCEPTION PROVISOIRE SANS RÉSERVE", fontsize=11, fontname="helv", color=(0.1, 0.5, 0.2))
    y += 20
    text = (
        "Le 15 Octobre 2026, la commission de réception réunie sur le site du projet constate "
        "l'achèvement complet et régulier des travaux confiés à la SARL ATLAS CONSTRUCTIONS & HYDRAULIQUE.\n\n"
        "La réception provisoire est prononcée sans aucune réserve. Les équipes techniques, ingénieurs et "
        "matériels mobilisés sur ce marché (soit 20 ingénieurs déclarés à la CNAS) sont par la présente "
        "intégralement libérés de leurs obligations contractuelles sur ce site."
    )
    p1.insert_textbox(fitz.Rect(40, y, 555, y + 90), text, fontsize=9.5, fontname="helv")
    draw_stamp_box(p1, fitz.Rect(40, y + 105, 555, y + 175), "Cachet de la Direction des Ressources en Eau d'Alger & Visa du Maître d'Ouvrage (15/10/2026).\nPREUVE OFFICIELLE DE LIBÉRATION DES 20 INGÉNIEURS POUR LE NOUVEAU MARCHÉ.", is_stamped=True)
    doc.save(path)
    doc.close()
    return path


def generate_competing_bidders():
    paths = []
    # HydroTech
    p_hydro = os.path.join(OUTPUT_DIR, "Offre_Complete_HydroTech.pdf")
    d1 = fitz.open()
    p = d1.new_page(width=595, height=842)
    draw_header(p, "Offre Soumissionnaire 2", "EURL HydroTech Algérie · Dossier Complet")
    p.insert_text((40, 110), "SOUMISSION EURL HYDROTECH ALGÉRIE (NIF : 000916023341890) :", fontsize=10, fontname="helv")
    p.insert_text((40, 130), "• Effectif déclaré CNAS : 28 Ingénieurs (20 mobilisés, 8 disponibles)", fontsize=9, fontname="helv")
    p.insert_text((40, 150), "• Extrait de rôle : Délivré le 18/09/2026 (daté de 34 jours, 100% conforme)", fontsize=9, fontname="helv")
    p.insert_text((40, 170), "• Fiches techniques : Pompes IP68 certifiées, rendement 85.5%", fontsize=9, fontname="helv")
    p.insert_text((40, 190), "• Note technique estimée COPEO : 85.5 / 100 points (Admis à l'ouverture financière)", fontsize=9.5, fontname="helv", color=(0.1, 0.5, 0.2))
    draw_stamp_box(p, fitz.Rect(40, 220, 555, 280), "Dossier vérifié recevable sans anomalie documentaire.", is_stamped=True)
    d1.save(p_hydro)
    d1.close()
    paths.append(p_hydro)

    # Cosider
    p_cosider = os.path.join(OUTPUT_DIR, "Offre_Complete_Cosider.pdf")
    d2 = fitz.open()
    p = d2.new_page(width=595, height=842)
    draw_header(p, "Offre Soumissionnaire 3", "SPA Cosider Canalisations · Dossier Complet")
    p.insert_text((40, 110), "SOUMISSION SPA COSIDER CANALISATIONS (NIF : 000016001239841) :", fontsize=10, fontname="helv")
    p.insert_text((40, 130), "• Effectif déclaré CNAS : 180 Ingénieurs (20 mobilisés, large capacité excédentaire)", fontsize=9, fontname="helv")
    p.insert_text((40, 150), "• Extrait de rôle & CNAS : Validité certifiée au 01/10/2026 (21 jours)", fontsize=9, fontname="helv")
    p.insert_text((40, 170), "• Matériel en propre : Parc lourd 100% en propre avec cartes grises conformes", fontsize=9, fontname="helv")
    p.insert_text((40, 190), "• Note technique estimée COPEO : 98.0 / 100 points (Admis)", fontsize=9.5, fontname="helv", color=(0.1, 0.5, 0.2))
    draw_stamp_box(p, fitz.Rect(40, 220, 555, 280), "Dossier d'entreprise publique leader vérifié 100% conforme.", is_stamped=True)
    d2.save(p_cosider)
    d2.close()
    paths.append(p_cosider)

    # Tell
    p_tell = os.path.join(OUTPUT_DIR, "Offre_Complete_Tell.pdf")
    d3 = fitz.open()
    p = d3.new_page(width=595, height=842)
    draw_header(p, "Offre Soumissionnaire 4", "SARL Tell Équipements · Dossier Incomplet")
    p.insert_text((40, 110), "SOUMISSION SARL TELL ÉQUIPEMENTS (NIF : 001516087712394) :", fontsize=10, fontname="helv")
    p.insert_text((40, 130), "• Attestation CACOBATPH : MANQUANTE au dossier de candidature (Rejet de recevabilité)", fontsize=9, fontname="helv", color=(0.8, 0.1, 0.1))
    p.insert_text((40, 150), "• Spécification technique : Fiche constructeur IP65 au lieu de IP68 exigé", fontsize=9, fontname="helv", color=(0.8, 0.1, 0.1))
    p.insert_text((40, 170), "• Note technique estimée COPEO : 51.0 / 100 points (Sous le seuil éliminatoire de 60 pts)", fontsize=9.5, fontname="helv", color=(0.8, 0.1, 0.1))
    draw_stamp_box(p, fitz.Rect(40, 220, 555, 280), "Dossier non recevable administrativement et techniquement éliminé.", is_stamped=False)
    d3.save(p_tell)
    d3.close()
    paths.append(p_tell)

    return paths


def generate_all_test_procurement_pdfs():
    print(f"Generating Algerian public procurement test PDFs in: {OUTPUT_DIR}")
    p1 = generate_dossier_candidature_atlas()
    p2 = generate_offre_technique_atlas()
    p3 = generate_offre_financiere_atlas()
    p4 = generate_pv_reception_provisoire_wilaya16()
    competing = generate_competing_bidders()
    all_files = [p1, p2, p3, p4] + competing
    for f in all_files:
        print(f"  ✓ Created: {os.path.basename(f)} ({os.path.getsize(f)} bytes)")
    return all_files


if __name__ == "__main__":
    generate_all_test_procurement_pdfs()
