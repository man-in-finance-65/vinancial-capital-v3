// Single source of truth for contact details, URLs and keys.
// Fill in the TODO values before going live (see README).

export const SITE = {
  name: 'Vinancial Capital',
  email: 'support@vinancialcapital.com',
  phoneDisplay: '+1 (437) 429-6575',
  phoneE164: '+14374296575',
  whatsappUrl: 'https://wa.me/14374296575',
  telUrl: 'tel:+14374296575',
  address: '70 Temperance St., Toronto, Canada',
  locationsLine: 'Toronto, ON · Miami, FL',
  founder: {
    name: 'Vicente E. Correa E.',
    title: 'Private Capital Broker',
    linkedInUrl: 'https://www.linkedin.com/in/vicente-emilio-correa-echenagucia-37983822b/',
  },
} as const;

// TODO: replace with the live Google Apps Script Web App URL (deploy as "Execute as: Me", "Who has access: Anyone").
export const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/TODO_REPLACE_WITH_DEPLOYMENT_ID/exec';

// TODO: replace with the live privacy policy URL once it exists.
export const PRIVACY_URL = '/privacy';

// Shown next to the form's consent checkbox. Kept separate so it can be updated without touching layout code.
export const CONSENT_COMPANY_NAME = 'Mehmi Financial Group';

export const LOCAL_STORAGE_DRAFT_KEY = 'vc_application_draft_v1';
