-- =========================================================================================
-- MITHAQ TENDER AI — ALGERIAN PUBLIC PROCUREMENT & RESOURCE VERIFICATION PLATFORM
-- Complete PostgreSQL 16 Database Schema, Temporal Resource Overlap Engine & Seed Data
-- Aligned with Algerian Law No. 23-12, Presidential Decree 15-247, and Law 18-07 (ANPDP)
-- =========================================================================================

-- Enable required extensions for UUIDs, dense vectors, fuzzy Arabic/French matching,
-- and temporal GIST indexing on project commitment ranges.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
-- CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector for BGE-M3 dense embeddings

-- =========================================================================================
-- 1. ORGANIZATIONS & MULTI-TENANT ISOLATION
-- =========================================================================================
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_fr TEXT NOT NULL,
    name_ar TEXT,
    org_type VARCHAR(32) NOT NULL CHECK (
        org_type IN ('COMPANY', 'CONTRACTING_AUTHORITY', 'OVERSIGHT_COMMISSION')
    ),
    legal_form VARCHAR(32),                      -- SARL, SPA, EURL, EPIC, Ministère, Wilaya
    nif VARCHAR(32) UNIQUE,                      -- Numéro d'Identification Fiscale (15-20 digits)
    nis VARCHAR(32),                             -- Numéro d'Identification Statistique
    rc_number VARCHAR(64),                       -- Numéro du Registre de Commerce (CNRC)
    cnas_employer_id VARCHAR(64),                -- Numéro Cotisant CNAS Employeur
    wilaya_code VARCHAR(8),                      -- e.g., '16' (Alger), '26' (Médéa), '31' (Oran)
    verified_engineer_capacity INT DEFAULT 0,    -- Certified engineer count from latest CNAS DAS
    verified_technician_capacity INT DEFAULT 0,  -- Certified technician count from latest CNAS DAS
    verified_total_workforce INT DEFAULT 0,      -- Total employees declared on CNAS DAS
    cnas_das_reference VARCHAR(128),             -- Reference of the latest verified CNAS DAS filing
    capacity_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================================
-- 2. USERS & ROLE-BASED ACCESS CONTROL (RBAC)
-- =========================================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name_fr TEXT NOT NULL,
    full_name_ar TEXT,
    role VARCHAR(64) NOT NULL CHECK (
        role IN (
            'BID_MANAGER',            -- Responsable Marchés (Company)
            'TECHNICAL_ENGINEER',     -- Ingénieur d'Études (Company)
            'HR_FLEET_COORDINATOR',   -- Responsable Moyens Humains & Matériels (Company)
            'COPEO_CHAIRPERSON',      -- Président de la Commission d'Évaluation (Authority)
            'COPEO_EVALUATOR',        -- Membre COPEO (Authority)
            'PROCUREMENT_AUDITOR',    -- Contrôleur Commission des Marchés (Oversight)
            'TENANT_ADMIN'
        )
    ),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================================
-- 3. COMPANY DOCUMENT VAULT (REUSABLE ADMINISTRATIVE & REGULATORY FILES)
-- =========================================================================================
CREATE TABLE vault_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    doc_category VARCHAR(64) NOT NULL CHECK (
        doc_category IN (
            'EXTRAIT_DE_ROLE',        -- Apurement fiscal (< 3 months rule)
            'ATTESTATION_CNAS',       -- Mise à jour CNAS
            'ATTESTATION_CASNOS',     -- Mise à jour CASNOS
            'ATTESTATION_CACOBATPH',  -- Congés payés & chômage-intempéries (BTPH)
            'REGISTRE_COMMERCE',      -- CNRC
            'STATUTS_ENTREPRISE',     -- Statuts juridiques
            'BILAN_FINANCIER',        -- Bilans 3 dernières années + TCR
            'CASIER_JUDICIAIRE',      -- Bulletin n°3 du gérant
            'DECLARATION_PROBITE',    -- Déclaration de probité
            'BONNE_EXECUTION',        -- Attestation de bonne exécution (Référence)
            'AUTRE'
        )
    ),
    title TEXT NOT NULL,
    storage_uri TEXT NOT NULL,                   -- Encrypted S3 / MinIO path
    file_sha256 CHAR(64) NOT NULL,
    issue_date DATE,
    expiry_date DATE,                            -- Automatically computed or extracted via OCR
    extracted_identifiers JSONB DEFAULT '{}'::jsonb, -- {"nif": "...", "rc": "...", "signatory": "..."}
    has_wet_stamp BOOLEAN DEFAULT FALSE,         -- YOLOv11 stamp detection result
    has_signature BOOLEAN DEFAULT FALSE,         -- YOLOv11 signature detection result
    ocr_confidence NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================================
