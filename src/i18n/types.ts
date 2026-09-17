export type Lang = 'es' | 'en' | 'fr';

export type QA = { q: string; a: string };

export type Dict = {
  meta: {
    home: { title: string; description: string };
    calculator: { title: string; description: string };
    about: { title: string; description: string };
  };
  nav: {
    home: string;
    calculator: string;
    about: string;
    apply: string;
    menuOpen: string;
    menuClose: string;
  };
  footer: {
    positioning: string;
    linksHeading: string;
    disclaimer: string;
    founderPrefix: string;
    founderTitle: string;
    rights: string;
  };
  hero: {
    industries: {
      construction: { eyebrow: string; h1Plain: string; h1Sky: string };
      trucking: { eyebrow: string; h1Plain: string; h1Sky: string };
      restaurant: { eyebrow: string; h1Plain: string; h1Sky: string };
    };
    subtext: string;
    ctaApply: string;
    ctaSeePayment: string;
    pickerLabel: string;
    pickerConstruction: string;
    pickerTrucking: string;
    pickerRestaurant: string;
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    steps: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
  };
  whyUs: {
    eyebrow: string;
    heading: string;
    points: [
      { title: string; body: string },
      { title: string; body: string },
      { title: string; body: string },
    ];
  };
  industriesSection: {
    eyebrow: string;
    heading: string;
    construction: { title: string; body: string };
    trucking: { title: string; body: string };
    restaurant: { title: string; body: string };
    other: string;
    otherLink: string;
  };
  calculatorPreview: {
    eyebrow: string;
    heading: string;
    priceLabel: string;
    downPaymentLabel: string;
    aprLabel: string;
    termLabel: string;
    monthlyPaymentLabel: string;
    applyWithAmount: string;
    openFullCalculator: string;
    currencyNoteCAD: string;
    currencyNoteUSD: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: QA[];
    feesQuestion: string;
    feesAnswer: string;
  };
  about: {
    heading: string;
    subheading: string;
    paragraphs: string[];
    coreBeliefHeading: string;
    coreBelief: string;
    applyCta: string;
    founderPhotoAlt: string;
  };
  calculatorPage: {
    heading: string;
    subheading: string;
    tabs: { lease: string; loan: string; afford: string };
    disclaimer: string;
    applyWithAmount: string;
    currencyNoteCAD: string;
    currencyNoteUSD: string;
    downPaymentDollar: string;
    downPaymentPercent: string;
    aprLabel: string;
    termMonthsLabel: string;
    keyStats: {
      downPaymentPercent: string;
      apr: string;
      termYears: string;
      residualPercent: string;
      rate: string;
    };
    lease: {
      equipmentPriceLabel: string;
      advancePaymentsLabel: string;
      advanceOptions: { none: string; first: string; firstLast: string };
      endOfLeaseLabel: string;
      endOfLeaseOptions: { buyout10: string; residualPercent: string; residualDollar: string };
      residualValueLabel: string;
      monthlyPaymentLabel: string;
      dueAtSigningLabel: string;
      totalDepreciationLabel: string;
      totalInterestLabel: string;
      totalLeaseCostLabel: string;
      allInCostLabel: string;
      scheduleToggle: string;
      scheduleHeaders: { number: string; type: string; payment: string; interest: string; principal: string; balance: string };
      rowTypes: { LEASE: string; ADVANCE: string; REGULAR: string; BUYOUT: string };
    };
    loan: {
      equipmentPriceLabel: string;
      monthlyPaymentLabel: string;
      totalInterestLabel: string;
      totalLoanCostLabel: string;
      totalPaidLabel: string;
    };
    afford: {
      desiredPaymentLabel: string;
      downPaymentLabel: string;
      maxFinancedLabel: string;
      yourDownPaymentLabel: string;
      totalBudgetLabel: string;
    };
    faqItems: QA[];
  };
  form: {
    progress: string;
    closeConfirm: string;
    closeConfirmLeave: string;
    closeConfirmStay: string;
    resumeTitle: string;
    resumeBody: string;
    resumeContinue: string;
    resumeStartOver: string;
    back: string;
    next: string;
    step1: { title: string; body: string; timeNote: string; cta: string };
    step2: {
      prompt: string;
      options: {
        prestamo_equipo: { label: string; sub: string };
        venta_retroarriendo: { label: string; sub: string };
        financiamiento_reparaciones: { label: string; sub: string };
        factoraje: { label: string; sub: string };
        capital_negocio: { label: string; sub: string };
        financiamiento_activos: { label: string; sub: string };
        comercio_internacional: { label: string; sub: string };
        no_seguro: { label: string; sub: string };
      };
    };
    step3: {
      situacionLabel: string;
      situacionPlaceholder: string;
      montoLabel: string;
      montoPlaceholder: string;
      urgenciaLabel: string;
      urgenciaOptions: { esta_semana: string; '2_4_semanas': string; '1_3_meses': string; explorando: string };
    };
    step4: {
      empresaLabel: string;
      provinciaLabel: string;
      industriaLabel: string;
      sitioWebLabel: string;
      sitioWebPlaceholder: string;
      tipoNegocioLabel: string;
      tipoNegocioOptions: { propietario_unico: string; sociedad: string; corporacion: string; llc: string };
      tiempoOperandoLabel: string;
      tiempoOperandoPlaceholder: string;
      ingresosLabel: string;
      ingresosSubLabel: string;
      ingresosPlaceholder: string;
    };
    step5: {
      viviendaLabel: string;
      viviendaOptions: { propietario: string; rentando: string; comprando: string };
      codeudorLabel: string;
      codeudorSub: string;
      codeudorOptions: { si: string; no: string; tal_vez: string };
      puntajeLabel: string;
      puntajeOptions: {
        '700_mas': string;
        '650_700': string;
        '600_650': string;
        '550_600': string;
        menos_550: string;
        no_seguro: string;
      };
      historialLabel: string;
      historialSub: string;
      historialOptions: { no: string; si_descargada: string; si_activa: string };
    };
    step6: {
      nombreLabel: string;
      apellidoLabel: string;
      correoLabel: string;
      telefonoLabel: string;
      consentimientoText: string;
      dataNotice: string;
      privacyLinkText: string;
      sendButton: string;
      sendingButton: string;
    };
    errors: {
      required: string;
      invalid_email: string;
      invalid_value: string;
      too_long: string;
    };
    networkError: { title: string; retry: string; whatsapp: string };
    success: {
      greeting: string;
      referenceLabel: string;
      whatHappensNextHeading: string;
      whatHappensNext: [string, string, string];
      papersHeading: string;
      papers: [string, string, string, string, string];
      whatsappMessage: string;
      whatsappButton: string;
      callButton: string;
      backToSite: string;
    };
  };
  common: {
    apply: string;
    disclaimer: string;
  };
  privacy: {
    metaTitle: string;
    metaDescription: string;
    heading: string;
    intro: string;
    sections: [
      { heading: string; body: string },
      { heading: string; body: string },
      { heading: string; body: string },
      { heading: string; body: string },
      { heading: string; body: string },
      { heading: string; body: string },
      { heading: string; body: string },
    ];
  };
};
