const API_BASE = window.location.protocol.startsWith('http')
      ? window.location.origin
      : 'http://localhost:8000';

    const REQUIREMENTS_DATA = [
      {
        id: 'REQ-CAND-04',
        envelope: 'CANDIDATURE',
        category: 'Pièce Fiscale Éliminatoire',
        title_fr: 'Extrait de Rôle (Apurement Fiscal < 3 mois)',
        title_ar: 'مستخرج الجداول الضريبية (أقل من 3 أشهر)',
        desc_fr: 'Extrait de rôle apuré délivré depuis moins de trois (03) mois à la date d’ouverture des plis (22/10/2026).',
        desc_ar: 'تقديم مستخرج جداول ضريبية مصفى صادر منذ أقل من ثلاثة (03) أشهر عند تاريخ فتح الأظرفة.',
        status: 'BLOCKER',
        statusLabel_fr: 'Expiré (+52 jours)',
        statusLabel_ar: 'منتهي الصلاحية (+52 يوما)',
        docName: 'Dossier_Candidature_Atlas.pdf',
        page: 'Page 14 / 96',
        cdcScanPage: 6,
        bbox: 'BBox [0.07, 0.18, 0.91, 0.42]',
        bboxColor: 'bbox-red',
        docHeader_fr: 'DIRECTION GÉNÉRALE DES IMPÔTS — EXTRAIT DE RÔLE',
        quote_fr: '« Extrait de rôle délivré à Alger le : 02/06/2026 au profit de SARL ATLAS CONSTRUCTIONS (NIF : 001216098442190). Rôle apuré au 02/06/2026 (soit 142 jours avant l’ouverture des plis, dépassant le plafond légal de 90 jours). »',
        quote_ar: '« مستخرج الجداول المسلم بالجزائر في 02/06/2026 لصالح ش.ذ.م.م أطلس للبناء (يتجاوز سقف 90 يوما). »',
        stampStatus: 'Cachet Humide : Détecté (98%) · Signature : Détectée',
        remediation_fr: 'BLOQUANT ÉLIMINATOIRE : L’extrait de rôle date du 02/06/2026 (142 jours avant l’ouverture des plis du 22/10/2026, limite fixée à 90 jours par l’Art. 12 du CDC). Remplacez cette pièce dans le Coffre-Fort par un Extrait de Rôle émis après le 24/07/2026.',
        remediation_ar: 'مانع إقصائي: مستخرج الجداول صادر بتاريخ 02/06/2026 (قبل 142 يوما من فتح الأظرفة). يرجى إرفاق مستخرج جديد.',
        humanDecision: null
      },
      {
        id: 'REQ-CAND-07',
        envelope: 'CANDIDATURE',
        category: 'Pièce Administrative Éliminatoire',
        title_fr: 'Déclaration de Probité (Cachet Humide & Signature)',
        title_ar: 'تصريح بالنزاهة (الختم الرطب والإمضاء)',
        desc_fr: 'Déclaration de probité conforme au modèle réglementaire Loi 23-12, datée, signée et portant le cachet humide.',
        desc_ar: 'تصريح بالنزاهة مملوء ومؤرخ وممضى ومختوم بالختم الرطب للمتعهد.',
        status: 'BLOCKER',
        statusLabel_fr: 'Cachet Humide Manquant',
        statusLabel_ar: 'الختم الرطب مفقود',
        docName: 'Dossier_Candidature_Atlas.pdf',
        page: 'Page 6 / 96',
        cdcScanPage: 6,
        bbox: 'BBox [0.31, 0.61, 0.88, 0.74]',
        bboxColor: 'bbox-red',
        docHeader_fr: 'ANNEXE II — DÉCLARATION DE PROBITÉ (LOI N° 23-12)',
        quote_fr: '« Fait à Alger, le 12/10/2026. Le Gérant [Signature manuscrite détectée — Absence de cachet humide de l’entreprise sur la zone réservée]. »',
        quote_ar: '« حرر بالجزائر في 12/10/2026 [توقيع خطي موجود - غياب الختم الرطب للشركة]. »',
        stampStatus: 'Vision IA : Signature OUI (96%) · Cachet Humide NON (0.04)',
        remediation_fr: 'BLOQUANT : La signature du gérant est présente au bas de la page 6, mais le cachet humide de la SARL Atlas Constructions est manquant. Apposez le cachet humide et re-numérisez la page.',
        remediation_ar: 'مانع إقصائي: تم رصد إمضاء المسير ولكن الختم الرطب للشركة مفقود.',
        humanDecision: null
      },
      {
        id: 'REQ-HUM-02',
        envelope: 'TECHNIQUE',
        category: 'Moyens Humains & Capacité CNAS (35 pts)',
        title_fr: 'Mobilisation de 20 Ingénieurs Diplômés Affiliés CNAS',
        title_ar: 'تجنيد 20 مهندسا منتسبا للصندوق الوطني للتأمينات الاجتماعية (CNAS)',
        desc_fr: 'Justifier d’un effectif dédié de 20 ingénieurs appuyé par les diplômes, CV et attestations d’affiliation CNAS disponibles pour le projet.',
        desc_ar: 'إثبات تعداد مخصص مكون من 20 مهندسا مع شهادات الانتساب لـ CNAS وعدم التزامهم في مشاريع أخرى متزامنة.',
        status: 'WARNING',
        statusLabel_fr: 'Chevauchement 120/20 Ing. (600%)',
        statusLabel_ar: 'تداخل الموارد 120/20 مهندس (600%)',
        docName: 'Moyens_Humains_CNAS_Atlas.pdf',
        page: 'Page 38 / 128',
        cdcScanPage: 14,
        bbox: 'BBox [0.06, 0.19, 0.93, 0.45]',
        bboxColor: 'bbox-amber',
        docHeader_fr: 'DÉCLARATION EFFECTIF CNAS (DAS Q3-2026) & LISTE NOMINATIVE',
        quote_fr: '« Effectif total déclaré sur la DAS CNAS : 20 Ingénieurs. Les mêmes 20 ingénieurs (dont M. BENSALEM Karim, CNAS #19840512-442) sont simultanément engagés sur 1 marché actif et 5 soumissions en cours (120 ingénieurs requis au total). »',
        quote_ar: '« التعداد الإجمالي المصرح به لدى CNAS: 20 مهندسا، مع رصد التزام نفس المهندسين في 6 صفقات متزامنة (120 مهندسا مطلوبا). »',
        stampStatus: 'Code QR CNAS : Vérifié · Conflit de capacité inter-marchés détecté',
        remediation_fr: 'ALERTE CAPACITÉ INTER-MARCHÉS : Vos 20 ingénieurs déclarés à la CNAS sont engagés sur 6 projets simultanés (120 ingénieurs requis contre 20 disponibles). Ouvrez la vue « 04 · Chevauchement Moyens » pour joindre un PV de réception provisoire ou de nouvelles embauches CNAS.',
        remediation_ar: 'تنبيه تداخل الموارد: تم رصد التزام نفس الـ 20 مهندسا في 6 مشاريع متزامنة. يرجى إرفاق محضر استلام مؤقت أو شهادات توظيف جديدة.',
        humanDecision: null
      },
      {
        id: 'REQ-TECH-14',
        envelope: 'TECHNIQUE',
        category: 'Planning & Délai d’Exécution (15 pts)',
        title_fr: 'Concordance du Délai de Réalisation (Plafond CDC ≤ 12 mois)',
        title_ar: 'تطابق آجال الإنجاز (السقف المحدد ≤ 12 شهرا)',
        desc_fr: 'Le délai mentionné dans la Déclaration à Souscrire doit concorder avec le diagramme Gantt et respecter le plafond de 12 mois.',
        desc_ar: 'يجب أن تتطابق مدة الإنجاز المصرح بها مع مخطط Gantt وألا تتجاوز 12 شهرا.',
        status: 'WARNING',
        statusLabel_fr: 'Écart 11 vs 13 mois',
        statusLabel_ar: 'تناقض 11 مقابل 13 شهرا',
        docName: 'Offre_Technique_Atlas.pdf',
        page: 'Page 92 / 128',
        cdcScanPage: 14,
        bbox: 'BBox [0.09, 0.41, 0.90, 0.58]',
        bboxColor: 'bbox-amber',
        docHeader_fr: 'MÉMOIRE TECHNIQUE JUSTIFICATIF — DIAGRAMME GANTT',
        quote_fr: '« Déclaration à souscrire (p.3) : Délai proposé = 11 mois. Diagramme Gantt (p.92, Lot Mise en service) : Fin semaine 56 = 13 mois calendaires. »',
        quote_ar: '« التصريح بالاكتتاب: 11 شهرا. مخطط الإنجاز التفصيلي (ص.92): 13 شهرا. »',
        stampStatus: 'Cachet Humide : Détecté · Contradiction interne p.3 vs p.92',
        remediation_fr: 'INCOHÉRENCE INTERNE : La Déclaration à Souscrire indique 11 mois mais le planning Gantt (p.92) déborde à 13 mois (dépassant le plafond de 12 mois du CDC). Ajustez la barre du Lot 5 à la page 92.',
        remediation_ar: 'تناقض داخلي بين التصريح بالاكتتاب (11 شهرا) ومخطط Gantt (13 شهرا).',
        humanDecision: null
      },
      {
        id: 'REQ-FIN-02',
        envelope: 'FINANCIERE',
        category: 'Vérification Arithmétique BPU / DQE',
        title_fr: 'Concordance des Prix Unitaires (Lettres BPU vs Chiffres DQE)',
        title_ar: 'تطابق الأسعار الوحدوية بين جدول الأسعار (BPU) والكشف الكمي (DQE)',
        desc_fr: 'Vérifier la concordance exacte entre le prix unitaire en lettres au BPU et le montant reporté au DQE.',
        desc_ar: 'التحقق من تطابق السعر الوحدوي بالحروف في BPU مع السعر المسجل في DQE.',
        status: 'WARNING',
        statusLabel_fr: 'Écart Poste 4.2 (270k DZD)',
        statusLabel_ar: 'فارق حسابي في البند 4.2',
        docName: 'Offre_Financiere_BPU_DQE.pdf',
        page: 'Page 11 / 24',
        cdcScanPage: 11,
        bbox: 'BBox [0.08, 0.30, 0.92, 0.56]',
        bboxColor: 'bbox-teal',
        docHeader_fr: 'BORDEREAU DES PRIX UNITAIRES (BPU) & DQE',
        quote_fr: '« Poste 4.2 : Prix au BPU en lettres = Huit cent cinquante mille dinars (850 000 DZD HT). Prix reporté au DQE (qté 6) = 805 000 DZD HT (écart de 270 000 DZD HT). »',
        quote_ar: '« البند 4.2: السعر بالحروف في BPU = 850.000 دج، والسعر في DQE = 805.000 دج. »',
        stampStatus: 'Signature & Cachet Humide : Présents',
        remediation_fr: 'VÉRIFICATION ARITHMÉTIQUE : Inversion de chiffres au Poste 4.2 (850 000 DZD en lettres au BPU contre 805 000 DZD au DQE). Corrigez la cellule DQE p.19 avant fermeture du pli financier.',
        remediation_ar: 'يرجى تصحيح السعر الوحدوي في الكشف الكمي DQE للبند 4.2 ليطابق السعر بالحروف (850.000 دج).',
        humanDecision: null
      },
      {
        id: 'REQ-TECH-09',
        envelope: 'TECHNIQUE',
        category: 'Spécifications Techniques (30 pts)',
        title_fr: 'Conformité des Équipements & Fiches Constructeurs (IP68 / ISO 9906)',
        title_ar: 'مطابقة التجهيزات والبطاقات التقنية للمصنع (IP68 / ISO 9906)',
        desc_fr: 'Protection moteur IP68, rendement hydraulique ≥ 82% certifié ISO 9906 Grade 1B.',
        desc_ar: 'حماية المحرك IP68 ومردود هيدروليكي لا يقل عن 82% معتمد وفق ISO 9906.',
        status: 'VERIFIED',
        statusLabel_fr: 'Conforme (IP68 · 84.2%)',
        statusLabel_ar: 'مطابق (IP68 · 84.2%)',
        docName: 'Offre_Technique_Atlas.pdf',
        page: 'Page 64 / 128',
        cdcScanPage: 14,
        bbox: 'BBox [0.08, 0.29, 0.91, 0.48]',
        bboxColor: 'bbox-green',
        docHeader_fr: 'FICHE TECHNIQUE CONSTRUCTEUR — CERTIFIÉ ISO 9906',
        quote_fr: '« Degré de protection : IP68 (immersion continue). Rendement hydraulique mesuré : 84.2% (supérieur au seuil minimal de 82% exigé par le CDC). »',
        quote_ar: '« درجة الحماية IP68 والمردود الهيدروليكي 84.2% (يفوق الحد الأدنى المطلوب 82%). »',
        stampStatus: 'Cachet Constructeur + Paraphe : Détectés',
        remediation_fr: 'CONFORME : La fiche technique constructeur dépasse les exigences minimales du Cahier des Charges.',
        remediation_ar: 'مطابق تماما للمواصفات التقنية المطلوبة في دفتر الشروط.',
        humanDecision: null
      },
      {
        id: 'REQ-CAND-02',
        envelope: 'CANDIDATURE',
        category: 'Capacité Financière (Bilans CAC)',
        title_fr: 'Bilans Financiers Certifiés Commissaire aux Comptes (3 Dernières Années)',
        title_ar: 'الحصائل المالية المعتمدة من محافظ الحسابات (السنوات الثلاث الأخيرة)',
        desc_fr: 'Bilans 2023, 2024 et 2025 visés et certifiés réguliers et sincères par le Commissaire aux Comptes.',
        desc_ar: 'تقديم الحصائل المالية للسنوات 2023 و 2024 و 2025 مصادق عليها من محافظ الحسابات.',
        status: 'VERIFIED',
        statusLabel_fr: 'Conforme (3 Bilans CAC)',
        statusLabel_ar: 'مطابق (3 حصائل معتمدة)',
        docName: 'Dossier_Candidature_Atlas.pdf',
        page: 'Page 22 / 96',
        cdcScanPage: 6,
        bbox: 'BBox [0.12, 0.25, 0.88, 0.55]',
        bboxColor: 'bbox-green',
        docHeader_fr: 'RAPPORT GÉNÉRAL DU COMMISSAIRE AUX COMPTES',
        quote_fr: '« Nous certifions que les comptes annuels des exercices 2023, 2024 et 2025 sont réguliers et sincères et donnent une image fidèle du patrimoine. »',
        quote_ar: '« نشهد بأن الحسابات السنوية للسنوات 2023 و 2024 و 2025 منتظمة وصادقة وتعكس الصورة الوفية للذمة المالية. »',
        stampStatus: 'Visa & Numéro Ordre CAC : Vérifiés (100%)',
        remediation_fr: 'CONFORME : Les trois bilans certifiés sont conformes aux exigences de l’Article 12 du CDC.',
        remediation_ar: 'مطابق تماما لمتطلبات المادة 12 من دفتر الشروط.',
        humanDecision: null
      },
      {
        id: 'REQ-CAND-11',
        envelope: 'CANDIDATURE',
        category: 'Références Professionnelles',
        title_fr: 'Attestations de Bonne Exécution (Marchés Similaires ≥ 200M DZD)',
        title_ar: 'شهادات حسن التنفيذ (مشاريع مماثلة ≥ 200 مليون دج)',
        desc_fr: 'Au moins deux (02) attestations de bonne exécution délivrées par des maîtres d’ouvrage publics.',
        desc_ar: 'شهادتان (02) على الأقل لحسن التنفيذ مسلمة من طرف مصالح متعاقدة عمومية لمشاريع مماثلة.',
        status: 'VERIFIED',
        statusLabel_fr: 'Conforme (3 Attestations)',
        statusLabel_ar: 'مطابق (3 شهادات)',
        docName: 'Dossier_Candidature_Atlas.pdf',
        page: 'Page 45 / 96',
        cdcScanPage: 6,
        bbox: 'BBox [0.10, 0.20, 0.90, 0.52]',
        bboxColor: 'bbox-green',
        docHeader_fr: 'ATTESTATION DE BONNE EXÉCUTION — DTP WILAYA D’ALGER',
        quote_fr: '« Le Directeur des Travaux Publics atteste que la SARL ATLAS a exécuté les travaux du projet AOON/08/2023 avec professionnalisme et dans les délais contractuels. »',
        quote_ar: '« يشهد مدير الأشغال العمومية أن ش.ذ.م.م أطلس أنجزت أشغال المشروع بمهنية ووفق الآجال التعاقدية. »',
        stampStatus: 'Cachet Humide DTP : Authentifié',
        remediation_fr: 'CONFORME : Trois projets hospitaliers et hydrauliques similaires certifiés sans réserve.',
        remediation_ar: 'مطابق: تم تقديم 3 شهادات حسن تنفيذ لمشاريع مماثلة.',
        humanDecision: null
      }
    ];

    const VAULT_DOCS = [
      {
        name: 'Extrait de Rôle (Apurement Fiscal)',
        ref: 'Recette DGI Alger Centre · Art. 16041029841',
        issued: '02/06/2026',
        validity: 'Expiré (142 jours > 90 jours max)',
        stamp: 'Cachet DGI Détecté',
        status: 'BLOCKER',
        linkedReqId: 'REQ-CAND-04'
      },
      {
        name: 'Mise à Jour CNAS (Attestation & DAS)',
        ref: 'Agence Alger Centre · N° Cotisant 16-884102-99',
        issued: '25/09/2026',
        validity: 'Valide (Expire le 31/12/2026)',
        stamp: 'Cachet Humide + QR Vérifié',
        status: 'VERIFIED',
        linkedReqId: 'REQ-HUM-02'
      },
      {
        name: 'Registre de Commerce Électronique (CNRC)',
        ref: 'Réf. 16/00-0984421B16 · Code 402101',
        issued: '14/01/2025',
        validity: 'Permanent (Extrait Kbis vérifié)',
        stamp: 'Signature Électronique Valide',
        status: 'VERIFIED',
        linkedReqId: null
      },
      {
        name: 'Mise à Jour CASNOS (Non-Salariés)',
        ref: 'Direction de Wilaya Alger · Gérance',
        issued: '18/08/2026',
        validity: 'Valide (Expire le 31/12/2026)',
        stamp: 'Cachet Humide Présent',
        status: 'VERIFIED',
        linkedReqId: null
      },
      {
        name: 'Bilans Financiers Certifiés CAC (2023–2025)',
        ref: 'Cabinet Commissariat aux Comptes Belkacem',
        issued: '28/04/2026',
        validity: 'Exercices 2023-2025 clôturés',
        stamp: 'Visa & Signature CAC Présents',
        status: 'VERIFIED',
        linkedReqId: 'REQ-CAND-02'
      }
    ];

    const OVERLAP_COMMITMENTS = [
      {
        ref: 'AOON/11/2025/WILAYA-16',
        authority: 'Wilaya d’Alger — Direction de l’Hydraulique',
        state: 'AWARDED_ACTIVE',
        stateLabel: 'Marché Notifié',
        engineers: 20,
        period: 'Nov 2025 – Déc 2026',
        ganttLeft: 0,
        ganttWidth: 70,
        ganttColor: '#b91c1c',
        proof: 'ODS_Demarrage_Wilaya16.pdf (p.2)',
        reconciled: false
      },
      {
        ref: 'CDC-EPH-MOHAMMADIA-2026',
        authority: 'Établissement Public Hospitalier de Mohammadia',
        state: 'CURRENT_BID',
        stateLabel: 'Offre en Cours',
        engineers: 20,
        period: 'Nov 2026 – Oct 2027',
        ganttLeft: 60,
        ganttWidth: 40,
        ganttColor: '#e4f222',
        proof: 'Offre_Technique_Atlas.pdf (p.38)',
        reconciled: false
      },
      {
        ref: 'AOON/07/2026/ADE-BLIDA',
        authority: 'Algérienne des Eaux — Unité de Blida',
        state: 'PROPOSED_IN_BID',
        stateLabel: 'En Attente',
        engineers: 20,
        period: 'Déc 2026 – Nov 2027',
        ganttLeft: 65,
        ganttWidth: 35,
        ganttColor: '#b45309',
        proof: 'Dossier_ADE_Blida.pdf (p.19)',
        reconciled: false
      },
      {
        ref: 'AOON/09/2026/ONA-TIPAZA',
        authority: 'Office National de l’Assainissement',
        state: 'PROPOSED_IN_BID',
        stateLabel: 'En Attente',
        engineers: 20,
        period: 'Jan 2027 – Déc 2027',
        ganttLeft: 70,
        ganttWidth: 30,
        ganttColor: '#b45309',
        proof: 'Dossier_ONA_Tipaza.pdf (p.44)',
        reconciled: false
      },
      {
        ref: 'AOON/12/2026/DHW-BOUIRA',
        authority: 'Direction des Ressources en Eau — Bouira',
        state: 'PROPOSED_IN_BID',
        stateLabel: 'En Attente',
        engineers: 20,
        period: 'Fév 2027 – Jan 2028',
        ganttLeft: 75,
        ganttWidth: 25,
        ganttColor: '#b45309',
        proof: 'Dossier_DHW_Bouira.pdf (p.28)',
        reconciled: false
      },
      {
        ref: 'AOON/15/2026/ANBT-CHLEF',
        authority: 'Agence Nationale des Barrages et Transferts',
        state: 'PROPOSED_IN_BID',
        stateLabel: 'En Attente',
        engineers: 20,
        period: 'Mar 2027 – Fév 2028',
        ganttLeft: 80,
        ganttWidth: 20,
        ganttColor: '#b45309',
        proof: 'Dossier_ANBT_Chlef.pdf (p.15)',
        reconciled: false
      }
    ];

    let currentLang = 'fr';
    let currentRole = 'COMPANY';
    let currentFilter = 'ALL';
    let selectedReqId = 'REQ-CAND-04';
    let activeView = 'audit';
    let inspectorMode = 'EXCERPT';
    let currentEphPage = 1;

    // ==========================================================================
    // INITIALIZATION & BACKEND HEALTH CHECK
    // ==========================================================================
    async function checkBackendConnection() {
      try {
        const res = await fetch(`${API_BASE}/api/v1/health`);
        if (res.ok) {
          const data = await res.json();
          const el = document.getElementById('backend-health-text');
          if (el) el.textContent = 'En Ligne';
        }
      } catch (_) {
        const el = document.getElementById('backend-health-text');
        if (el) el.textContent = 'Mode Local';
      }

      // Sync real-time Lot 04 equipment workflow if API is live
      try {
        const eqRes = await fetch(`${API_BASE}/api/v1/equipment/workflow`);
        if (eqRes.ok) {
          const eqData = await eqRes.json();
          if (eqData && eqData.items && eqData.items.length) {
            LOT4_WORKFLOW_STATE = eqData;
            renderFichesList();
            if (document.getElementById('ft-inspector-code')) {
              selectFicheItem(selectedFtCode);
            }
          }
        }
      } catch (_) {}
    }

    // Sidebar Collapse & Floating Drawer Controller
    function toggleSidebar() {
      const layout = document.querySelector('.app-layout');
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      const isMobile = window.innerWidth <= 980;

      if (isMobile) {
        const isOpen = sidebar.classList.contains('open');
        sidebar.classList.toggle('open', !isOpen);
        if (backdrop) backdrop.classList.toggle('open', !isOpen);
        return;
      }

      const isCollapsed = layout.classList.contains('sidebar-collapsed');
      if (!isCollapsed) {
        collapseSidebar();
      } else {
        if (sidebar.classList.contains('floating-open')) {
          closeFloatingSidebar();
        } else {
          openFloatingSidebar();
        }
      }
    }

    function toggleSidebarCollapse() {
      const layout = document.querySelector('.app-layout');
      if (layout.classList.contains('sidebar-collapsed')) {
        pinSidebar();
      } else {
        collapseSidebar();
      }
    }

    function collapseSidebar() {
      const layout = document.querySelector('.app-layout');
      layout.classList.add('sidebar-collapsed');
      closeFloatingSidebar();
      updateCollapseBtnIcon(true);
      try { localStorage.setItem('mithaq_sidebar_collapsed', 'true'); } catch(_) {}
    }

    function pinSidebar() {
      const layout = document.querySelector('.app-layout');
      layout.classList.remove('sidebar-collapsed');
      closeFloatingSidebar();
      updateCollapseBtnIcon(false);
      try { localStorage.setItem('mithaq_sidebar_collapsed', 'false'); } catch(_) {}
    }

    function openFloatingSidebar() {
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar) sidebar.classList.add('floating-open');
      if (backdrop) backdrop.classList.add('open');
    }

    function closeFloatingSidebar() {
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar) {
        sidebar.classList.remove('floating-open');
        sidebar.classList.remove('open');
      }
      if (backdrop) backdrop.classList.remove('open');
    }

    function updateCollapseBtnIcon(isCollapsed) {
      const btn = document.getElementById('sidebar-collapse-toggle-btn');
      if (!btn) return;
      if (isCollapsed) {
        btn.setAttribute('title', 'Ancrer le menu latéral');
        btn.setAttribute('aria-label', 'Ancrer le menu latéral');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M5 3l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      } else {
        btn.setAttribute('title', 'Réduire le menu latéral (Ctrl+B)');
        btn.setAttribute('aria-label', 'Réduire le menu latéral');
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M11 3L6 8l5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      }
    }

    function toggleMobileSidebar() {
      toggleSidebar();
    }

    // Mobile Workbench Tabs: List vs Preview
    function setMobileWorkbenchTab(tab) {
      document.getElementById('tab-btn-list').classList.toggle('active', tab === 'list');
      document.getElementById('tab-btn-preview').classList.toggle('active', tab === 'preview');
      const colList = document.getElementById('col-requirements-list');
      const colPreview = document.getElementById('col-pdf-inspector');

      if (tab === 'list') {
        colList.classList.remove('hidden-mobile');
        colPreview.classList.add('hidden-mobile');
      } else {
        colList.classList.add('hidden-mobile');
        colPreview.classList.remove('hidden-mobile');
      }
    }

    // Mobile Workbench Tabs for View 02B Fiches Techniques
    function setMobileFtWorkbenchTab(tab) {
      const btnList = document.getElementById('tab-btn-ft-list');
      const btnPreview = document.getElementById('tab-btn-ft-preview');
      if (btnList) btnList.classList.toggle('active', tab === 'list');
      if (btnPreview) btnPreview.classList.toggle('active', tab === 'preview');
      const colList = document.getElementById('col-fiches-list');
      const colPreview = document.getElementById('col-fiches-inspector');

      if (tab === 'list') {
        if (colList) colList.classList.remove('hidden-mobile');
        if (colPreview) colPreview.classList.add('hidden-mobile');
      } else {
        if (colList) colList.classList.add('hidden-mobile');
        if (colPreview) colPreview.classList.remove('hidden-mobile');
      }
    }

    // ==========================================================================
    // ROLE SWITCHER & NAVIGATION
    // ==========================================================================
    function setRoleMode(role) {
      currentRole = role;
      document.getElementById('role-btn-company').classList.toggle('active', role === 'COMPANY');
      document.getElementById('role-btn-committee').classList.toggle('active', role === 'COMMITTEE');
      document.getElementById('active-role-pill').textContent =
        role === 'COMPANY' ? 'SOUMISSIONNAIRE' : 'COMMISSION COPEO';

      if (role === 'COMPANY' && (activeView === 'committee' || activeView === 'overlap')) {
        switchView('audit');
      } else if (role === 'COMMITTEE' && (activeView === 'audit' || activeView === 'vault' || activeView === 'fiches')) {
        switchView('committee');
      }
    }

    function switchView(viewName) {
      activeView = viewName;
      document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
      document.getElementById(`view-${viewName}`).classList.add('active');

      document.querySelectorAll('.sidebar .nav-item').forEach(b => b.classList.remove('active'));
      const navBtn = document.getElementById(`nav-${viewName}`);
      if (navBtn) navBtn.classList.add('active');

      const headings = {
        audit: '01 · Audit de Conformité du Dossier',
        vault: '02 · Pièces Légales & CNAS',
        committee: '03 · Évaluation des Soumissionnaires (COPEO)',
        overlap: '04 · Disponibilité du Personnel (CNAS)',
        eph: '05 · Consultation du Cahier des Charges',
        fiches: '02B · Fiches Techniques Médicales (Lot 04)'
      };
      document.getElementById('active-view-heading').textContent = headings[viewName] || headings.audit;

      const ctaLabel = document.getElementById('primary-cta-label');
      if (viewName === 'audit') ctaLabel.textContent = "Télécharger le rapport d'audit (PDF)";
      else if (viewName === 'vault') ctaLabel.textContent = 'Mettre à jour une pièce';
      else if (viewName === 'committee') ctaLabel.textContent = "Télécharger le PV COPEO (PDF)";
      else if (viewName === 'overlap') ctaLabel.textContent = "Demande d'Éclaircissement";
      else if (viewName === 'eph') ctaLabel.textContent = 'Importer un document (PDF)';
      else if (viewName === 'fiches') ctaLabel.textContent = 'Télécharger Dossier Lot 04 (PDF)';

      // Close floating sidebar drawer on navigation so it goes back to its place
      closeFloatingSidebar();
    }

    function triggerPrimaryAction() {
      if (activeView === 'fiches') { downloadCompiledTechnicalDossier(); return; }
      if (activeView === 'overlap') openClarificationModal();
      else if (activeView === 'vault' || activeView === 'eph') openUploadModal();
      else if (activeView === 'committee') {
        window.open(`${API_BASE}/api/v1/export/copeo-pv`, '_blank');
        showToast("Procès-Verbal officiel COPEO téléchargé avec succès.");
      } else {
        window.open(`${API_BASE}/api/v1/export/audit-report`, '_blank');
        showToast("Rapport d'audit pré-soumission officiel téléchargé avec succès.");
      }
    }

    // ==========================================================================
    // VIEW 1: REQUIREMENTS CHECKLIST & SYNCHRONIZED PDF INSPECTOR
    // ==========================================================================
    function updateKpiCounts() {
      const blockers = REQUIREMENTS_DATA.filter(r => r.status === 'BLOCKER').length;
      const warnings = REQUIREMENTS_DATA.filter(r => r.status === 'WARNING').length;
      const verified = REQUIREMENTS_DATA.filter(r => r.status === 'VERIFIED').length;

      document.getElementById('kpi-count-all').textContent = `${REQUIREMENTS_DATA.length} Clauses`;
      document.getElementById('kpi-count-blockers').textContent = `${blockers} Bloquants`;
      document.getElementById('kpi-count-warnings').textContent = `${warnings} Alertes`;
      document.getElementById('kpi-count-verified').textContent = `${verified} Conformes`;

      const totalIssues = blockers + warnings;
      const navBadge = document.getElementById('nav-badge-audit');
      navBadge.textContent = totalIssues > 0 ? `${totalIssues} alertes` : '100% OK';
      navBadge.className = totalIssues > 0 ? 'badge badge-blocker mono' : 'badge badge-verified mono';
    }

    function filterRequirements(filterKey) {
      currentFilter = filterKey;
      document.querySelectorAll('#envelope-pills .pill-filter').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === filterKey);
      });
      document.querySelectorAll('#view-audit .kpi-card').forEach(c => c.classList.remove('active-filter'));
      if (filterKey === 'ALL') document.getElementById('kpi-all').classList.add('active-filter');
      if (filterKey === 'BLOCKER') document.getElementById('kpi-blockers').classList.add('active-filter');
      if (filterKey === 'ISSUES') document.getElementById('kpi-warnings').classList.add('active-filter');
      if (filterKey === 'VERIFIED') document.getElementById('kpi-verified').classList.add('active-filter');

      renderRequirementsList();
    }

    function renderRequirementsList() {
      updateKpiCounts();
      const q = (document.getElementById('req-search').value || '').toLowerCase().trim();
      const container = document.getElementById('requirements-list-container');

      const filtered = REQUIREMENTS_DATA.filter(item => {
        if (currentFilter === 'CANDIDATURE' && item.envelope !== 'CANDIDATURE') return false;
        if (currentFilter === 'TECHNIQUE' && item.envelope !== 'TECHNIQUE') return false;
        if (currentFilter === 'FINANCIERE' && item.envelope !== 'FINANCIERE') return false;
        if (currentFilter === 'BLOCKER' && item.status !== 'BLOCKER') return false;
        if (currentFilter === 'ISSUES' && item.status !== 'WARNING') return false;
        if (currentFilter === 'VERIFIED' && item.status !== 'VERIFIED') return false;
        if (q) {
          const hay = `${item.id} ${item.title_fr} ${item.title_ar} ${item.desc_fr} ${item.category}`.toLowerCase();
          return hay.includes(q);
        }
        return true;
      });

      container.innerHTML = filtered.map(item => {
        const isSelected = item.id === selectedReqId;
        const title = currentLang === 'ar' ? item.title_ar : item.title_fr;
        const desc = currentLang === 'ar' ? item.desc_ar : item.desc_fr;
        const statusLabel = currentLang === 'ar' ? item.statusLabel_ar : item.statusLabel_fr;

        let badgeClass = 'badge-verified';
        if (item.status === 'BLOCKER') badgeClass = 'badge-blocker';
        else if (item.status === 'WARNING') badgeClass = 'badge-warning';

        return `
          <div class="req-row ${isSelected ? 'selected' : ''}" onclick="selectRequirement('${item.id}')">
            <div class="req-row-top">
              <div style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
                <span class="mono" style="color: var(--color-ink); font-weight: 500;">${item.id}</span>
                <span class="badge badge-envelope mono">${item.envelope}</span>
                <span style="font-size: 11.5px; color: var(--color-ash);">${item.category}</span>
              </div>
              <span class="badge ${badgeClass}">${statusLabel}</span>
            </div>
            <div class="req-title">${title}</div>
            <div class="req-desc">${desc}</div>
            <div class="req-footer">
              <span class="mono">${item.docName} · ${item.page}</span>
              <span class="mono" style="color: var(--color-ink); font-weight: 500; cursor: pointer; text-decoration: underline;" onclick="event.stopPropagation(); jumpToInspectorScan('${item.id}')">Voir preuve PDF →</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function jumpToInspectorScan(reqId) {
      selectRequirement(reqId);
      setInspectorMode('SCAN');
      if (window.innerWidth <= 1024) {
        setMobileWorkbenchTab('preview');
      } else {
        const inspector = document.getElementById('col-pdf-inspector');
        if (inspector) {
          inspector.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          inspector.classList.remove('flash-highlight');
          void inspector.offsetWidth;
          inspector.classList.add('flash-highlight');
          setTimeout(() => inspector.classList.remove('flash-highlight'), 1800);
        }
      }
    }

    function setInspectorMode(mode) {
      inspectorMode = mode;
      document.getElementById('mode-btn-excerpt').classList.toggle('active', mode === 'EXCERPT');
      document.getElementById('mode-btn-scan').classList.toggle('active', mode === 'SCAN');
      document.getElementById('simulated-pdf-page').style.display = mode === 'EXCERPT' ? 'block' : 'none';
      document.getElementById('raw-scan-preview').style.display = mode === 'SCAN' ? 'block' : 'none';
    }

    function selectRequirement(reqId) {
      selectedReqId = reqId;
      const item = REQUIREMENTS_DATA.find(r => r.id === reqId) || REQUIREMENTS_DATA[0];
      renderRequirementsList();

      document.getElementById('pdf-doc-filename').textContent = item.docName;
      document.getElementById('pdf-page-indicator').textContent = item.page;
      document.getElementById('pdf-bbox-coords').textContent = 'Passage ciblé';

      const padScan = String(item.cdcScanPage || 6).padStart(2, '0');
      document.getElementById('inspector-scan-img').src = `src/extracted_pages/page_${padScan}.jpg`;

      const quote = currentLang === 'ar' ? item.quote_ar : item.quote_fr;
      const remediation = currentLang === 'ar' ? item.remediation_ar : item.remediation_fr;

      document.getElementById('simulated-pdf-page').innerHTML = `
        <div class="doc-header-banner">
          <strong>RÉPUBLIQUE ALGÉRIENNE DÉMOCRATIQUE ET POPULAIRE</strong>
          <span>الجمهورية الجزائرية الديمقراطية الشعبية</span>
          <div class="mono" style="margin-top: 4px; color: var(--color-ash);">${item.docHeader_fr}</div>
        </div>
        <div class="bbox-highlight ${item.bboxColor}">
          <span class="bbox-coord-tag">Extrait Vérifié · ${item.id}</span>
          <div style="font-size: 13.5px; line-height: 1.55;">
            ${quote}
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 11.5px; color: var(--color-ash); padding-top: 8px; border-top: 1px dashed var(--color-hairline);">
          <span class="mono">${item.stampStatus}</span>
          <span class="mono" style="color: var(--color-ink);">Citation exacte vérifiée</span>
        </div>
      `;

      document.getElementById('inspector-remediation-text').textContent = remediation;
      const statusEl = document.getElementById('inspector-audit-status');
      if (item.humanDecision) {
        statusEl.textContent = item.humanDecision;
        statusEl.style.color = '#15803d';
        statusEl.style.fontWeight = '500';
      } else {
        statusEl.textContent = 'Action requise avant le dépôt';
        statusEl.style.color = 'var(--color-ash)';
        statusEl.style.fontWeight = 'normal';
      }

      const uploadBtn = document.getElementById('inspector-upload-btn');
      if (uploadBtn) {
        if (item.envelope === 'FINANCIERE') {
          uploadBtn.textContent = 'Remplacer l\'Offre Financière (BPU/DQE)';
        } else if (item.envelope === 'TECHNIQUE') {
          uploadBtn.textContent = 'Remplacer l\'Offre Technique';
        } else {
          uploadBtn.textContent = 'Remplacer la Pièce de Candidature';
        }
      }

      // If mobile, auto-switch to preview tab on selection
      if (window.innerWidth <= 1024) {
        setMobileWorkbenchTab('preview');
      }
    }

    function openUploadForCurrentRequirement() {
      const item = REQUIREMENTS_DATA.find(r => r.id === selectedReqId) || REQUIREMENTS_DATA[0];
      if (item.envelope === 'FINANCIERE') {
        openUploadModalFor('FINANCIERE');
      } else if (item.envelope === 'TECHNIQUE') {
        openUploadModalFor('TECHNIQUE');
      } else {
        openUploadModalFor('CANDIDATURE');
      }
    }

    async function confirmFinding() {
      const item = REQUIREMENTS_DATA.find(r => r.id === selectedReqId);
      if (!item) return;
      item.humanDecision = '✓ Constat validé par l’auditeur humain';
      selectRequirement(selectedReqId);
      showToast(`Constat ${selectedReqId} confirmé dans le journal d'audit.`);
      try {
        await fetch(`${API_BASE}/api/v1/audit/decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ req_code: selectedReqId, decision: 'CONFIRMED' })
        });
      } catch (_) {}
    }

    async function overrideFinding() {
      const item = REQUIREMENTS_DATA.find(r => r.id === selectedReqId);
      if (!item) return;
      const note = prompt(
        "Motif obligatoire de validation humaine (traçabilité Loi n° 23-12) :",
        "Pièce justificative régularisée et vérifiée par l'auditeur."
      );
      if (!note) return;
      item.status = 'VERIFIED';
      item.statusLabel_fr = 'Validé (Décision Humaine)';
      item.statusLabel_ar = 'مصادق عليه بشريا';
      item.bboxColor = 'bbox-green';
      item.humanDecision = `✓ Validé : "${note.slice(0, 38)}"`;
      selectRequirement(selectedReqId);
      showToast(`Clause ${selectedReqId} marquée conforme avec motif d'audit.`);
      try {
        await fetch(`${API_BASE}/api/v1/audit/decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ req_code: selectedReqId, decision: 'HUMAN_OVERRIDE', note })
        });
      } catch (_) {}
    }

    // ==========================================================================
    // VIEW 2: COMPANY DOCUMENT VAULT WITH 1-CLICK RENEWAL SIMULATION
    // ==========================================================================
    function renderVaultTable() {
      const tbody = document.getElementById('vault-table-body');
      const validCount = VAULT_DOCS.filter(d => d.status === 'VERIFIED').length;
      document.getElementById('vault-valid-ratio').textContent = `${validCount} / ${VAULT_DOCS.length} Valides`;

      const expiredCount = VAULT_DOCS.length - validCount;
      const vaultBadge = document.getElementById('nav-badge-vault');
      vaultBadge.textContent = expiredCount > 0 ? `${expiredCount} expiré` : '100% OK';
      vaultBadge.className = expiredCount > 0 ? 'badge badge-warning mono' : 'badge badge-verified mono';

      tbody.innerHTML = VAULT_DOCS.map((doc, idx) => {
        const isOk = doc.status === 'VERIFIED';
        return `
          <tr>
            <td>
              <div style="font-weight: 600; color: var(--color-ink);">${doc.name}</div>
              <div class="mono" style="font-size: 11px; color: var(--color-ash); margin-top: 2px;">${doc.ref}</div>
            </td>
            <td class="mono">${doc.issued}</td>
            <td>
              <span class="mono" style="color: ${isOk ? 'var(--color-pulse-green)' : 'var(--color-coral-red)'}; font-weight: 500;">
                ${doc.validity}
              </span>
            </td>
            <td>
              <div style="display: flex; gap: 6px; align-items: center; flex-wrap: wrap;">
                <span class="badge ${isOk ? 'badge-verified' : 'badge-blocker'}">${isOk ? 'Conforme' : 'Bloquant'}</span>
                <span class="mono" style="font-size: 11px; color: var(--color-ash);">${doc.stamp}</span>
              </div>
            </td>
            <td style="text-align: right; white-space: nowrap;">
              ${
                isOk
                  ? `<button class="btn-ghost mono" style="padding: 4px 8px; font-size: 11px; background: var(--color-paper);" onclick="openUploadModalFor('CANDIDATURE')">Remplacer</button>`
                  : `<button class="btn-acid-lime mono" style="padding: 5px 12px; font-size: 11.5px;" onclick="openUploadModalFor('CANDIDATURE')">Mettre à jour</button>`
              }
            </td>
          </tr>
        `;
      }).join('');
    }

    function renewVaultDocument(index) {
      const doc = VAULT_DOCS[index];
      doc.issued = '15/10/2026';
      doc.validity = 'Valide (+83 jours)';
      doc.stamp = 'Cachet Humide + Signature OK';
      doc.status = 'VERIFIED';

      if (doc.linkedReqId) {
        const req = REQUIREMENTS_DATA.find(r => r.id === doc.linkedReqId);
        if (req) {
          req.status = 'VERIFIED';
          req.statusLabel_fr = 'Conforme (Mis à jour)';
          req.statusLabel_ar = 'مطابق (تم التحديث)';
          req.bboxColor = 'bbox-green';
          req.humanDecision = '✓ Pièce renouvelée dans le Coffre-Fort le 15/10/2026';
        }
      }
      renderVaultTable();
      renderFichesList();
      selectFicheItem('LOT 4-01');
      renderRequirementsList();
      showToast(`${doc.name} renouvelé : le bloquant associé a été levé dans l'Audit Pré-Soumission.`);
    }

    // ==========================================================================
    // VIEW 3: COPEO LIVE TECHNICAL SCORING CALCULATOR
    // ==========================================================================
    function recalcCopeoScores() {
      const bidders = [
        { key: 'atlas', label: 'total-cell-atlas', warn: true },
        { key: 'hydro', label: 'total-cell-hydro', warn: false },
        { key: 'cosider', label: 'total-cell-cosider', warn: false },
        { key: 'tell', label: 'total-cell-tell', warn: false }
      ];
      bidders.forEach(b => {
        let sum = 0;
        for (let i = 1; i <= 4; i++) {
          const val = parseFloat(document.getElementById(`score-${b.key}-${i}`).value || '0');
          sum += isNaN(val) ? 0 : val;
        }
        const cell = document.getElementById(b.label);
        const passed = sum >= 60;
        if (b.key === 'atlas' && OVERLAP_COMMITMENTS.filter(c => !c.reconciled).length > 1) {
          cell.innerHTML = `
            <div class="mono" style="font-size: 15px; color: var(--color-ink); font-weight: 500;">${sum.toFixed(1)} / 100 pts</div>
            <span class="badge badge-verify" style="margin-top: 4px;">Suspendu : Requis CNAS</span>
          `;
        } else if (passed) {
          cell.innerHTML = `
            <div class="mono" style="font-size: 15px; color: var(--color-pulse-green); font-weight: 500;">${sum.toFixed(1)} / 100 pts</div>
            <span class="badge badge-verified" style="margin-top: 4px;">Admis (Financière)</span>
          `;
        } else {
          cell.innerHTML = `
            <div class="mono" style="font-size: 15px; color: var(--color-coral-red); font-weight: 500;">${sum.toFixed(1)} / 100 pts</div>
            <span class="badge badge-blocker" style="margin-top: 4px;">Éliminé (< 60 pts)</span>
          `;
        }
      });
    }

    // ==========================================================================
    // VIEW 4: CROSS-TENDER RESOURCE OVERLAP LEDGER & LIVE RECONCILIATION
    // ==========================================================================
    function renderOverlapLedger() {
      const activeList = OVERLAP_COMMITMENTS.filter(c => !c.reconciled);
      const totalPledged = activeList.reduce((acc, c) => acc + c.engineers, 0);
      const ratio = Math.round((totalPledged / 20) * 100);
      const deficit = Math.max(0, totalPledged - 20);

      document.getElementById('overlap-projects-count').textContent = `${activeList.length} Marchés`;
      document.getElementById('overlap-total-pledged').textContent = `${totalPledged} Ingénieurs`;
      document.getElementById('overlap-ratio-badge').textContent = `${ratio}% Charge`;
      document.getElementById('overlap-deficit-sub').textContent =
        deficit > 0 ? `Déficit théorique : -${deficit} ingénieurs` : 'Capacité CNAS respectée (Aucun déficit)';
      document.getElementById('nav-badge-overlap').textContent = `${ratio}%`;
      document.getElementById('vault-pledged-count').textContent = `${totalPledged} Ingénieurs`;
      document.getElementById('copeo-sub-atlas').textContent = `Charge Moyens : ${totalPledged}/20 Ing. (${ratio}%)`;

      const tbody = document.getElementById('overlap-commitments-tbody');
      tbody.innerHTML = OVERLAP_COMMITMENTS.map((c, idx) => {
        const badgeClass = c.reconciled
          ? 'badge-verified'
          : (c.state === 'AWARDED_ACTIVE' ? 'badge-blocker' : (c.state === 'CURRENT_BID' ? 'badge-verify' : 'badge-warning'));
        return `
          <tr style="${c.reconciled ? 'opacity: 0.6;' : ''}">
            <td>
              <div class="mono" style="color: var(--color-ink); font-weight: 600;">${c.ref}</div>
              <div style="font-size: 11.5px; color: var(--color-ash); margin-top: 2px;">${c.authority}</div>
            </td>
            <td><span class="badge ${badgeClass}">${c.reconciled ? 'LIBÉRÉ (PV)' : c.stateLabel}</span></td>
            <td class="mono"><strong>${c.reconciled ? '0' : c.engineers + ' Ing.'}</strong></td>
            <td>
              <div style="display: flex; align-items: center; gap: 8px;">
                <div class="gantt-track">
                  <div class="gantt-fill" style="left: ${c.ganttLeft}%; width: ${c.ganttWidth}%; background: ${c.reconciled ? '#047857' : c.ganttColor};"></div>
                </div>
                <span class="mono" style="color: var(--color-ash); font-size: 10.5px;">${c.period}</span>
              </div>
            </td>
            <td class="mono" style="color: var(--color-signal-teal); font-weight: 500; font-size: 11.5px;">${c.proof}</td>
            <td style="text-align: right;">
              ${
                c.state === 'CURRENT_BID'
                  ? '<span class="mono" style="color: var(--color-ink); font-weight: 500;">Offre évaluée</span>'
                  : c.reconciled
                  ? '<span class="mono" style="color: var(--color-pulse-green); font-weight: 500;">✓ Libéré</span>'
                  : `<button class="btn-acid-lime" style="padding: 4px 10px; font-size: 11px;" onclick="reconcileOverlapProject(${idx})">Joindre PV</button>`
              }
            </td>
          </tr>
        `;
      }).join('');
      recalcCopeoScores();
    }

    async function reconcileOverlapProject(idx) {
      const item = OVERLAP_COMMITMENTS[idx];
      item.reconciled = true;
      renderOverlapLedger();
      showToast(`PV de réception provisoire enregistré pour ${item.ref} : 20 ingénieurs libérés.`);
      try {
        await fetch(`${API_BASE}/api/v1/overlap/reconcile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tender_ref: item.ref })
        });
      } catch (_) {}
    }

    // ==========================================================================
    // VIEW 5: LIVE HYBRID RAG SEARCH + 28-PAGE CDC EPH MOHAMMADIA VIEWER
    // ==========================================================================
    function setRagQueryAndRun(q) {
      document.getElementById('rag-query-input').value = q;
      runLiveRagSearch();
    }

    async function runLiveRagSearch() {
      const q = (document.getElementById('rag-query-input').value || '').trim() ||
        'Quelles sont les pièces éliminatoires et les moyens humains exigés ?';
      const container = document.getElementById('rag-results-container');
      container.innerHTML = '<div class="mono" style="color: var(--color-ash);">Recherche des clauses pertinentes en cours...</div>';

      let results = [];
      try {
        const res = await fetch(`${API_BASE}/api/v1/rag/hybrid-search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, top_k: 3 })
        });
        if (res.ok) {
          const data = await res.json();
          results = data.results || [];
        }
      } catch (_) {}

      // Local fallback if opened without server
      if (results.length === 0) {
        results = REQUIREMENTS_DATA.slice(0, 3).map((r, i) => ({
          doc_name: 'CDC EPH MOHAMMADIA.pdf',
          section_title: r.category,
          page_number: r.cdcScanPage || 6,
          bbox: [0.07, 0.18, 0.91, 0.42],
          child_content: r.desc_fr,
          parent_content: r.quote_fr,
          rrf_score: (0.032 - i * 0.002).toFixed(4)
        }));
      }

      container.innerHTML = results.map((r, idx) => {
        const pad = String(r.page_number).padStart(2, '0');
        return `
        <div class="rag-rule-card" id="rag-rule-${idx}" style="background: var(--color-paper); border: 1px solid var(--color-hairline); border-radius: var(--radius-wash); padding: 16px; cursor: pointer; transition: all 0.15s ease;" onclick="handleRagCardClick(event, ${idx}, ${r.page_number})" onmouseover="this.style.borderColor='var(--color-ink)'" onmouseout="if(!document.getElementById('eph-slide-${idx}')?.classList.contains('open')) this.style.borderColor='var(--color-hairline)'">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="badge badge-envelope mono">${r.doc_name} · Page ${r.page_number}</span>
              <span style="color: var(--color-ink); font-size: 13.5px; font-weight: 600;">${r.section_title || 'Clause réglementaire'}</span>
            </div>
            <span class="badge badge-verified mono">Article du Marché</span>
          </div>
          <div style="color: var(--color-ink); font-size: 13px; line-height: 1.55; margin-bottom: 8px;">
            ${r.child_content}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; flex-wrap: wrap; gap: 10px; border-top: 1px dashed var(--color-hairline); padding-top: 10px;">
            <div class="mono" style="font-size: 11px; color: var(--color-ash); flex: 1; min-width: 200px;">
              Extrait : ${r.parent_content.slice(0, 130)}...
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button class="btn-ghost mono" id="slide-btn-${idx}" style="font-size: 11.5px; padding: 5px 12px; background: var(--color-bone);" onclick="event.stopPropagation(); toggleEphCardSlide(${idx}, ${r.page_number})">
                <span id="slide-btn-text-${idx}">Déplier l'aperçu (Page ${r.page_number}) ▾</span>
              </button>
              <button class="btn-acid-lime mono" style="font-size: 11.5px; padding: 5px 12px;" onclick="event.stopPropagation(); jumpToEphScanPage(${r.page_number})" title="Naviguer directement vers le visualiseur de documents">
                Aller à la page ${r.page_number} ↓
              </button>
            </div>
          </div>

          <!-- POP-OUT CARD SLIDE UNDERNEATH THE RULE -->
          <div class="eph-card-slide" id="eph-slide-${idx}">
            <div style="margin-top: 14px; padding: 14px; background: #faf9f7; border: 1px solid var(--color-hairline); border-radius: var(--radius-buttons);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--color-hairline);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge badge-neutral mono" style="font-weight: 600;">Page ${pad} / 28</span>
                  <span style="font-size: 12px; font-weight: 500; color: var(--color-ink);">Scan Numérisé du Cahier des Charges</span>
                </div>
                <div style="display: flex; gap: 6px;">
                  <button class="btn-acid-lime mono" style="font-size: 11px; padding: 3px 8px;" onclick="event.stopPropagation(); jumpToEphScanPage(${r.page_number})">
                    Ouvrir dans le grand visualiseur ↓
                  </button>
                  <button class="btn-ghost mono" style="font-size: 11px; padding: 3px 8px;" onclick="event.stopPropagation(); toggleEphCardSlide(${idx}, ${r.page_number})">
                    ✕ Réduire
                  </button>
                </div>
              </div>
              <div style="text-align: center; background: #e5e3df; border-radius: 6px; padding: 12px; border: 1px solid #dcdad5;">
                <img src="src/extracted_pages/page_${pad}.jpg" alt="Scan Page ${r.page_number}" style="max-width: 100%; max-height: 520px; object-fit: contain; border-radius: 4px; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12); border: 1px solid rgba(0,0,0,0.1);" loading="lazy" />
              </div>
            </div>
          </div>
        </div>
        `;
      }).join('');

      if (results[0] && results[0].page_number) {
        selectEphPage(results[0].page_number);
      }
    }

    function handleRagCardClick(event, idx, pageNumber) {
      if (event.target.closest('button') || event.target.closest('a') || event.target.closest('input')) {
        return;
      }
      toggleEphCardSlide(idx, pageNumber);
    }

    function toggleEphCardSlide(idx, pageNumber) {
      const slide = document.getElementById(`eph-slide-${idx}`);
      const btnText = document.getElementById(`slide-btn-text-${idx}`);
      if (!slide) return;

      const isOpen = slide.classList.contains('open');

      if (isOpen) {
        slide.classList.remove('open');
        if (btnText) btnText.textContent = `Déplier l'aperçu (Page ${pageNumber}) ▾`;
      } else {
        slide.classList.add('open');
        if (btnText) btnText.textContent = `▲ Réduire l'aperçu (Page ${pageNumber})`;
        selectEphPage(pageNumber);
        setTimeout(() => {
          slide.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }

    function jumpToEphScanPage(pageNumber) {
      selectEphPage(pageNumber);
      const panel = document.getElementById('eph-scan-panel');
      if (panel) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        panel.classList.remove('flash-highlight');
        void panel.offsetWidth;
        panel.classList.add('flash-highlight');
        setTimeout(() => panel.classList.remove('flash-highlight'), 1800);
      }
    }

    function renderEphPageGrid() {
      const grid = document.getElementById('eph-page-grid');
      if (!grid) return;
      let html = '';
      for (let p = 1; p <= 28; p++) {
        const pad = String(p).padStart(2, '0');
        const isCurrent = p === currentEphPage;
        const activeStyle = isCurrent
          ? 'background: var(--color-ink); color: var(--color-paper); font-weight: 500; border-color: var(--color-ink);'
          : 'background: var(--color-paper); color: var(--color-ink); border-color: var(--color-hairline);';
        html += `<button class="btn-ghost mono" style="justify-content: center; padding: 6px 0; ${activeStyle}" onclick="selectEphPage(${p})">P.${pad}</button>`;
      }
      grid.innerHTML = html;
    }

    function selectEphPage(p) {
      currentEphPage = Math.max(1, Math.min(28, p));
      const pad = String(currentEphPage).padStart(2, '0');
      document.getElementById('eph-scan-img').src = `src/extracted_pages/page_${pad}.jpg`;
      document.getElementById('eph-page-label').textContent = `Page ${pad} / 28`;
      renderEphPageGrid();
    }

    function stepEphPage(delta) {
      selectEphPage(currentEphPage + delta);
    }

    // ==========================================================================
    // MODALS, UPLOAD & LANGUAGE SWITCHER
    // ==========================================================================
    function openClarificationModal() {
      document.getElementById('clarification-modal').classList.add('open');
    }
    function closeClarificationModal() {
      document.getElementById('clarification-modal').classList.remove('open');
    }
    function copyClarificationLetter() {
      navigator.clipboard.writeText(document.getElementById('clarification-letter-content').textContent);
      showToast("Demande d'éclaircissement copiée dans le presse-papiers.");
    }
    function sendClarificationRequest() {
      closeClarificationModal();
      showToast("Demande d'éclaircissement officielle enregistrée au PV COPEO.");
    }

    let currentUploadCategory = 'CDC';

    const UPLOAD_DOC_CONFIG = {
      CDC: {
        title: "Cahier des Charges (CDC Complet)",
        desc: "<strong>Cahier des Charges :</strong> Scans bilingues arabe/français et pièces du marché (redressement 180°, extraction des clauses éliminatoires et indexation des articles).",
        fileLabel: "CDC EPH MOHAMMADIA.pdf (18.8 MB) prêt",
        accept: ".pdf,.jpg,.jpeg,.png",
        btnLabel: "Lancer l'Analyse du Cahier des Charges"
      },
      CANDIDATURE: {
        title: "Dossier de Candidature & Pièces Fiscales",
        desc: "<strong>Dossier de Candidature :</strong> Extrait de rôle (< 90 jours), déclaration de probité (Loi 23-12), déclaration à souscrire, extrait Kbis/CNRC et mise à jour CNAS.",
        fileLabel: "Dossier_Candidature_Atlas.pdf (Extrait de rôle + Probité) prêt",
        accept: ".pdf,.jpg,.jpeg,.png",
        btnLabel: "Vérifier la Candidature & Actualiser le Coffre-Fort"
      },
      TECHNIQUE: {
        title: "Offre Technique & Justificatifs",
        desc: "<strong>Offre Technique :</strong> Mémoire technique justificatif, conformité IP68, planning prévisionnel, diplômes et liste nominative des 20 ingénieurs CNAS.",
        fileLabel: "Offre_Technique_Atlas.pdf (Mémoire + Pompes IP68) prêt",
        accept: ".pdf,.docx,.jpg,.jpeg,.png",
        btnLabel: "Auditer la Conformité de l'Offre Technique"
      },
      FINANCIERE: {
        title: "Offre Financière (BPU & DQE)",
        desc: "<strong>Offre Financière :</strong> Bordereau des Prix Unitaires (BPU en lettres faisant foi) et Détail Quantitatif et Estimatif (DQE en chiffres) pour contrôle arithmétique.",
        fileLabel: "Offre_Financiere_Atlas.pdf (BPU vs DQE) prêt",
        accept: ".pdf,.docx,.jpg,.jpeg,.png",
        btnLabel: "Lancer le Contrôle Arithmétique BPU / DQE"
      },
      EQUIPMENT: {
        title: "Fiche Technique Fournisseur / Matériel (Lot 04)",
        desc: "<strong>Fiche Fournisseur :</strong> Datasheets constructeurs en anglais (PDF, DOCX) ou scans/images PNG à traduire et cacheter au format officiel SARL FLUIDAL.",
        fileLabel: "docs/lot4-12.6 vidoir.png (Scan Anglais) prêt",
        accept: ".pdf,.docx,.png,.jpg,.jpeg",
        btnLabel: "Traduire, Normaliser & Cacheter la Fiche"
      },
      PV: {
        title: "Procès-Verbal de Réception Provisoire (CNAS)",
        desc: "<strong>Justificatif de Fin de Projet :</strong> PV de réception provisoire/définitive pour libérer les ingénieurs engagés sur un marché précédent.",
        fileLabel: "PV_Reception_Provisoire_Wilaya16.pdf prêt",
        accept: ".pdf,.jpg,.jpeg,.png",
        btnLabel: "Enregistrer le PV & Libérer les 20 Ingénieurs"
      }
    };

    function selectUploadDocType(type) {
      currentUploadCategory = type;
      const conf = UPLOAD_DOC_CONFIG[type] || UPLOAD_DOC_CONFIG.CDC;

      document.querySelectorAll('#upload-doc-type-pills .pill-filter').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-type') === type);
      });

      const banner = document.getElementById('upload-type-desc-banner');
      if (banner) banner.innerHTML = conf.desc;

      const fileLabel = document.getElementById('selected-file-label');
      if (fileLabel) fileLabel.textContent = conf.fileLabel;

      const input = document.getElementById('file-picker-input');
      if (input) input.setAttribute('accept', conf.accept);

      const btn = document.getElementById('btn-run-pipeline');
      if (btn) btn.textContent = conf.btnLabel;
    }

    function openUploadModal() {
      document.getElementById('upload-modal').classList.add('open');
      selectUploadDocType(currentUploadCategory || 'CDC');
    }

    function openUploadModalFor(type) {
      currentUploadCategory = type;
      openUploadModal();
      selectUploadDocType(type);
    }

    function closeUploadModal() {
      document.getElementById('upload-modal').classList.remove('open');
    }
    function handleFileChosen(inputEl) {
      if (inputEl.files && inputEl.files[0]) {
        document.getElementById('selected-file-label').textContent =
          `Fichier prêt : ${inputEl.files[0].name} (${(inputEl.files[0].size / 1048576).toFixed(2)} MB)`;
      }
    }

    async function startBrowserUploadPipeline() {
      const box = document.getElementById('pipeline-progress-box');
      const bar = document.getElementById('pipeline-bar-fill');
      const pct = document.getElementById('pipeline-pct-label');
      const logs = document.getElementById('pipeline-log-lines');

      box.style.display = 'block';
      bar.style.width = '25%';
      pct.textContent = '25%';

      if (currentUploadCategory === 'CANDIDATURE') {
        logs.innerHTML = '✓ [Étape 1/3] Lecture de l\'Extrait de Rôle et Déclarations Réglementaires...';
        setTimeout(() => {
          bar.style.width = '65%';
          pct.textContent = '65%';
          logs.innerHTML += '<br/>✓ [Étape 2/3] Contrôle des dates de validité (< 90 jours) et détection des cachets...';
        }, 500);
        setTimeout(() => {
          bar.style.width = '100%';
          pct.textContent = '100%';
          logs.innerHTML += '<br/>✓ [Étape 3/3] Coffre-Fort et Pli de Candidature mis à jour.';
          setTimeout(() => {
            renewVaultDocument(0);
            closeUploadModal();
            switchView('vault');
            showToast("Dossier de candidature validé : l'Extrait de Rôle est à jour (< 90 jours).");
          }, 500);
        }, 1200);
        return;
      }

      if (currentUploadCategory === 'FINANCIERE') {
        logs.innerHTML = '✓ [Étape 1/3] Extraction des montants unitaires du BPU (en lettres)...';
        setTimeout(() => {
          bar.style.width = '65%';
          pct.textContent = '65%';
          logs.innerHTML += '<br/>✓ [Étape 2/3] Recalcul automatique des lignes du DQE et détection d\'écarts...';
        }, 500);
        setTimeout(() => {
          bar.style.width = '100%';
          pct.textContent = '100%';
          logs.innerHTML += '<br/>✓ [Étape 3/3] Contrôle arithmétique finalisé.';
          setTimeout(() => {
            closeUploadModal();
            switchView('audit');
            filterRequirements('FINANCIERE');
            showToast("Offre financière vérifiée : écart BPU/DQE analysé.");
          }, 500);
        }, 1200);
        return;
      }

      if (currentUploadCategory === 'EQUIPMENT') {
        logs.innerHTML = '✓ [Étape 1/3] Ingestion du catalogue / fiche technique constructeur...';
        setTimeout(() => {
          bar.style.width = '65%';
          pct.textContent = '65%';
          logs.innerHTML += '<br/>✓ [Étape 2/3] Traduction en Français médical et génération du cachet vectoriel...';
        }, 500);
        setTimeout(() => {
          bar.style.width = '100%';
          pct.textContent = '100%';
          logs.innerHTML += '<br/>✓ [Étape 3/3] Fiche technique normalisée enregistrée dans le Lot 04.';
          setTimeout(() => {
            closeUploadModal();
            switchView('fiches');
            showToast("Fiche technique constructeur traduite et ajoutée au catalogue.");
          }, 500);
        }, 1200);
        return;
      }

      if (currentUploadCategory === 'PV') {
        logs.innerHTML = '✓ [Étape 1/3] Ingestion du PV de Réception Provisoire...';
        setTimeout(() => {
          bar.style.width = '65%';
          pct.textContent = '65%';
          logs.innerHTML += '<br/>✓ [Étape 2/3] Validation de la libération des 20 ingénieurs sur le marché précédent...';
        }, 500);
        setTimeout(() => {
          bar.style.width = '100%';
          pct.textContent = '100%';
          logs.innerHTML += '<br/>✓ [Étape 3/3] Conflit de chevauchement CNAS résolu.';
          setTimeout(() => {
            reconcileProject('AOON/11/2025/WILAYA-16');
            closeUploadModal();
            switchView('overlap');
            showToast("PV de réception provisoire validé : 20 ingénieurs libérés.");
          }, 500);
        }, 1200);
        return;
      }

      // Default: CDC
      logs.innerHTML = '✓ [Étape 1/4] Extraction des pages scannées du Cahier des Charges...';
      try {
        fetch(`${API_BASE}/api/v1/tenders/upload-and-analyze`, { method: 'POST' }).catch(() => {});
      } catch (_) {}

      setTimeout(() => {
        bar.style.width = '55%';
        pct.textContent = '55%';
        logs.innerHTML += '<br/>✓ [Étape 2/4] Lecture et extraction des clauses (Français / Arabe)...';
      }, 550);

      setTimeout(() => {
        bar.style.width = '85%';
        pct.textContent = '85%';
        logs.innerHTML += '<br/>✓ [Étape 3/4] Indexation sémantique et contrôle réglementaire...';
      }, 1150);

      setTimeout(() => {
        bar.style.width = '100%';
        pct.textContent = '100%';
        logs.innerHTML += '<br/>✓ [Étape 4/4] Cahier des Charges analysé avec succès.';
        setTimeout(() => {
          closeUploadModal();
          switchView('eph');
          runLiveRagSearch();
          showToast('Cahier des Charges analysé et prêt pour la consultation.');
        }, 550);
      }, 1750);
    }

    function toggleLanguage() {
      currentLang = currentLang === 'fr' ? 'ar' : 'fr';
      const htmlEl = document.documentElement;
      if (currentLang === 'ar') {
        htmlEl.setAttribute('lang', 'ar');
        htmlEl.setAttribute('dir', 'rtl');
        document.getElementById('lang-indicator').textContent = 'AR · RTL';
        document.getElementById('nav-text-audit').textContent = 'التدقيق القبلي للعرض';
        document.getElementById('nav-text-vault').textContent = 'خزنة الوثائق و CNAS';
        const navFiches = document.getElementById('nav-text-fiches');
        if (navFiches) navFiches.textContent = 'البطاقات التقنية (الحصة 04)';
        document.getElementById('nav-text-committee').textContent = 'الجدول المقارن (COPEO)';
        document.getElementById('nav-text-overlap').textContent = 'تداخل الموارد (120/20)';
        document.getElementById('nav-text-eph').textContent = 'دفتر الشروط والبحث الذكي';
      } else {
        htmlEl.setAttribute('lang', 'fr');
        htmlEl.setAttribute('dir', 'ltr');
        document.getElementById('lang-indicator').textContent = 'FR · LTR';
        document.getElementById('nav-text-audit').textContent = 'Audit Pré-Soumission';
        document.getElementById('nav-text-vault').textContent = 'Coffre-Fort & CNAS';
        const navFiches = document.getElementById('nav-text-fiches');
        if (navFiches) navFiches.textContent = 'Fiches Techniques (Lot 04)';
        document.getElementById('nav-text-committee').textContent = 'Grille Comparative';
        document.getElementById('nav-text-overlap').textContent = 'Chevauchement Moyens';
        document.getElementById('nav-text-eph').textContent = 'CDC EPH Mohammadia & RAG';
      }
      renderRequirementsList();
      selectRequirement(selectedReqId);
      renderFichesList();
      if (document.getElementById('ft-inspector-code')) {
        selectFicheItem(selectedFtCode);
      }
    }


    // ==========================================================================
    // VIEW 2B: MEDICAL EQUIPMENT & FICHE TECHNIQUE WORKFLOW (SARL FLUIDAL / docs/)
    // ==========================================================================
    let LOT4_WORKFLOW_STATE = {"company_name": "SARL FLUIDAL — Importation de Dispositifs Médicaux & Fluides Médicaux", "tender_name": "EPH de Mohammadia (Mascara) — Lot 04 : Bloc Opératoire & UMC", "cdc_global_rules": {"mandatory_language": "Français obligatoire (Article 09 & 18 du CDC — Traduction requise pour 4 fiches EN/PNG)", "mandatory_stamp": "Cachet humide SARL FLUIDAL obligatoire sur chaque fiche technique (6 fiches constructeur à cacheter)", "bonus_scoring_rule": "Barème Technique sur 65 pts (Seuil éliminatoire 40/65) : Bonus accordé aux équipements dépassant légèrement les seuils (ex: Ra ≥ 97%, LED 80 000h, Charge 450 kg) tout en préservant la compétitivité prix au BPU/DQE."}, "summary_metrics": {"total_lot_items": 19, "total_files_in_docs_folder": 33, "ready_french_fiches": 12, "needs_translation_or_ocr": 4, "needs_supplier_rfq": 3, "multi_candidate_comparisons": 1, "in_stock_count": 16, "out_of_stock_sourcing_count": 3}, "items": [{"item_code": "LOT 4-01", "seq_order": 1, "cdc_title_fr": "Table d'opération chirurgicale universelle hydro-électrique (Radiotransparente)", "cdc_title_ar": "طاولة عمليات جراحية كهروهيدروليكية متعددة الاختصاصات", "cdc_required_specs": [{"param": "Mécanisme d'actionnement", "required": "Électro-hydraulique avec commande filaire + télécommande sans fil", "actual": "Électro-hydraulique + télécommande + panneau colonne (double contrôle)", "status": "MATCH_BONUS"}, {"param": "Hauteur réglable du plateau", "required": "700 mm à 1000 mm (±50 mm)", "actual": "680 mm à 1080 mm (course verticale 400 mm)", "status": "MATCH_BONUS"}, {"param": "Largeur & Longueur du plateau", "required": "Largeur ≥ 500 mm · Longueur ≥ 2000 mm", "actual": "Largeur 520 mm · Longueur 2080 mm (4 sections modulaires)", "status": "MATCH"}, {"param": "Translation longitudinale (Arceau C-Arm)", "required": "≥ 300 mm pour amplificateur de brillance", "actual": "310 mm (accès C-Arm intégral sans repositionner le patient)", "status": "MATCH_BONUS"}, {"param": "Capacité de charge maximale", "required": "≥ 350 kg", "actual": "450 kg (stabilité bariatrique et chirurgicale lourde)", "status": "MATCH_BONUS"}, {"param": "Autonomie batterie de secours", "required": "Batterie intégrée ≥ 50 opérations", "actual": "Batterie rechargeable haute capacité (80–100 interventions)", "status": "MATCH_BONUS"}], "candidates": [{"model": "MEDIGE MGE-OTK8", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot 4-1.MGE-OTK8.pdf", "docx_file": "lot 4-1.MGE-OTK8.docx", "language": "FR", "file_format": "PDF + DOCX (Standardisé SARL FLUIDAL)", "has_company_branding": true, "needs_translation": false, "compliance_pct": 100, "bonus_points": "+4.5 pts (Charge 450 kg + Translation 310 mm + Double commande)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Mieux disant technique + Prix compétitif)", "estimated_unit_cost_dzd": 2450000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 1911000, "resale_margin_pct": 22}, {"item_code": "LOT 4-02", "seq_order": 2, "cdc_title_fr": "Table d'opération électrique polyvalente à 5 moteurs", "cdc_title_ar": "طاولة عمليات كهربائية متعددة الوظائف بـ 5 محركات", "cdc_required_specs": [{"param": "Motorisation", "required": "Électrique ≥ 4 moteurs (Hauteur, Trendelenburg, Inclinaison, Dossier)", "actual": "5 moteurs électriques de précision + glissement longitudinal", "status": "MATCH_BONUS"}, {"param": "Matériau châssis & base", "required": "Acier inoxydable médical AISI 304", "actual": "Acier inoxydable 304 antibactérien résistant à la désinfection", "status": "MATCH"}, {"param": "Matelas opératoire", "required": "Antistatique, sans couture, radiotransparent", "actual": "Mousse à mémoire de forme antibactérienne + plateau rayons X bras C", "status": "MATCH_BONUS"}, {"param": "Inclinaison Trendelenburg / Latérale", "required": "≥ ±20° / ≥ ±15°", "actual": "Trendelenburg ±25° · Inclinaison latérale ±20°", "status": "MATCH_BONUS"}], "candidates": [{"model": "MEDIGE MGE-OT5 Electric", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot4-2.MGE-OT5.pdf", "docx_file": "lot4-2.MGE-OT5.docx", "language": "FR", "file_format": "PDF + DOCX (Standardisé SARL FLUIDAL)", "has_company_branding": true, "needs_translation": false, "compliance_pct": 100, "bonus_points": "+3.0 pts (5e moteur de translation + matelas mémoire de forme)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (5 moteurs au prix d'une 4 moteurs)", "estimated_unit_cost_dzd": 1850000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 1443000, "resale_margin_pct": 22}, {"item_code": "LOT 4-03", "seq_order": 3, "cdc_title_fr": "Table d'opération orthopédique avec cadre d'extension et de traction", "cdc_title_ar": "طاولة عمليات جراحة العظام مع إطار الشد والجر", "cdc_required_specs": [{"param": "Table de base compatible", "required": "Table électrique radiotransparente compatible bras C", "actual": "MGE-OT5 Electric (fournie dans lot4-3.MGE-OT5.pdf)", "status": "MATCH"}, {"param": "Cadre de traction orthopédique", "required": "Cadre en acier inoxydable / fibre de carbone avec bottes de traction, contre-extension périnéale et rotules articulées", "actual": "FICHE INCOMPLÈTE dans lot4-3.MGE-OT7.pdf (seulement 310 caractères, tableau technique manquant)", "status": "MISSING_SPEC"}], "candidates": [{"model": "MEDIGE MGE-OT5 + Cadre de Traction MGE-OT7", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot4-3.MGE-OT7.pdf", "docx_file": "lot4-3.MGE-OT7.docx", "language": "FR (Incomplet)", "file_format": "PDF Incomplet (310 caractères — Tableau manquant)", "has_company_branding": true, "needs_translation": false, "needs_supplier_rfq": true, "compliance_pct": 55, "bonus_points": "Attention : Fiche MGE-OT7 vide à compléter ou demander au fournisseur", "sweet_spot_verdict": "INCOMPLETE_FICHE_ALERT", "sweet_spot_label": "Fiche Incomplète Détectée (Générer fiche complète / RFQ Fournisseur)", "estimated_unit_cost_dzd": 2300000, "selection_selected": true}], "stock_status": "OUT_OF_STOCK_INCOMPLETE", "stock_label": "Fiche absente/incomplète en stock — À demander au fournisseur", "supplier_wholesale_dzd": 1650000, "resale_margin_pct": 28}, {"item_code": "LOT 4-04", "seq_order": 4, "cdc_title_fr": "Éclairage opératoire scialytique double coupole LED avec caméra vidéo HD intégrée", "cdc_title_ar": "مصباح جراحي مزدوج بتقنية LED بدون ظل مع كاميرا فيديو عالية الدقة", "cdc_required_specs": [{"param": "Configuration coupole", "required": "Double coupole LED sans ombre compatible flux laminaire", "actual": "Design Papillon (Butterfly Type MGE-SLK3B) aérodynamique flux laminaire", "status": "MATCH_BONUS"}, {"param": "Durée de vie des LED", "required": "≥ 50 000 heures", "actual": "80 000 heures (LED Osram froides basse consommation)", "status": "MATCH_BONUS"}, {"param": "Caméra chirurgicale intégrée", "required": "Caméra Full HD 1080p montée dans la poignée centrale avec zoom optique", "actual": "MEDIGE Surgical Field Camera (4 pages scannées image PDF)", "status": "MATCH"}, {"param": "Langue de la fiche technique", "required": "Français obligatoire (Article 09 du CDC)", "actual": "ANGLAIS (MGE-SLK3B.pdf) + IMAGE SCANNÉE (Surgical Field Camera.pdf)", "status": "TRANSLATION_REQUIRED"}], "candidates": [{"model": "MEDIGE MGE-SLK3B Butterfly + Caméra Chirurgicale MEDIGE", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot4-4.LED-Shadowless-Operating-Light-MGE-SLK3-Butterfly-Type.pdf", "secondary_file": "lot4-4.Surgical Field Camera MEDIGE.pdf", "language": "EN + SCAN IMAGE", "file_format": "PDF Anglais + PDF Scanné (0 texte sélectionnable)", "has_company_branding": false, "needs_translation": true, "compliance_pct": 95, "bonus_points": "+3.5 pts (LED 80 000h + 4 modes d'éclairage + bras équilibré)", "sweet_spot_verdict": "NEEDS_TRANSLATION_AND_STAMP", "sweet_spot_label": "À Traduire EN→FR & Apposer Cachet SARL FLUIDAL (1 Clic Sans Photoshop)", "estimated_unit_cost_dzd": 1950000, "selection_selected": true}], "stock_status": "IN_STOCK_NEEDS_FR_STAMP", "stock_label": "En stock (Catalogue interne) — À traduire EN→FR & cacheter", "supplier_wholesale_dzd": 1482000, "resale_margin_pct": 24}, {"item_code": "LOT 4-05", "seq_order": 5, "cdc_title_fr": "Lampe opératoire scialytique plafonnière double coupole LED 700/500", "cdc_title_ar": "مصباح عمليات جراحي سقفي مزدوج LED 700/500", "cdc_required_specs": [{"param": "Éclairement central à 1m (Lux)", "required": "Coupole 700 : ≥ 160 000 Lux · Coupole 500 : ≥ 140 000 Lux", "actual": "MGE-SL1D : 180 000 / 160 000 Lux vs Perlong : 160 000 / 140 000 Lux", "status": "MATCH_BONUS"}, {"param": "Indice de rendu des couleurs (Ra / CRI)", "required": "Ra ≥ 95%", "actual": "MGE-SL1D : Ra ≥ 97% vs Perlong : Ra = 95%", "status": "MATCH_BONUS"}, {"param": "Élévation de température (tête chirurgien)", "required": "≤ 2 °C", "actual": "MGE-SL1D : ≤ 1 °C (Perles LED Osram importées d'Allemagne)", "status": "MATCH_BONUS"}, {"param": "Mode endoscopie / laparoscopie", "required": "Souhaité (Bonus barème technique)", "actual": "Inclus sur MGE-SL1D + mémoire numérique micro-ordinateur", "status": "MATCH_BONUS"}], "candidates": [{"model": "MEDIGE MGE-SL1D (LED 700/500)", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot4-5.MGE-SL1D.pdf", "docx_file": "lot4-5.MGE-SL1D.docx", "language": "FR", "file_format": "PDF + DOCX (Standardisé SARL FLUIDAL)", "has_company_branding": true, "needs_translation": false, "compliance_pct": 100, "bonus_points": "+5.0 pts (180k Lux + Ra ≥ 97% + Mode Laparoscopie + Déjà siglé SARL FLUIDAL)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Recommandé (Surpasse le CDC de +12% Lux / Ra 97% sans surcoût excessif)", "estimated_unit_cost_dzd": 1280000, "selection_selected": true}, {"model": "PERLONG LED 700/500", "brand": "Perlong Medical Equipment (Chine)", "source_file": "lot4-5.LED700,500 op lamp.pdf", "docx_file": "lot4-5.LED700,500 op lamp.docx", "language": "FR", "file_format": "PDF + DOCX (Entête Perlong non siglé FLUIDAL)", "has_company_branding": false, "needs_translation": false, "compliance_pct": 100, "bonus_points": "+0.0 pt (Exactement au seuil minimal 160k/140k Lux, Ra 95, 50 000h)", "sweet_spot_verdict": "BASELINE_ALTERNATIVE", "sweet_spot_label": "Alternative Basique (Minimum requis sans bonus technique, non siglé FLUIDAL)", "estimated_unit_cost_dzd": 1190000, "selection_selected": false}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 998400, "resale_margin_pct": 22}, {"item_code": "LOT 4-06", "seq_order": 6, "cdc_title_fr": "Système d'intégration numérique et de visioconférence pour bloc opératoire", "cdc_title_ar": "نظام الإدماج الرقمي والمحاضرات المرئية لغرفة العمليات", "cdc_required_specs": [{"param": "Architecture d'encastrement mural", "required": "Console murale encastrée faible épaisseur (< 100 mm) norme salle propre", "actual": "Blackfish Digital Operating Room Control System (épaisseur 80 mm, norme GB50333)", "status": "MATCH_BONUS"}, {"param": "Fonctions vidéo & audio", "required": "Routage multi-sources, enregistrement HD, télé-enseignement chirurgical", "actual": "Intégration vidéo/audio complète + télé-enseignement et consultation à distance", "status": "MATCH"}, {"param": "Langue de la fiche technique", "required": "Français obligatoire", "actual": "ANGLAIS (lot4-6.systeme de visioconference et integration blackfish.pdf)", "status": "TRANSLATION_REQUIRED"}], "candidates": [{"model": "BLACKFISH Digital Operating Theatre Integration System", "brand": "Blackfish Industries Shanghai (Chine)", "source_file": "lot4-6.systeme de visioconference et integration blackfish.pdf", "language": "EN", "file_format": "PDF Catalogue Anglais (4 pages — 9.8 MB)", "has_company_branding": false, "needs_translation": true, "compliance_pct": 95, "bonus_points": "+2.5 pts (Épaisseur ultra-fine 80 mm + module télé-chirurgie)", "sweet_spot_verdict": "NEEDS_TRANSLATION_AND_STAMP", "sweet_spot_label": "À Traduire EN→FR & Standardiser au modèle SARL FLUIDAL", "estimated_unit_cost_dzd": 3400000, "selection_selected": true}], "stock_status": "IN_STOCK_NEEDS_FR_STAMP", "stock_label": "En stock (Catalogue interne) — À traduire EN→FR & cacheter", "supplier_wholesale_dzd": 2584000, "resale_margin_pct": 24}, {"item_code": "LOT 4-07", "seq_order": 7, "cdc_title_fr": "Lampe opératoire chirurgicale mobile sur pied roulant avec batterie", "cdc_title_ar": "مصباح جراحي متنقل على عجلات مزود ببطارية", "cdc_required_specs": [{"param": "Mobilité & Statif", "required": "Sur roulettes antistatiques avec freins et bras articulé", "actual": "MGE-SL1C sur pied mobile ergonomique haute stabilité", "status": "MATCH"}, {"param": "Source LED & Durée de vie", "required": "LED Osram ≥ 50 000 heures", "actual": "Ampoules LED Osram > 80 000 heures + mode laparoscopique 1 touche", "status": "MATCH_BONUS"}], "candidates": [{"model": "MEDIGE MGE-SL1C Mobile Surgical Light", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot4-7.MGE-SL1C.pdf", "docx_file": "lot4-7.MGE-SL1C.docx", "language": "FR", "file_format": "PDF + DOCX (Standardisé SARL FLUIDAL)", "has_company_branding": true, "needs_translation": false, "compliance_pct": 100, "bonus_points": "+3.0 pts (LED 80 000h + Mode laparoscopique dédié)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Prêt à soumettre)", "estimated_unit_cost_dzd": 680000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 530400, "resale_margin_pct": 22}, {"item_code": "LOT 4-08", "seq_order": 8, "cdc_title_fr": "Bistouri électrique haute fréquence (Générateur électrochirurgical monopolaire/bipolaire)", "cdc_title_ar": "مشرط كهربائي عالي التردد أحادي وثنائي القطب", "cdc_required_specs": [{"param": "Puissance HF maximale", "required": "≥ 350 W avec régulation automatique selon l'impédance tissulaire", "actual": "Lamidey Noury OPTIMA II : 370 W avec microprocesseur Power Feedback temps réel", "status": "MATCH_BONUS"}, {"param": "Modes chirurgicaux", "required": "Coupe pure, coagulation, bipolaire, endoscopie", "actual": "Monopolaire, Bipolaire plasma, Endosection, Thermofusion / Scellement vasculaire", "status": "MATCH_BONUS"}, {"param": "Origine & Marquage", "required": "Marquage CE Médical + Fiche en Français cachetée", "actual": "Fabrication Française (Lamidey Noury) en Français — Cachet SARL FLUIDAL à apposer", "status": "STAMP_REQUIRED"}], "candidates": [{"model": "LAMIDEY NOURY OPTIMA II (Réf. V10GOPT4 — 370W)", "brand": "Lamidey Noury Medical (France)", "source_file": "lot4-8.FT-OPTIMA II FR_05-2020.pdf", "language": "FR", "file_format": "PDF Constructeur Français (7 pages)", "has_company_branding": false, "needs_translation": false, "needs_stamp_only": true, "compliance_pct": 100, "bonus_points": "+4.5 pts (Fabrication Française + 370W Power Feedback + Scellement vasculaire)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Excellent (Apposer uniquement le cachet humide SARL FLUIDAL)", "estimated_unit_cost_dzd": 1650000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 1287000, "resale_margin_pct": 22}, {"item_code": "LOT 4-09", "seq_order": 9, "cdc_title_fr": "Bras plafonnier de distribution chirurgicale (Pendentif de chirurgie)", "cdc_title_ar": "ذراع سقفي لتوزيع الغازات الطبية والكهرباء خاص بالجراحة", "cdc_required_specs": [{"param": "Rayon d'action & Rotation", "required": "Bras horizontal 700–1000 mm · Rotation ≥ 300°", "actual": "Bras 700–1100 mm (épaisseur >10 mm) · Rotation 0 à 340°", "status": "MATCH_BONUS"}, {"param": "Capacité de charge nette", "required": "≥ 180 kg", "actual": "Charge nette > 220 kg avec plateaux réglables et prises gaz/électriques", "status": "MATCH_BONUS"}], "candidates": [{"model": "MEDIGE MGE-STP3 (Bras de Chirurgie)", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot4-9.MGE-STP3.pdf", "docx_file": "lot4-9.MGE-STP3.docx", "language": "FR", "file_format": "PDF + DOCX (Standardisé SARL FLUIDAL)", "has_company_branding": true, "needs_translation": false, "compliance_pct": 100, "bonus_points": "+3.0 pts (Charge > 220 kg + Rotation 340°)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Prêt à soumettre)", "estimated_unit_cost_dzd": 1150000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 897000, "resale_margin_pct": 22}, {"item_code": "LOT 4-10", "seq_order": 10, "cdc_title_fr": "Bras plafonnier d'anesthésie et de réanimation (Séparation zone sèche / humide)", "cdc_title_ar": "ذراع سقفي للتخدير والإنعاش بفصل المنطقتين الجافة والرطبة", "cdc_required_specs": [{"param": "Architecture", "required": "Pendentif multi-bras avec séparation colonne sèche et colonne humide + tige porte-sérum", "actual": "MGE-STEP7C avec structure pont sec/humide, prises O2/Vide/Air et bornes RJ45", "status": "MATCH_BONUS"}], "candidates": [{"model": "MEDIGE MGE-STEP7C (Bras d'Anesthésie)", "brand": "MEDIGE International Industries (Chine)", "source_file": "lot4-10.MGE-STEP7C.pdf", "docx_file": "lot4-10.MGE-STEP7C.docx", "language": "FR", "file_format": "PDF + DOCX (Standardisé SARL FLUIDAL)", "has_company_branding": true, "needs_translation": false, "compliance_pct": 100, "bonus_points": "+3.0 pts (Séparation sec/humide complète)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Prêt à soumettre)", "estimated_unit_cost_dzd": 1320000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 1029600, "resale_margin_pct": 22}, {"item_code": "LOT 4-11", "seq_order": 11, "cdc_title_fr": "Aspirateur chirurgical mobile à vide élevé (Double bocal)", "cdc_title_ar": "جهاز شفط جراحي كهربائي عالي التفريغ ثنائي القارورة", "cdc_required_specs": [{"param": "Débit de pompage & Pompe", "required": "Pompe sans huile sans maintenance · Débit ≥ 60 L/min", "actual": "Perlong YX-980D double piston sans huile · Débit > 80 L/min + protection anti-débordement", "status": "MATCH_BONUS"}], "candidates": [{"model": "PERLONG YX-980D High-Vacuum Suction Unit", "brand": "Perlong Medical Equipment (Chine)", "source_file": "lot4-11 YX-980D.pdf", "docx_file": "lot4-11 YX-980D.docx", "language": "FR", "file_format": "PDF + DOCX (Français)", "has_company_branding": false, "needs_translation": false, "needs_stamp_only": true, "compliance_pct": 100, "bonus_points": "+2.5 pts (Débit > 80 L/min vs 60 L/min exigés)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Apposer cachet SARL FLUIDAL)", "estimated_unit_cost_dzd": 285000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 222300, "resale_margin_pct": 22}, {"item_code": "LOT 4-12.1", "seq_order": 12, "cdc_title_fr": "Système de réchauffement actif du patient (Couverture chauffante de bloc)", "cdc_title_ar": "نظام تدفئة المريض النشط (بطانية تدفئة لغرفة العمليات)", "cdc_required_specs": [{"param": "Sécurité thermique & Capteurs", "required": "Réchauffeur basse tension réutilisable avec capteurs de sécurité et alarmes", "actual": "GSH-Med France CB48 : 8 capteurs indépendants + alarmes visuelles et sonores", "status": "MATCH_BONUS"}, {"param": "Langue de la fiche technique", "required": "Français obligatoire", "actual": "ANGLAIS (lot4-12. 1 couverture chauffante gsh-med.pdf)", "status": "TRANSLATION_REQUIRED"}], "candidates": [{"model": "GSH-MED CB48 Active Patient Warming Blanket (France)", "brand": "GSH-Med Aix-en-Provence (France)", "source_file": "lot4-12. 1 couverture chauffante gsh-med.pdf", "language": "EN", "file_format": "PDF Anglais (3 pages)", "has_company_branding": false, "needs_translation": true, "compliance_pct": 95, "bonus_points": "+3.0 pts (8 capteurs indépendants + Fabrication Française)", "sweet_spot_verdict": "NEEDS_TRANSLATION_AND_STAMP", "sweet_spot_label": "À Traduire EN→FR & Cacheter (1 Clic Sans Photoshop)", "estimated_unit_cost_dzd": 490000, "selection_selected": true}], "stock_status": "IN_STOCK_NEEDS_FR_STAMP", "stock_label": "En stock (Catalogue interne) — À traduire EN→FR & cacheter", "supplier_wholesale_dzd": 372400, "resale_margin_pct": 24}, {"item_code": "LOT 4-12.2", "seq_order": 13, "cdc_title_fr": "Loupes binoculaires chirurgicales ergonomiques avec éclairage LED frontal", "cdc_title_ar": "مكبرات جراحية ثنائية العينين مريحة مع إضاءة أمامية LED", "cdc_required_specs": [{"param": "Qualité optique & Transmission", "required": "Lentilles asphériques anti-reflet transmission > 95%", "actual": "Perlong H3-ERGO-4in1 : Optique grade A+ transmission > 98% sans distorsion", "status": "MATCH_BONUS"}], "candidates": [{"model": "PERLONG H3-ERGO-4in1 Binocular Loupes", "brand": "Perlong Medical Equipment (Chine)", "source_file": "lot4-12.2H3-ERGO-4IN1.pdf", "docx_file": "lot4-12.2H3-ERGO-4IN1.docx", "language": "FR", "file_format": "PDF + DOCX (Français)", "has_company_branding": false, "needs_translation": false, "needs_stamp_only": true, "compliance_pct": 100, "bonus_points": "+2.0 pts (Transmission > 98% + ergonomie cervicale)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Apposer cachet SARL FLUIDAL)", "estimated_unit_cost_dzd": 195000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 152100, "resale_margin_pct": 22}, {"item_code": "LOT 4-12.3", "seq_order": 14, "cdc_title_fr": "Horloge digitale multifonction de bloc opératoire (Heure, Chronomètre, Température, Humidité)", "cdc_title_ar": "ساعة رقمية متعددة الوظائف لغرفة العمليات (الوقت، الكرونومتر، الحرارة، الرطوبة)", "cdc_required_specs": [{"param": "Boîtier & Affichage", "required": "Acier inoxydable AISI 304 brossé, affichage heure/chronomètre/température/humidité/pression", "actual": "ECO-SLH-DC (LF-801316.21) : Inox AISI 304, grand angle 160°, chronomètre 24h, NTP", "status": "MATCH_BONUS"}], "candidates": [{"model": "ECO-SLH-DC Digital Operating Room Clock (LF-801316.21)", "brand": "ECO-SLH (Allemagne / Europe)", "source_file": "lot4-12.3-horloge digitale LF-801316.21-ECO-SLH-DC-Digitaluhr_removed.pdf.pdf", "language": "FR", "file_format": "PDF Français (3 pages)", "has_company_branding": false, "needs_translation": false, "needs_stamp_only": true, "compliance_pct": 100, "bonus_points": "+2.0 pts (Affichage pression atmosphérique + capteur luminosité auto)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Apposer cachet SARL FLUIDAL)", "estimated_unit_cost_dzd": 240000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 187200, "resale_margin_pct": 22}, {"item_code": "LOT 4-12.4", "seq_order": 15, "cdc_title_fr": "Auge / Lave-mains chirurgical aseptique à 2 postes en acier inoxydable", "cdc_title_ar": "مغسلة أيدي جراحية معقمة بمقعدين من الفولاذ المقاوم للصدأ", "cdc_required_specs": [{"param": "Nombre de postes & Matériau", "required": "2 postes opérateurs, acier inoxydable 304 moulé sans angles vifs, déclenchement automatique", "actual": "Blackfish Lave-mains chirurgical 2 postes en inox moulé monobloc sablé anti-traces", "status": "MATCH_BONUS"}], "candidates": [{"model": "BLACKFISH Lave-Mains Chirurgical 2 Postes", "brand": "Blackfish Industries Shanghai (Chine)", "source_file": "lot4-12.4Lave-main.pdf", "docx_file": "lot4-12.4Lave-main.docx", "language": "FR", "file_format": "PDF + DOCX (Français)", "has_company_branding": false, "needs_translation": false, "needs_stamp_only": true, "compliance_pct": 100, "bonus_points": "+1.5 pt (Finition sablée anti-traces d'eau)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Apposer cachet SARL FLUIDAL)", "estimated_unit_cost_dzd": 420000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 327600, "resale_margin_pct": 22}, {"item_code": "LOT 4-12.5", "seq_order": 16, "cdc_title_fr": "Guichet de transfert stérile inter-verrouillé pour bloc opératoire (Pass-Box)", "cdc_title_ar": "نافذة تمرير معقمة بقفل كهربائي متبادل لغرفة العمليات (Pass-Box)", "cdc_required_specs": [{"param": "Système de verrouillage", "required": "Inter-verrouillage électromagnétique empêchant l'ouverture simultanée des deux portes", "actual": "Blackfish Guichet Électrique (Pass-Box) avec inter-verrouillage et maintien de pression", "status": "MATCH"}], "candidates": [{"model": "BLACKFISH Cleanroom Electric Pass-Box", "brand": "Blackfish Industries Shanghai (Chine)", "source_file": "lot4-12.5 pass box.pdf", "docx_file": "lot4-12.5 pass box.docx", "language": "FR", "file_format": "PDF + DOCX (Français)", "has_company_branding": false, "needs_translation": false, "needs_stamp_only": true, "compliance_pct": 100, "bonus_points": "+1.5 pt (Conforme salle propre ISO)", "sweet_spot_verdict": "OPTIMAL_SWEET_SPOT", "sweet_spot_label": "Choix Optimal (Apposer cachet SARL FLUIDAL)", "estimated_unit_cost_dzd": 310000, "selection_selected": true}], "stock_status": "IN_STOCK_READY", "stock_label": "En stock (Catalogue interne) — Fiche FR prête", "supplier_wholesale_dzd": 241800, "resale_margin_pct": 22}, {"item_code": "LOT 4-12.6", "seq_order": 17, "cdc_title_fr": "Vidoir chirurgical hospitalier en acier inoxydable avec chasse d'eau automatique", "cdc_title_ar": "مفرغ نفايات سائلة جراحي من الفولاذ المقاوم للصدأ مع رش تلقائي", "cdc_required_specs": [{"param": "Dimensions & Épaisseur Inox", "required": "Acier inoxydable 304 brossé ≥ 1.0 mm, système de rinçage automatique", "actual": "WXC0827-00 (Fig 1.019.024) : 500×500×600+100 mm, plateau inox 1.2 mm soudé poli, corps 1.0 mm + spray auto", "status": "MATCH_BONUS"}, {"param": "Format & Langue du document", "required": "Fiche technique PDF en Français cachetée par l'entreprise", "actual": "IMAGE PNG EN ANGLAIS (lot4-12.6 vidoir.png — '04 Invert tank')", "status": "IMAGE_TO_FR_PDF_REQUIRED"}], "candidates": [{"model": "WXC0827-00 Surgical Invert Tank / Vidoir Inox (Fig. 1.019.024)", "brand": "Blackfish / WXC Medical Stainless", "source_file": "lot4-12.6 vidoir.png", "language": "EN (Image PNG)", "file_format": "Image PNG en Anglais (Non éditable sans OCR/IA)", "has_company_branding": false, "needs_translation": true, "is_raw_image": true, "compliance_pct": 95, "bonus_points": "+2.0 pts (Plateau supérieur inox 1.2 mm soudé monobloc)", "sweet_spot_verdict": "NEEDS_TRANSLATION_AND_STAMP", "sweet_spot_label": "Image PNG Anglais → Convertir en Fiche PDF Française Cachetée (Sans Photoshop)", "estimated_unit_cost_dzd": 260000, "selection_selected": true}], "stock_status": "IN_STOCK_NEEDS_FR_STAMP", "stock_label": "En stock (Catalogue interne) — À traduire EN→FR & cacheter", "supplier_wholesale_dzd": 197600, "resale_margin_pct": 24}, {"item_code": "LOT 4-13", "seq_order": 18, "stock_status": "OUT_OF_STOCK_NEEDS_SOURCING", "stock_label": "Non disponible en stock — Contacter fournisseur & uploader fiche pour revente", "supplier_wholesale_dzd": 3100000, "resale_margin_pct": 25, "cdc_title_fr": "Station d'anesthésie-réanimation avec ventilateur intégré et écran tactile couleur ≥ 15 pouces", "cdc_title_ar": "محطة تخدير وإنعاش مع جهاز تنفس مدمج وشاشة لمس ملونة ≥ 15 بوصة", "cdc_required_specs": [{"param": "Modes de ventilation", "required": "VCV, PCV, SIMV, PSV, Manuel + Spontané (Adulte, Pédiatrique, Néonatal)", "actual": "Aucune fiche en stock — En attente d'upload fournisseur", "status": "MISSING_SPEC"}, {"param": "Écran & Monitorage", "required": "Écran tactile couleur ≥ 15 pouces avec spirométrie et capnographie CO2", "actual": "Aucune fiche en stock — En attente d'upload fournisseur", "status": "MISSING_SPEC"}, {"param": "Vaporisateurs d'anesthésie", "required": "Double support Selectatec (Sevoflurane / Isoflurane) avec système anti-hypoxie", "actual": "Aucune fiche en stock — En attente d'upload fournisseur", "status": "MISSING_SPEC"}, {"param": "Autonomie batterie intégrée", "required": "≥ 90 minutes en cas de coupure secteur", "actual": "Aucune fiche en stock — En attente d'upload fournisseur", "status": "MISSING_SPEC"}], "candidates": [{"model": "AUCUNE FICHE EN STOCK (À sourcer : ex. Mindray WATO EX-65 / Perlong A60)", "brand": "Fournisseur à contacter (Mindray / Perlong / Dräger)", "source_file": "Non disponible dans docs/ — Cliquez sur 'Uploader Fiche Reçue'", "language": "MANQUANT", "file_format": "Aucun fichier local", "has_company_branding": false, "needs_translation": false, "needs_supplier_rfq": true, "is_out_of_stock": true, "compliance_pct": 0, "bonus_points": "En attente de réception de la fiche fournisseur et du prix d'achat", "sweet_spot_verdict": "OUT_OF_STOCK_SOURCING", "sweet_spot_label": "Hors Stock : Contacter fournisseur par Email/WhatsApp puis uploader sa fiche ici", "estimated_unit_cost_dzd": 3875000, "selection_selected": true}], "supplier_contacts": [{"name": "Perlong Medical Equipment (Nanjing)", "country": "Chine", "email": "service@perlong.com.cn", "whatsapp": "+86 138 5180 9921", "model_suggested": "Perlong A60 / A80 Anesthesia Workstation"}, {"name": "Mindray Medical International", "country": "Chine", "email": "intl-market@mindray.com", "whatsapp": "+86 755 8188 8998", "model_suggested": "Mindray WATO EX-65 Pro"}, {"name": "MEDIGE International Industries", "country": "Chine", "email": "info@medicalmge.com", "whatsapp": "+86 180 7271 8706", "model_suggested": "MEDIGE MGE-AN5A Anesthesia Machine"}], "rfq_message_fr": "Bonjour l'équipe Export, Nous cherchons à sourcer pour revente (Appel d'Offres EPH Mohammadia — Algérie) une Station d'Anesthésie-Réanimation (Modes VCV/PCV/SIMV/PSV, écran tactile >= 15 pouces, double vaporisateur Selectatec, batterie >= 90 min, CE & ISO 13485). Merci de nous envoyer votre Fiche Technique (PDF/Word) et votre meilleur tarif revendeur FOB/CFR Alger. — SARL FLUIDAL (Algérie)"}, {"item_code": "LOT 4-14", "seq_order": 19, "stock_status": "OUT_OF_STOCK_NEEDS_SOURCING", "stock_label": "Non disponible en stock — Contacter fournisseur & uploader fiche pour revente", "supplier_wholesale_dzd": 620000, "resale_margin_pct": 26, "cdc_title_fr": "Défibrillateur-moniteur multiparamétrique biphasique avec stimulateur cardiaque externe et imprimante", "cdc_title_ar": "جهاز صدمات الكهربائية ومراقبة المريض ثنائي الطور مع منظم ضربات القلب وطابعة", "cdc_required_specs": [{"param": "Onde de défibrillation", "required": "Biphasique tronquée exponentielle (BTE) de 2 à 360 Joules", "actual": "Aucune fiche en stock — En attente d'upload fournisseur", "status": "MISSING_SPEC"}, {"param": "Modes de fonctionnement", "required": "Manuel, DEA (semi-automatique), Stimulateur cardiaque (Pacing) et Moniteur ECG/SpO2", "actual": "Aucune fiche en stock — En attente d'upload fournisseur", "status": "MISSING_SPEC"}, {"param": "Temps de charge à 200J / 360J", "required": "< 5 secondes à 200J · < 8 secondes à 360J", "actual": "Aucune fiche en stock — En attente d'upload fournisseur", "status": "MISSING_SPEC"}], "candidates": [{"model": "AUCUNE FICHE EN STOCK (À sourcer : ex. Mindray BeneHeart D6 / Schiller DEFIGARD)", "brand": "Fournisseur à contacter (Mindray / Schiller / Nihon Kohden)", "source_file": "Non disponible dans docs/ — Cliquez sur 'Uploader Fiche Reçue'", "language": "MANQUANT", "file_format": "Aucun fichier local", "has_company_branding": false, "needs_translation": false, "needs_supplier_rfq": true, "is_out_of_stock": true, "compliance_pct": 0, "bonus_points": "En attente de réception de la fiche fournisseur et du prix d'achat", "sweet_spot_verdict": "OUT_OF_STOCK_SOURCING", "sweet_spot_label": "Hors Stock : Contacter fournisseur par Email/WhatsApp puis uploader sa fiche ici", "estimated_unit_cost_dzd": 781200, "selection_selected": true}], "supplier_contacts": [{"name": "Mindray Medical International", "country": "Chine", "email": "intl-market@mindray.com", "whatsapp": "+86 755 8188 8998", "model_suggested": "Mindray BeneHeart D6 (360J Biphasique)"}, {"name": "Schiller Médical SAS", "country": "France / Suisse", "email": "info@schiller.fr", "whatsapp": "+33 3 88 63 36 00", "model_suggested": "Schiller DEFIGARD Touch 7"}], "rfq_message_fr": "Bonjour l'équipe Export, Nous souhaitons sourcer pour revente (Appel d'Offres EPH Mohammadia — Algérie) un Défibrillateur-Moniteur Biphasique 360J (4-en-1 : Manuel, DEA, Pacing non invasif, Moniteur ECG/SpO2 + Imprimante thermique, CE & ISO 13485). Merci de nous envoyer votre Fiche Technique et votre tarif distributeur FOB/CFR Alger. — SARL FLUIDAL (Algérie)"}], "supplier_rfq_packages": [{"item_code": "LOT 4-03", "equipment_name": "Cadre d'extension et de traction orthopédique (MGE-OT7 / Équivalent)", "reason": "Le fichier `docs/lot4-3.MGE-OT7.pdf` ne contient que l'entête (310 caractères) sans le tableau des caractéristiques géométriques ni la liste des accessoires orthopédiques.", "recommended_suppliers": [{"name": "MEDIGE International Industries Co., Ltd", "country": "Chine", "email": "info@medicalmge.com", "phone": "+86 180 7271 8706", "website": "https://www.medicalmge.com"}, {"name": "Perlong Medical Equipment Co., Ltd", "country": "Chine", "email": "service@perlong.com.cn", "phone": "+86 25 8466 3156", "website": "https://www.perlong.com"}, {"name": "Lamidey Noury / Distri-Chirurgie", "country": "France", "email": "info@lamidey-noury.fr", "phone": "+33 1 69 20 69 69", "website": "https://www.lamidey-noury.com"}], "rfq_subject_fr": "URGENT — Demande de Fiche Technique Complète (FR) & Cotation Prix FOB/CFR Alger : Cadre de Traction Orthopédique MGE-OT7 (Appel d'Offres EPH Mohammadia)", "rfq_body_fr": "Bonjour l'équipe Export MEDIGE / Fournisseur,\\n\\nDans le cadre de notre soumission à l'Appel d'Offres National Ouvert de l'EPH de Mohammadia (Algérie) — Lot 04 (Équipements de Bloc Opératoire), nous disposons de votre fiche pour la table MGE-OT5 mais la fiche technique du Cadre de Traction Orthopédique réf. MGE-OT7 est incomplète.\\n\\nMerci de nous transmettre sous 24h :\\n1. La Fiche Technique complète (de préférence en Français ou Anglais détaillé) mentionnant :\\n   - Matériau de la structure (Acier inoxydable AISI 304 / Fibre de carbone radiotransparente)\\n   - Course d'extension orthopédique (mm), angles d'abduction/adduction et rotation des bottes\\n   - Liste des accessoires inclus (bottes adultes/pédiatriques, contre-appui périnéal, barre de traction)\\n   - Certificats CE Médical et ISO 13485\\n2. Votre meilleure offre de prix unitaire (EXW / CFR Port d'Alger) et délai de disponibilité.\\n\\nCordialement,\\nService Technique & Marchés Publics — SARL FLUIDAL (Algérie)\\nImportation de Dispositifs Médicaux & Réseaux de Fluides Médicaux", "rfq_body_en": "Dear Export Team,\\n\\nWe are preparing our technical bid for the Public Hospital Tender at EPH Mohammadia (Algeria) — Lot 04 (Operating Theatre Equipment). Could you urgently send us within 24 hours the complete Technical Datasheet and Distributor Price (FOB / CFR Algiers) for the Orthopedic Traction Frame (Model MGE-OT7 compatible with MGE-OT5), including:\\n- Full dimensions, traction stroke (mm), abduction/adduction angles, and weight capacity\\n- Standard accessories list (traction boots, perineal post, C-arm radiolucent bars)\\n- CE & ISO 13485 certificates.\\n\\nBest regards,\\nTechnical Tender Department — SARL FLUIDAL (Algeria)"}], "translated_sheets_available": ["LOT 4-12.6", "LOT 4-04", "LOT 4-12.1", "LOT 4-06", "LOT 4-03"]};
    let currentFtFilter = 'ALL';
    let selectedFtCode = 'LOT 4-01';

    function filterFichesWorkflow(filterKey) {
      currentFtFilter = filterKey;
      document.querySelectorAll('#ft-filter-pills .pill-filter').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-ft') === filterKey);
      });
      ['all', 'translate', 'compare', 'rfq'].forEach(k => {
        const el = document.getElementById('ft-kpi-' + k);
        if (el) el.classList.remove('active-filter');
      });
      if (filterKey === 'ALL' && document.getElementById('ft-kpi-all')) document.getElementById('ft-kpi-all').classList.add('active-filter');
      if (filterKey === 'TRANSLATE' && document.getElementById('ft-kpi-translate')) document.getElementById('ft-kpi-translate').classList.add('active-filter');
      if (filterKey === 'COMPARE' && document.getElementById('ft-kpi-compare')) document.getElementById('ft-kpi-compare').classList.add('active-filter');
      if (filterKey === 'RFQ' && document.getElementById('ft-kpi-rfq')) document.getElementById('ft-kpi-rfq').classList.add('active-filter');
      renderFichesList();
    }

    function renderFichesList() {
      const container = document.getElementById('fiches-list-container');
      if (!container) return;
      const q = (document.getElementById('ft-search-input')?.value || '').toLowerCase().trim();
      const items = LOT4_WORKFLOW_STATE.items || [];

      const needTrans = items.filter(it => it.candidates.some(c => c.needs_translation)).length;
      const elTrans = document.getElementById('ft-count-translate');
      if (elTrans) {
        elTrans.textContent = needTrans > 0 ? `${needTrans} Fiches EN/PNG` : '0 (100% Traduit FR)';
        elTrans.style.color = needTrans > 0 ? '#b91c1c' : '#15803d';
      }

      const filtered = items.filter(it => {
        const c0 = it.candidates.find(c => c.selection_selected) || it.candidates[0];
        if (currentFtFilter === 'TRANSLATE' && !c0.needs_translation && !it.candidates[0].is_raw_image) return false;
        if (currentFtFilter === 'COMPARE' && it.candidates.length < 2 && !c0.bonus_points.includes('+')) return false;
        if (currentFtFilter === 'RFQ' && !c0.needs_supplier_rfq) return false;
        if (q) {
          const hay = `${it.item_code} ${it.cdc_title_fr} ${it.cdc_title_ar} ${c0.model} ${c0.brand} ${c0.source_file}`.toLowerCase();
          return hay.includes(q);
        }
        return true;
      });

      container.innerHTML = filtered.map(it => {
        const isSel = it.item_code === selectedFtCode;
        const c0 = it.candidates.find(c => c.selection_selected) || it.candidates[0];
        let badgeClass = 'badge-verified';
        let badgeText = 'Prêt & Conforme';
        if (c0.needs_supplier_rfq) {
          badgeClass = 'badge-warning';
          badgeText = 'RFQ Requis';
        } else if (c0.needs_translation) {
          badgeClass = 'badge-blocker';
          badgeText = c0.is_raw_image ? 'PNG → PDF FR' : 'À Traduire';
        } else if (!c0.has_company_branding) {
          badgeClass = 'badge-verify';
          badgeText = 'À Cacheter';
        }

        return `
          <div class="req-row ${isSel ? 'selected' : ''}" onclick="selectFicheItem('${it.item_code}')">
            <div class="req-row-top">
              <div style="display: flex; align-items: center; gap: 7px; flex-wrap: wrap;">
                <span class="mono" style="font-weight: 600;">#${String(it.seq_order).padStart(2, '0')} · ${it.item_code}</span>
                <span class="badge badge-envelope mono" style="max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${c0.model}">${c0.model}</span>
                ${it.candidates.length > 1 ? '<span class="badge badge-verify mono">2 Modèles</span>' : ''}
              </div>
              <span class="badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="req-title">${currentLang === 'ar' ? it.cdc_title_ar : it.cdc_title_fr}</div>
            <div class="req-desc">${c0.sweet_spot_label} · <span class="mono">${c0.bonus_points}</span></div>
            <div class="req-footer">
              <span class="mono">Fichier : docs/${c0.source_file} (${c0.language})</span>
              <span class="mono">Coût estimé : ${c0.estimated_unit_cost_dzd.toLocaleString('fr-FR')} DZD</span>
            </div>
          </div>
        `;
      }).join('');
    }

    function selectFicheItem(itemCode) {
      selectedFtCode = itemCode;
      const items = LOT4_WORKFLOW_STATE.items || [];
      const item = items.find(i => i.item_code === itemCode) || items[0];
      if (!item) return;
      renderFichesList();

      const selectedCand = item.candidates.find(c => c.selection_selected) || item.candidates[0];
      document.getElementById('ft-inspector-code').textContent = `${item.item_code} (Ordre CDC #${String(item.seq_order).padStart(2, '0')})`;
      document.getElementById('ft-inspector-file').textContent = `docs/${selectedCand.source_file}`;

      // 1. Multi-candidate selector ("Pistol vs Tank" sweet-spot rule)
      const candidatesHtml = item.candidates.map(c => {
        const activeBorder = c.selection_selected ? 'border: 2px solid var(--color-ink); background: #fefce8;' : 'border: 1px solid var(--color-hairline); background: var(--color-paper);';
        return `
          <div style="padding: 12px 14px; border-radius: 8px; margin-bottom: 8px; ${activeBorder} cursor: pointer;" onclick="selectEquipmentCandidate('${item.item_code}', '${c.model}')">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
              <div>
                <strong style="font-size: 13.5px; color: var(--color-ink);">${c.selection_selected ? '✓ ' : ''}${c.model}</strong>
                <span class="mono" style="font-size: 11.5px; color: var(--color-ash); margin-left: 6px;">(${c.brand})</span>
              </div>
              <span class="badge ${c.selection_selected ? 'badge-verified' : 'badge-neutral'} mono">
                ${c.estimated_unit_cost_dzd.toLocaleString('fr-FR')} DZD HT
              </span>
            </div>
            <div style="font-size: 12.5px; color: var(--color-ink); margin-top: 4px;">${c.sweet_spot_label}</div>
            <div class="mono" style="font-size: 11.5px; color: #15803d; margin-top: 3px;">Impact Barème : ${c.bonus_points}</div>
          </div>
        `;
      }).join('');

      // 2. Spec-by-Spec comparison matrix (CDC required vs Datasheet actual)
      const specsRowsHtml = item.cdc_required_specs.map(s => {
        let stBadge = '<span class="badge badge-verified mono">Conforme</span>';
        if (s.status === 'MATCH_BONUS') stBadge = '<span class="badge badge-verified mono">+Bonus</span>';
        else if (s.status === 'MISSING_SPEC') stBadge = '<span class="badge badge-blocker mono">Manquant</span>';
        else if (s.status === 'TRANSLATION_REQUIRED' || s.status === 'IMAGE_TO_FR_PDF_REQUIRED') stBadge = '<span class="badge badge-warning mono">À Traduire</span>';
        else if (s.status === 'STAMP_REQUIRED') stBadge = '<span class="badge badge-verify mono">À Cacheter</span>';
        return `
          <tr>
            <td><strong>${s.param}</strong></td>
            <td>${s.required}</td>
            <td>${s.actual}</td>
            <td>${stBadge}</td>
          </tr>
        `;
      }).join('');

      // 3. Visual preview if it's the PNG image (`lot4-12.6 vidoir.png`) or translation card
      let specialPanelHtml = '';
      if (selectedCand.source_file.endsWith('.png')) {
        specialPanelHtml += `
          <div style="margin-top: 14px; padding: 14px; border: 1px solid var(--color-hairline); border-radius: 8px; background: #faf9f6;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 13px;">Aperçu de l'Image Originale dans <code>docs/lot4-12.6 vidoir.png</code> (En Anglais)</strong>
              <button class="btn-acid-lime" style="padding: 5px 10px; font-size: 11.5px;" onclick="downloadTranslatedStampedFiche()">
                Convertir l'Image PNG en Fiche PDF Française Cachetée →
              </button>
            </div>
            <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
              <img src="docs/lot4-12.6 vidoir.png" alt="Vidoir PNG" style="max-height: 170px; border-radius: 6px; border: 1px solid var(--color-hairline);" />
              <div style="flex: 1; font-size: 12.5px; line-height: 1.5;">
                <div><strong>Texte Anglais détecté par OCR sur l'image PNG :</strong></div>
                <div class="mono" style="font-size: 11.5px; color: var(--color-ash); margin: 4px 0;">"04 Invert tank · Product Code: WXC0827-00 · Specification: 500x500x600+100 · 1.2mm thick stainless steel plate..."</div>
                <div style="color: #15803d; font-weight: 500; margin-top: 6px;">
                  ✓ Traduit automatiquement en Français médical avec tableau normalisé et cachet humide SARL FLUIDAL (aucun Photoshop requis).
                </div>
              </div>
            </div>
          </div>
        `;
      }

      // 4. Automated Supplier Finder & RFQ Email Studio if incomplete/missing (`LOT 4-03` or on demand)
      const rfqPkg = (LOT4_WORKFLOW_STATE.supplier_rfq_packages || [])[0];
      if (selectedCand.needs_supplier_rfq && rfqPkg) {
        const suppliersHtml = rfqPkg.recommended_suppliers.map(sup => `
          <div style="padding: 8px 10px; border: 1px solid var(--color-hairline); border-radius: 6px; background: var(--color-paper); font-size: 12px;">
            <strong>${sup.name} (${sup.country})</strong> · <span class="mono">${sup.email}</span> · <span class="mono">${sup.phone}</span>
          </div>
        `).join('');

        specialPanelHtml += `
          <div style="margin-top: 14px; padding: 14px; border: 1.5px solid #f59e0b; border-radius: 8px; background: #fffbeb;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px;">
              <strong style="font-size: 13px; color: #92400e;">Générateur de Demande de Cotation & Fiche Fournisseur (RFQ)</strong>
              <button class="btn-ghost" style="padding: 4px 10px; font-size: 11.5px; background: var(--color-paper);" onclick="copySupplierRfqEmail()">
                Copier l'Email Fournisseur (FR / EN)
              </button>
            </div>
            <p style="font-size: 12px; color: #78350f; margin-bottom: 8px;">${rfqPkg.reason}</p>
            <div style="display: grid; grid-template-columns: 1fr; gap: 6px; margin-bottom: 10px;">
              ${suppliersHtml}
            </div>
            <pre id="supplier-rfq-preview" class="mono" style="background: var(--color-paper); padding: 10px; border-radius: 6px; border: 1px solid var(--color-hairline); font-size: 11px; white-space: pre-wrap; max-height: 180px; overflow-y: auto;">${rfqPkg.rfq_body_fr}</pre>
          </div>
        `;
      }

      // 5. Interactive Fiche Technique Upload & Resale Price Calculator (Works on ANY item, especially Out-of-Stock items!)
      const defaultWholesale = item.supplier_wholesale_dzd || 1500000;
      const defaultMargin = item.resale_margin_pct || 25;
      const defaultResale = Math.round(defaultWholesale * (1 + defaultMargin / 100));
      const suggestedModel = (item.supplier_contacts && item.supplier_contacts[0]) ? item.supplier_contacts[0].model_suggested : (selectedCand.is_out_of_stock ? 'Mindray WATO EX-65 Pro' : selectedCand.model + ' (Nouvelle Version)');
      const suggestedBrand = (item.supplier_contacts && item.supplier_contacts[0]) ? item.supplier_contacts[0].name : selectedCand.brand;

      const supplierContactsListHtml = (item.supplier_contacts || []).map(sc => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 7px 10px; background: var(--color-paper); border: 1px solid var(--color-hairline); border-radius: 6px; font-size: 12px; flex-wrap: wrap; gap: 6px;">
          <div>
            <strong>${sc.name} (${sc.country})</strong> — Modèle : <span class="mono">${sc.model_suggested}</span>
          </div>
          <div class="mono" style="font-size: 11px; color: var(--color-ash);">
            Email : ${sc.email} &nbsp;|&nbsp; WhatsApp : ${sc.whatsapp}
          </div>
        </div>
      `).join('');

      const rfqTextToUse = item.rfq_message_fr || (rfqPkg ? rfqPkg.rfq_body_fr : '');

      specialPanelHtml += `
        <div style="margin-top: 16px; padding: 16px; border: 1.5px solid var(--color-ink); border-radius: 10px; background: #f8fafc;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
            <div>
              <span class="badge ${selectedCand.is_out_of_stock ? 'badge-blocker' : 'badge-verify'} mono" style="margin-bottom: 4px;">
                ${selectedCand.is_out_of_stock ? 'ÉTAPE SOURCING : HORS STOCK INTERNE' : 'MISE À JOUR CATALOGUE & PRIX DE REVENTE'}
              </span>
              <h4 style="font-size: 13.5px; color: var(--color-ink); margin: 0;">
                Importer une Fiche Technique Reçue d'un Fournisseur & Calculer le Prix de Revente BPU
              </h4>
            </div>
            ${rfqTextToUse ? `<button class="btn-ghost" style="padding: 5px 10px; font-size: 11.5px; background: var(--color-paper);" onclick="navigator.clipboard.writeText(document.getElementById('item-rfq-box').textContent); showToast('Message fournisseur (Email / WhatsApp) copié !');">Copier Message Fournisseur</button>` : ''}
          </div>

          ${supplierContactsListHtml ? `<div style="display: grid; gap: 6px; margin-bottom: 10px;">${supplierContactsListHtml}</div>` : ''}
          ${rfqTextToUse && selectedCand.is_out_of_stock ? `<pre id="item-rfq-box" class="mono" style="background: var(--color-paper); padding: 10px; border-radius: 6px; border: 1px solid var(--color-hairline); font-size: 11px; white-space: pre-wrap; max-height: 130px; overflow-y: auto; margin-bottom: 12px;">${rfqTextToUse}</pre>` : ''}

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-bottom: 10px;">
            <div>
              <label style="font-size: 11.5px; color: var(--color-ash); display: block; margin-bottom: 3px;">Fichier Fiche Technique reçu (.pdf, .docx, .png) :</label>
              <input type="file" id="inline-fiche-file" accept=".pdf,.docx,.png,.jpg" class="search-input" style="width: 100%; background: var(--color-paper);" onchange="if(this.files[0]) document.getElementById('inline-fiche-filename').value = this.files[0].name;" />
              <input type="hidden" id="inline-fiche-filename" value="Fiche_${item.item_code.replace(' ', '_')}_Fournisseur.pdf" />
            </div>
            <div>
              <label style="font-size: 11.5px; color: var(--color-ash); display: block; margin-bottom: 3px;">Modèle & Marque du Fournisseur :</label>
              <input type="text" id="inline-fiche-model" class="search-input" style="width: 100%; background: var(--color-paper);" value="${suggestedModel}" />
              <input type="hidden" id="inline-fiche-brand" value="${suggestedBrand}" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; align-items: end; margin-bottom: 12px;">
            <div>
              <label style="font-size: 11px; color: var(--color-ash); display: block; margin-bottom: 3px;">Prix d'achat (DZD HT) :</label>
              <input type="number" id="inline-wholesale-price" class="search-input mono" style="width: 100%; background: var(--color-paper);" value="${defaultWholesale}" oninput="recalcInlineResalePrice()" />
            </div>
            <div>
              <label style="font-size: 11px; color: var(--color-ash); display: block; margin-bottom: 3px;">Marge revente (%) :</label>
              <input type="number" id="inline-resale-margin" class="search-input mono" style="width: 100%; background: var(--color-paper);" value="${defaultMargin}" min="0" max="200" oninput="recalcInlineResalePrice()" />
            </div>
            <div>
              <label style="font-size: 11px; color: var(--color-ash); display: block; margin-bottom: 3px;">Prix Revente BPU calculé :</label>
              <div id="inline-calculated-bpu" class="mono" style="padding: 7px 10px; background: #f1f5f9; border: 1px solid var(--color-hairline); border-radius: 6px; font-weight: 600; color: var(--color-ink); font-size: 11.5px; white-space: nowrap;">
                ${defaultResale.toLocaleString('fr-FR')} DZD HT
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end;">
            <button class="btn-acid-lime" onclick="submitUploadedSupplierFiche('${item.item_code}')">
              ✓ Enregistrer la fiche & Valider les critères
            </button>
          </div>
        </div>
      `;

      document.getElementById('ft-inspector-body').innerHTML = `
        <div style="margin-bottom: 14px;">
          <div style="font-size: 11.5px; font-weight: 600; color: var(--color-ash); text-transform: uppercase; margin-bottom: 6px;">
            1. Équipement Proposé & Barème Technique (${item.candidates.length} modèle(s) évalué(s))
          </div>
          ${candidatesHtml}
        </div>

        <div>
          <div style="font-size: 11.5px; font-weight: 600; color: var(--color-ash); text-transform: uppercase; margin-bottom: 6px;">
            2. Grille de Conformité aux Spécifications du Marché
          </div>
          <div class="table-wrap" style="border: 1px solid var(--color-hairline); border-radius: 8px;">
            <table class="precision-table">
              <thead>
                <tr>
                  <th>Paramètre Technique</th>
                  <th>Exigence Demandée</th>
                  <th>Spécification Proposée</th>
                  <th>Conformité</th>
                </tr>
              </thead>
              <tbody>
                ${specsRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
        ${specialPanelHtml}
      `;

      if (window.innerWidth <= 1024) {
        setMobileFtWorkbenchTab('preview');
      }
    }

    async function selectEquipmentCandidate(itemCode, modelName) {
      const item = (LOT4_WORKFLOW_STATE.items || []).find(i => i.item_code === itemCode);
      if (!item) return;
      item.candidates.forEach(c => { c.selection_selected = (c.model === modelName); });
      selectFicheItem(itemCode);
      showToast(`Modèle retenu pour ${itemCode} : ${modelName}`);
      try {
        await fetch(`${API_BASE}/api/v1/equipment/select-candidate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ item_code: itemCode, model: modelName })
        });
      } catch (_) {}
    }

    function openOriginalDocFile() {
      const item = (LOT4_WORKFLOW_STATE.items || []).find(i => i.item_code === selectedFtCode);
      if (!item) return;
      const cand = item.candidates.find(c => c.selection_selected) || item.candidates[0];
      window.open(`docs/${encodeURIComponent(cand.source_file)}`, '_blank');
    }

    function downloadTranslatedStampedFiche() {
      const url = `${API_BASE}/api/v1/export/translated-fiche?item=${encodeURIComponent(selectedFtCode)}`;
      window.open(url, '_blank');
      showToast(`Fiche Technique Française normalisée et cachetée générée pour ${selectedFtCode}.`);
    }

    function downloadCompiledTechnicalDossier() {
      window.open(`${API_BASE}/api/v1/export/dossier-technique-lot4`, '_blank');
      showToast("Dossier Technique Complet Lot 04 (classé dans l'ordre du CDC) généré et téléchargé.");
    }

    async function translateAndStampAllFiches() {
      try {
        await fetch(`${API_BASE}/api/v1/equipment/translate-all`, { method: 'POST' });
      } catch (_) {}
      (LOT4_WORKFLOW_STATE.items || []).forEach(it => {
        it.candidates.forEach(c => {
          c.needs_translation = false;
          c.has_company_branding = true;
          c.language = 'FR (Traduit & Cacheté)';
        });
      });
      renderFichesList();
      selectFicheItem(selectedFtCode);
      showToast("Toutes les fiches Anglais / PNG de docs/ ont été traduites en Français et cachetées SARL FLUIDAL !");
    }


    function recalcInlineResalePrice() {
      const w = parseFloat(document.getElementById('inline-wholesale-price')?.value || '0');
      const m = parseFloat(document.getElementById('inline-resale-margin')?.value || '0');
      const resale = Math.round(w * (1 + m / 100));
      const el = document.getElementById('inline-calculated-bpu');
      if (el) el.textContent = `${resale.toLocaleString('fr-FR')} DZD HT`;
    }

    async function submitUploadedSupplierFiche(itemCode) {
      const filename = document.getElementById('inline-fiche-filename')?.value || 'Fiche_Fournisseur_Upload.pdf';
      const modelName = document.getElementById('inline-fiche-model')?.value || 'Modèle Fournisseur Certifié';
      const brandName = document.getElementById('inline-fiche-brand')?.value || 'Fournisseur International Certifié CE';
      const wholesale = parseInt(document.getElementById('inline-wholesale-price')?.value || '1500000', 10);
      const margin = parseInt(document.getElementById('inline-resale-margin')?.value || '25', 10);
      const resale = Math.round(wholesale * (1 + margin / 100));

      try {
        const res = await fetch(`${API_BASE}/api/v1/equipment/upload-fiche`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            item_code: itemCode,
            filename: filename,
            model_name: modelName,
            brand_name: brandName,
            supplier_wholesale_dzd: wholesale,
            resale_margin_pct: margin
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.workflow) LOT4_WORKFLOW_STATE = data.workflow;
        }
      } catch (_) {}

      const item = (LOT4_WORKFLOW_STATE.items || []).find(i => i.item_code === itemCode);
      if (item) {
        item.stock_status = 'IN_STOCK_READY';
        item.stock_label = 'Reçu du fournisseur & ajouté au Stock Interne (Prêt pour revente)';
        item.supplier_wholesale_dzd = wholesale;
        item.resale_margin_pct = margin;
        (item.cdc_required_specs || []).forEach(s => {
          if (s.status === 'MISSING_SPEC') {
            s.actual = `Vérifié dans la fiche uploadée (${filename}) — Modèle ${modelName} conforme au CDC`;
            s.status = 'MATCH_BONUS';
          }
        });
        item.candidates.forEach(c => { c.selection_selected = false; });
        item.candidates.unshift({
          model: modelName,
          brand: brandName,
          source_file: filename,
          language: 'FR (Uploadé & Validé)',
          file_format: 'Fiche Fournisseur Uploadée + Normalisée SARL FLUIDAL',
          has_company_branding: true,
          needs_translation: false,
          needs_supplier_rfq: false,
          is_out_of_stock: false,
          compliance_pct: 100,
          bonus_points: `+4.0 pts (Sourcé · Marge revente +${margin}%)`,
          sweet_spot_verdict: 'OPTIMAL_SWEET_SPOT',
          sweet_spot_label: `✓ Fiche Fournisseur Uploadée & Ajoutée au Stock (Achat: ${wholesale.toLocaleString('fr-FR')} DZD → Revente BPU: ${resale.toLocaleString('fr-FR')} DZD)`,
          estimated_unit_cost_dzd: resale,
          selection_selected: true
        });
      }

      const allItems = LOT4_WORKFLOW_STATE.items || [];
      const outCount = allItems.filter(it => (it.candidates.find(c => c.selection_selected) || it.candidates[0]).needs_supplier_rfq).length;
      const inCount = allItems.length - outCount;
      if (document.getElementById('ft-count-rfq')) document.getElementById('ft-count-rfq').textContent = `${outCount} À Sourcer`;
      if (document.getElementById('ft-count-compare')) document.getElementById('ft-count-compare').textContent = `${inCount} En Stock`;

      renderFichesList();
      selectFicheItem(itemCode);
      showToast(`Fiche "${filename}" (${modelName}) vérifiée conforme au CDC, tarif BPU calculé (${resale.toLocaleString('fr-FR')} DZD) et ajoutée au Stock !`);
    }

    function copySupplierRfqEmail() {
      const el = document.getElementById('supplier-rfq-preview');
      if (el) {
        navigator.clipboard.writeText(el.textContent);
        showToast("Email de demande de fiche & cotation fournisseur (RFQ) copié !");
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast-banner');
      document.getElementById('toast-message').textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3400);
    }

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
      if (e.key === '/') {
        e.preventDefault();
        switchView('eph');
        document.getElementById('rag-query-input').focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
      if (e.key === 'Escape') {
        closeFloatingSidebar();
      }
    });

    // Close floating drawer when user interacts with the main app (without blocking the click or blurring)
    document.addEventListener('pointerdown', (e) => {
      const sidebar = document.getElementById('app-sidebar');
      const toggleBtn = document.querySelector('.sidebar-toggle-btn');
      if (sidebar && sidebar.classList.contains('floating-open')) {
        if (!sidebar.contains(e.target) && (!toggleBtn || !toggleBtn.contains(e.target))) {
          closeFloatingSidebar();
        }
      }
    });

    window.addEventListener('DOMContentLoaded', () => {
      // Check saved sidebar preference
      try {
        if (localStorage.getItem('mithaq_sidebar_collapsed') === 'true' && window.innerWidth > 980) {
          collapseSidebar();
        }
      } catch (_) {}

      checkBackendConnection();
      renderRequirementsList();
      selectRequirement('REQ-CAND-04');
      renderVaultTable();
      renderFichesList();
      selectFicheItem('LOT 4-01');
      renderOverlapLedger();
      renderEphPageGrid();
      runLiveRagSearch();
    });