-- 4. COMPANY RESOURCE REGISTRY (HUMAN PERSONNEL & MATERIAL EQUIPMENT)
-- =========================================================================================
CREATE TABLE company_resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    resource_type VARCHAR(32) NOT NULL CHECK (resource_type IN ('PERSONNEL', 'EQUIPMENT')),
    canonical_name_fr TEXT NOT NULL,             -- Normalized Latin name or equipment designation
    canonical_name_ar TEXT,                      -- Normalized Arabic name
    phonetic_search_key TEXT NOT NULL,           -- Transliteration-invariant key for fuzzy matching
    primary_identifier VARCHAR(128) NOT NULL,    -- CNAS Affiliation # / NIN (Personnel) OR Immatriculation / VIN (Equipment)
    secondary_identifier VARCHAR(128),           -- Diploma Serial # OR PV d'Huissier / Invoice #
    role_or_category VARCHAR(128) NOT NULL,      -- e.g., 'Ingénieur d''État en Génie Civil', 'Grue Mobile 50T'
    qualification_degree TEXT,                   -- e.g., 'Master 2 / Ingénieur d''État Hydraulique (ENSH)'
    experience_years INT DEFAULT 0,
    date_of_birth DATE,
    cnas_verified BOOLEAN DEFAULT TRUE,
    supporting_doc_citation JSONB NOT NULL,      -- {"doc_name": "DAS_CNAS_2026.pdf", "page": 4, "bbox": [110,240,520,275]}
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (organization_id, resource_type, primary_identifier)
);

CREATE INDEX idx_company_resources_trgm ON company_resources USING GIN (phonetic_search_key gin_trgm_ops);
CREATE INDEX idx_company_resources_ident ON company_resources (primary_identifier);

-- =========================================================================================
-- 5. TENDERS (APPELS D'OFFRES) & CAHIER DES CHARGES (CDC)
-- =========================================================================================
CREATE TABLE tenders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    authority_org_id UUID NOT NULL REFERENCES organizations(id),
    reference_code VARCHAR(128) UNIQUE NOT NULL, -- e.g., 'AOON/04/2026/MTP-HYD'
    title_fr TEXT NOT NULL,
    title_ar TEXT,
    tender_type VARCHAR(32) NOT NULL CHECK (
        tender_type IN ('WORKS', 'SUPPLIES', 'SERVICES', 'STUDIES')
    ),
    procurement_mode VARCHAR(64) DEFAULT 'APPEL_D_OFFRES_OUVERT_NATIONAL',
    publication_date DATE NOT NULL,
    submission_deadline TIMESTAMPTZ NOT NULL,    -- Date et heure limite de dépôt / ouverture des plis
    planned_execution_window TSTZRANGE NOT NULL, -- [planned_start_date, planned_end_date]
    max_execution_months INT NOT NULL,
    required_engineer_headcount INT NOT NULL DEFAULT 0,
    required_technician_headcount INT NOT NULL DEFAULT 0,
    technical_pass_threshold NUMERIC(5,2) DEFAULT 60.00, -- Note technique éliminatoire (ex: 60/100)
    status VARCHAR(32) NOT NULL DEFAULT 'EVALUATION_IN_PROGRESS' CHECK (
        status IN ('DRAFT', 'PUBLISHED', 'SEALED_BIDS', 'EVALUATION_IN_PROGRESS', 'AWARDED', 'CANCELLED')
    ),
    cdc_storage_uri TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================================
-- 6. EXTRACTED TENDER REQUIREMENTS & RUBRIC (CAHIER DES CHARGES CLAUSES)
-- =========================================================================================
CREATE TABLE tender_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    req_code VARCHAR(32) NOT NULL,               -- e.g., 'REQ-CAND-04', 'REQ-HUM-02', 'REQ-TECH-09'
    envelope VARCHAR(32) NOT NULL CHECK (
        envelope IN ('CANDIDATURE', 'TECHNIQUE', 'FINANCIERE')
    ),
    category VARCHAR(64) NOT NULL CHECK (
        category IN (
            'ELIMINATORY_CRITERION',
            'ADMIN_CERTIFICATE',
            'HUMAN_RESOURCES',
            'MATERIAL_EQUIPMENT',
            'TECHNICAL_SPECIFICATION',
            'FINANCIAL_CONSISTENCY'
        )
    ),
    title_fr TEXT NOT NULL,
    title_ar TEXT,
    description_fr TEXT NOT NULL,
    description_ar TEXT,
    is_eliminatory BOOLEAN NOT NULL DEFAULT FALSE,
    rubric_max_points NUMERIC(5,2) DEFAULT 0.00, -- Points in Barème de Notation Technique
    validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    -- Example validation_rules:
    -- {"doc_type": "EXTRAIT_DE_ROLE", "max_age_days": 90, "require_wet_stamp": true}
    -- {"role": "Ingénieur Génie Civil", "min_count": 20, "min_experience_years": 5, "require_cnas": true}
    source_citation JSONB NOT NULL,
    -- Example source_citation:
    -- {"doc_name": "CDC_AOON_04_2026.pdf", "page": 12, "article": "Art. 14.2", "bbox": [72, 184, 540, 260], "quote_fr": "..."}
    human_confirmed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tender_id, req_code)
);

-- =========================================================================================
-- 7. BID SUBMISSIONS (SOUMISSIONS) & REQUIREMENT AUDIT FINDINGS
-- =========================================================================================
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    company_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    submission_mode VARCHAR(32) NOT NULL CHECK (
        submission_mode IN ('COMPANY_PRE_AUDIT', 'OFFICIAL_COPEO_EVALUATION')
    ),
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    completeness_pct NUMERIC(5,2) DEFAULT 0.00,
    eliminatory_blockers_count INT DEFAULT 0,
    warnings_count INT DEFAULT 0,
    declared_engineer_count INT DEFAULT 0,
    proposed_duration_months INT,
    proposed_financial_ht_dzd NUMERIC(18,2),
    resource_overlap_status VARCHAR(32) DEFAULT 'CLEAR' CHECK (
        resource_overlap_status IN ('CLEAR', 'CONCURRENT_BID_WARNING', 'CRITICAL_OVERALLOCATION', 'CLARIFICATION_REQUESTED', 'RECONCILED')
    ),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE submission_findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    requirement_id UUID NOT NULL REFERENCES tender_requirements(id) ON DELETE CASCADE,
    ai_status VARCHAR(32) NOT NULL CHECK (
        ai_status IN ('VERIFIED', 'INCONSISTENCY_WARNING', 'NEEDS_HUMAN_CHECK', 'MISSING_BLOCKER')
    ),
    ai_confidence NUMERIC(5,2) NOT NULL,
    extracted_value TEXT,                        -- e.g., 'Délivré le 02/06/2026 (Expiré +14j)' or '18/20 attestations CNAS jointes'
    remediation_instruction_fr TEXT,             -- Plain-language fix for Company or verification prompt for Committee
    remediation_instruction_ar TEXT,
    evidence_citation JSONB,                     -- {"doc_name": "...", "page": 14, "bbox": [80,310,510,395], "quote": "..."}
    proposed_rubric_score NUMERIC(5,2),
    -- Human-in-the-loop override fields (AI never makes final decisions)
    human_status_override VARCHAR(32),
    human_verified_score NUMERIC(5,2),
    reviewer_user_id UUID REFERENCES users(id),
    reviewer_justification TEXT,
    reviewed_at TIMESTAMPTZ,
    UNIQUE (submission_id, requirement_id)
);

-- =========================================================================================
-- 8. CROSS-TENDER RESOURCE COMMITMENT LEDGER & OVERLAP ENGINE
-- =========================================================================================
CREATE TABLE resource_commitments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    resource_id UUID REFERENCES company_resources(id) ON DELETE SET NULL, -- NULL for aggregate workforce pledge rows
    commitment_level VARCHAR(32) NOT NULL CHECK (
        commitment_level IN ('AGGREGATE_HEADCOUNT', 'NAMED_PERSONNEL', 'NAMED_EQUIPMENT')
    ),
    commitment_state VARCHAR(32) NOT NULL CHECK (
        commitment_state IN (
            'AWARDED_ACTIVE',         -- Hard commitment: company won the contract and project is under execution
            'PROPOSED_IN_BID',        -- Soft/Concurrent commitment: company pledged these resources in an open tender
            'RELEASED_COMPLETED',     -- Freed resource: supported by PV de Réception Provisoire
            'WITHDRAWN'
        )
    ),
    role_or_category VARCHAR(128) NOT NULL,      -- e.g., 'Ingénieur Génie Civil', 'Chef de Projet', 'Grue Mobile 50T'
    pledged_headcount INT NOT NULL DEFAULT 1,    -- e.g., 20 engineers pledged to this tender
    allocation_pct INT NOT NULL DEFAULT 100,     -- e.g., 100% full-time site dedication
    commitment_window TSTZRANGE NOT NULL,        -- [start_date, end_date] indexed with PostgreSQL GIST
    source_citation JSONB NOT NULL,              -- Documentary proof where the company pledged this resource
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GIST index enables sub-millisecond temporal overlap queries (commitment_window && target_window)
CREATE INDEX idx_resource_commitments_gist ON resource_commitments USING GIST (company_org_id, commitment_window);

-- =========================================================================================
-- 9. ANALYTICAL VIEW: REAL-TIME CROSS-TENDER CAPACITY & OVERLAP DETECTION
--    Solves the Manager's Scenario: 20 Available Engineers vs. 6 Projects Requiring 20 Each (120 Total)
-- =========================================================================================
CREATE OR REPLACE VIEW v_company_capacity_overlap_alerts AS
WITH target_bids AS (
    SELECT
        rc.company_org_id,
        rc.tender_id AS current_tender_id,
        t.reference_code AS current_tender_ref,
        rc.commitment_window AS target_window,
        rc.pledged_headcount AS current_bid_engineers
    FROM resource_commitments rc
    JOIN tenders t ON t.id = rc.tender_id
    WHERE rc.commitment_level = 'AGGREGATE_HEADCOUNT'
      AND rc.commitment_state IN ('PROPOSED_IN_BID', 'AWARDED_ACTIVE')
)
SELECT
    o.id AS company_org_id,
    o.name_fr AS company_name,
    o.nif,
    tb.current_tender_id,
    tb.current_tender_ref,
    o.verified_engineer_capacity AS cnas_verified_engineers,
    COUNT(DISTINCT rc_overlap.tender_id) AS overlapping_projects_count,
    SUM(rc_overlap.pledged_headcount) FILTER (WHERE rc_overlap.commitment_state = 'AWARDED_ACTIVE') AS active_locked_engineers,
    SUM(rc_overlap.pledged_headcount) FILTER (WHERE rc_overlap.commitment_state = 'PROPOSED_IN_BID') AS concurrent_bid_engineers,
    SUM(rc_overlap.pledged_headcount) AS total_pledged_engineers_in_window,
    ROUND(
        (SUM(rc_overlap.pledged_headcount)::NUMERIC / NULLIF(o.verified_engineer_capacity, 0)) * 100,
        1
    ) AS capacity_utilization_pct,
    GREATEST(SUM(rc_overlap.pledged_headcount) - o.verified_engineer_capacity, 0) AS engineer_deficit,
    CASE
        WHEN SUM(rc_overlap.pledged_headcount) FILTER (WHERE rc_overlap.commitment_state = 'AWARDED_ACTIVE') + tb.current_bid_engineers > o.verified_engineer_capacity
            THEN 'CRITICAL_HARD_OVERCOMMITMENT'
        WHEN SUM(rc_overlap.pledged_headcount) > o.verified_engineer_capacity
            THEN 'HIGH_CONCURRENT_BID_OVERLAP'
        ELSE 'WITHIN_CAPACITY'
    END AS alert_severity
FROM target_bids tb
JOIN organizations o ON o.id = tb.company_org_id
JOIN resource_commitments rc_overlap
  ON rc_overlap.company_org_id = tb.company_org_id
 AND rc_overlap.commitment_level = 'AGGREGATE_HEADCOUNT'
 AND rc_overlap.commitment_state IN ('AWARDED_ACTIVE', 'PROPOSED_IN_BID')
 AND rc_overlap.commitment_window && tb.target_window
GROUP BY
    o.id, o.name_fr, o.nif, tb.current_tender_id, tb.current_tender_ref,
    o.verified_engineer_capacity, tb.current_bid_engineers;

-- =========================================================================================
-- 10. CLARIFICATION REQUESTS (DEMANDES D'ÉCLAIRCISSEMENT) & IMMUTABLE AUDIT LOG
-- =========================================================================================
CREATE TABLE clarification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    company_org_id UUID NOT NULL REFERENCES organizations(id),
    issued_by_user_id UUID REFERENCES users(id),
    request_type VARCHAR(64) NOT NULL CHECK (
        request_type IN ('RESOURCE_OVERLAP_JUSTIFICATION', 'DOCUMENT_VALIDITY_CLARIFICATION', 'TECHNICAL_SPEC_CLARIFICATION')
    ),
    subject_fr TEXT NOT NULL,
    subject_ar TEXT,
    body_markdown_fr TEXT NOT NULL,
    body_markdown_ar TEXT,
    cited_evidence JSONB NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'DRAFT_PENDING_SIGNATURE' CHECK (
        status IN ('DRAFT_PENDING_SIGNATURE', 'SENT_TO_BIDDER', 'RESPONSE_RECEIVED', 'RESOLVED_VERIFIED', 'RESOLVED_UNJUSTIFIED')
    ),
    company_response_uri TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    action_type VARCHAR(64) NOT NULL,            -- e.g., 'OVERRIDE_FINDING', 'GENERATE_DEMANDE_ECLAIRCISSEMENT', 'EXPORT_PV'
    target_entity VARCHAR(64) NOT NULL,
    target_id UUID NOT NULL,
    rationale TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================================================
-- 11. REALISTIC SEED DATA: MANAGER'S 20-ENGINEER / 6-PROJECT OVERLAP SCENARIO
-- =========================================================================================
INSERT INTO organizations (id, name_fr, name_ar, org_type, legal_form, nif, nis, rc_number, cnas_employer_id, wilaya_code, verified_engineer_capacity, verified_technician_capacity, verified_total_workforce, cnas_das_reference, capacity_verified_at)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Ministère des Travaux Publics et des Infrastructures de Base — Direction de l''Hydraulique', 'وزارة الأشغال العمومية والمنشآت القاعدية - مديرية الري', 'CONTRACTING_AUTHORITY', 'Ministère', '000116000012345', '000116001', 'N/A', '16-000112-90', '16', 0, 0, 450, 'N/A', NOW()),
    ('22222222-2222-2222-2222-222222222222', 'SARL Atlas Constructions & Hydraulique', 'ش.ذ.م.م أطلس للبناء والري', 'COMPANY', 'SARL', '001216098442190', '19981604421', '16/00-0984421B12', '16-449102-88', '16', 20, 35, 110, 'DAS-CNAS-2026-Q3-8841', '2026-09-30 10:00:00+01'),
    ('33333333-3333-3333-3333-333333333333', 'EURL HydroTech Algérie', 'م.ش.و.ذ.م.م هيدروتك الجزائر', 'COMPANY', 'EURL', '001526011920411', '20152601192', '26/00-0119204B15', '26-109443-12', '26', 28, 42, 145, 'DAS-CNAS-2026-Q3-3109', '2026-10-01 09:00:00+01'),
    ('44444444-4444-4444-4444-444444444444', 'SPA Cosider Canalisations', 'ش.ذ.أ كوسيدار للقنوات', 'COMPANY', 'SPA', '000116001829300', '19821600182', '16/00-0018293B01', '16-002918-01', '16', 180, 320, 1450, 'DAS-CNAS-2026-Q3-0012', '2026-10-02 14:00:00+01');

-- Insert the 6 overlapping tenders (1 Active Awarded Contract + 5 Concurrent Tenders)
-- Each requiring 20 Civil/Hydraulic Engineers (6 * 20 = 120 Engineers total demand vs 20 available for SARL Atlas)
INSERT INTO tenders (id, authority_org_id, reference_code, title_fr, title_ar, tender_type, publication_date, submission_deadline, planned_execution_window, max_execution_months, required_engineer_headcount, status)
VALUES
    ('aaaa0001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'AOON/11/2025/WILAYA-16', 'Réalisation du Collecteur Principal d''Assainissement Est — Alger', 'إنجاز المجمع الرئيسي للصرف الصحي شرق - الجزائر', 'WORKS', '2025-11-15', '2026-01-10 12:00:00+01', '[2026-03-01, 2027-06-30]', 16, 20, 'AWARDED'),
    ('aaaa0002-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'AOON/04/2026/MTP-HYD', 'Réalisation & Équipement de la Station de Pompage Hydraulique AEP — Médéa', 'إنجاز وتجهيز محطة الضخ الهيدروليكية للتزويد بالمياه الصالحة للشرب - المدية', 'WORKS', '2026-09-01', '2026-10-22 12:00:00+01', '[2026-11-15, 2027-11-15]', 12, 20, 'EVALUATION_IN_PROGRESS'),
    ('aaaa0003-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'AOON/07/2026/ADE-BLIDA', 'Réhabilitation du Réseau d''Adduction d''Eau Potable — Blida', 'إعادة تأهيل شبكةجر المياه الصالحة للشرب - البليدة', 'WORKS', '2026-09-10', '2026-10-18 12:00:00+01', '[2026-11-01, 2027-09-30]', 11, 20, 'EVALUATION_IN_PROGRESS'),
    ('aaaa0004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'AOON/09/2026/ONA-TIPAZA', 'Extension de la Station d''Épuration des Eaux Usées — Tipaza', 'توسيع محطة تصفية المياه المستعملة - تيبازة', 'WORKS', '2026-09-12', '2026-10-20 12:00:00+01', '[2026-12-01, 2027-12-01]', 12, 20, 'EVALUATION_IN_PROGRESS'),
    ('aaaa0005-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'AOON/12/2026/DHW-BOUIRA', 'Travaux de Raccordement Hydraulique du Barrage Tilesdit — Bouira', 'أشغال الربط الهيدروليكي لسد تيلسديت - البويرة', 'WORKS', '2026-09-15', '2026-10-25 12:00:00+01', '[2026-12-15, 2027-10-15]', 10, 20, 'EVALUATION_IN_PROGRESS'),
    ('aaaa0006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'AOON/15/2026/ANBT-CHLEF', 'Conduite d''Adduction Principale DN1200 — Chlef', 'قناة الجر الرئيسية قطر 1200 مم - الشلف', 'WORKS', '2026-09-18', '2026-10-28 12:00:00+01', '[2027-01-01, 2027-12-31]', 12, 20, 'EVALUATION_IN_PROGRESS');

-- Insert the 6 resource commitment records for SARL Atlas Constructions (20 Engineers x 6 = 120 Engineers pledged)
INSERT INTO resource_commitments (company_org_id, tender_id, commitment_level, commitment_state, role_or_category, pledged_headcount, allocation_pct, commitment_window, source_citation)
VALUES
    ('22222222-2222-2222-2222-222222222222', 'aaaa0001-0000-0000-0000-000000000001', 'AGGREGATE_HEADCOUNT', 'AWARDED_ACTIVE', 'Ingénieurs Génie Civil & Hydraulique', 20, 100, '[2026-03-01, 2027-06-30]', '{"doc_name": "ODS_Demarrage_AOON_11_2025.pdf", "page": 2, "quote": "20 Ingénieurs affectés à temps plein sur le chantier Collecteur Est."}'),
    ('22222222-2222-2222-2222-222222222222', 'aaaa0002-0000-0000-0000-000000000002', 'AGGREGATE_HEADCOUNT', 'PROPOSED_IN_BID', 'Ingénieurs Génie Civil & Hydraulique', 20, 100, '[2026-11-15, 2027-11-15]', '{"doc_name": "Moyens_Humains_Atlas_AOON04.pdf", "page": 38, "quote": "L''entreprise s''engage à mobiliser 20 ingénieurs diplômés affiliés CNAS."}'),
    ('22222222-2222-2222-2222-222222222222', 'aaaa0003-0000-0000-0000-000000000003', 'AGGREGATE_HEADCOUNT', 'PROPOSED_IN_BID', 'Ingénieurs Génie Civil & Hydraulique', 20, 100, '[2026-11-01, 2027-09-30]', '{"doc_name": "Offre_Technique_Atlas_Blida.pdf", "page": 29, "quote": "Effectif dédié au projet : 20 Ingénieurs d''application et d''État."}'),
    ('22222222-2222-2222-2222-222222222222', 'aaaa0004-0000-0000-0000-000000000004', 'AGGREGATE_HEADCOUNT', 'PROPOSED_IN_BID', 'Ingénieurs Génie Civil & Hydraulique', 20, 100, '[2026-12-01, 2027-12-01]', '{"doc_name": "Offre_Technique_Atlas_Tipaza.pdf", "page": 41, "quote": "Liste nominative des 20 ingénieurs affectés au lot STEP Tipaza."}'),
    ('22222222-2222-2222-2222-222222222222', 'aaaa0005-0000-0000-0000-000000000005', 'AGGREGATE_HEADCOUNT', 'PROPOSED_IN_BID', 'Ingénieurs Génie Civil & Hydraulique', 20, 100, '[2026-12-15, 2027-10-15]', '{"doc_name": "Offre_Technique_Atlas_Bouira.pdf", "page": 33, "quote": "Encadrement technique : 20 ingénieurs (voir attestations CNAS jointes)."}'),
    ('22222222-2222-2222-2222-222222222222', 'aaaa0006-0000-0000-0000-000000000006', 'AGGREGATE_HEADCOUNT', 'PROPOSED_IN_BID', 'Ingénieurs Génie Civil & Hydraulique', 20, 100, '[2027-01-01, 2027-12-31]', '{"doc_name": "Offre_Technique_Atlas_Chlef.pdf", "page": 27, "quote": "Moyens humains dédiés : 20 ingénieurs en hydraulique et génie civil."}');


-- =========================================================================================
-- 12. HYBRID RAG PARENT-CHILD CHUNKS & RECIPROCAL RANK FUSION (RRF) SEARCH ENGINE
-- =========================================================================================
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    doc_name TEXT NOT NULL,
    envelope VARCHAR(32) CHECK (envelope IN ('CDC', 'CANDIDATURE', 'TECHNIQUE', 'FINANCIERE')),
    chunk_level VARCHAR(16) NOT NULL CHECK (chunk_level IN ('PARENT', 'CHILD')),
    parent_chunk_id UUID REFERENCES document_chunks(id) ON DELETE CASCADE,
    section_title TEXT,
    page_number INT NOT NULL,
    bbox JSONB NOT NULL DEFAULT '[0,0,0,0]'::jsonb,  -- Normalized [x0, y0, x1, y1] coordinates
    content TEXT NOT NULL,
    has_wet_stamp BOOLEAN DEFAULT FALSE,
    has_signature BOOLEAN DEFAULT FALSE,
    ocr_confidence NUMERIC(5,2) DEFAULT 99.0,
    tsv_bilingual TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED,
    embedding vector(768),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doc_chunks_tsv ON document_chunks USING GIN (tsv_bilingual);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_trgm ON document_chunks USING GIN (content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_doc_chunks_hnsw ON document_chunks USING hnsw (embedding vector_cosine_ops);

-- Reciprocal Rank Fusion (RRF) Hybrid Search Function (Dense Vector + Lexical BM25 + Parent Expansion)
CREATE OR REPLACE FUNCTION hybrid_search_tender_chunks(
    query_embedding vector(768),
    query_text TEXT,
    target_tender_id UUID,
    target_envelope VARCHAR(32) DEFAULT NULL,
    match_count INT DEFAULT 6
)
RETURNS TABLE (
    chunk_id UUID,
    parent_id UUID,
    doc_name TEXT,
    page_number INT,
    bbox JSONB,
    child_content TEXT,
    parent_content TEXT,
    has_wet_stamp BOOLEAN,
    has_signature BOOLEAN,
    rrf_score NUMERIC
) LANGUAGE sql STABLE AS $$
WITH dense_matches AS (
    SELECT c.id, c.parent_chunk_id, c.doc_name, c.page_number, c.bbox, c.content,
           c.has_wet_stamp, c.has_signature,
           ROW_NUMBER() OVER (ORDER BY c.embedding <=> query_embedding) AS rank_dense
    FROM document_chunks c
    WHERE c.tender_id = target_tender_id
      AND c.chunk_level = 'CHILD'
      AND (target_envelope IS NULL OR c.envelope = target_envelope)
    ORDER BY c.embedding <=> query_embedding
    LIMIT 25
),
lexical_matches AS (
    SELECT c.id, c.parent_chunk_id, c.doc_name, c.page_number, c.bbox, c.content,
           c.has_wet_stamp, c.has_signature,
           ROW_NUMBER() OVER (
               ORDER BY ts_rank_cd(c.tsv_bilingual, plainto_tsquery('simple', query_text)) DESC,
                        similarity(c.content, query_text) DESC
           ) AS rank_lexical
    FROM document_chunks c
    WHERE c.tender_id = target_tender_id
      AND c.chunk_level = 'CHILD'
      AND (target_envelope IS NULL OR c.envelope = target_envelope)
      AND (c.tsv_bilingual @@ plainto_tsquery('simple', query_text) OR similarity(c.content, query_text) > 0.15)
    LIMIT 25
),
fused AS (
    SELECT
        COALESCE(d.id, l.id) AS c_id,
        COALESCE(d.parent_chunk_id, l.parent_chunk_id) AS p_id,
        COALESCE(d.doc_name, l.doc_name) AS d_name,
        COALESCE(d.page_number, l.page_number) AS p_num,
        COALESCE(d.bbox, l.bbox) AS c_bbox,
        COALESCE(d.content, l.content) AS c_content,
        COALESCE(d.has_wet_stamp, l.has_wet_stamp) AS wet_stamp,
        COALESCE(d.has_signature, l.has_signature) AS sig,
        ROUND(
            (COALESCE(1.0 / (60 + d.rank_dense), 0.0) + COALESCE(1.0 / (60 + l.rank_lexical), 0.0))::NUMERIC,
            6
        ) AS score
    FROM dense_matches d
    FULL OUTER JOIN lexical_matches l ON d.id = l.id
    ORDER BY score DESC
    LIMIT match_count
)
SELECT
    f.c_id,
    f.p_id,
    f.d_name,
    f.p_num,
    f.c_bbox,
    f.c_content,
    COALESCE(p.content, f.c_content) AS parent_content,
    f.wet_stamp,
    f.sig,
    f.score
FROM fused f
LEFT JOIN document_chunks p ON p.id = f.p_id;
$$;
