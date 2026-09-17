import { useEffect, useRef, useState } from 'react';
import {
  emptyApplicationData,
  deriveTipoFinanciamiento,
  validateApplication,
  hasErrors,
  stepForField,
  STEP_FIELDS,
  type ApplicationData,
  type FieldName,
  type ServicioFinanciero,
  type ValidationErrors,
} from '../../lib/application';
import { loadDraft, saveDraft, clearDraft, hasAnyValue } from '../../lib/draftStorage';
import { submitApplication } from '../../lib/submitApplication';
import { getRecaptchaToken, loadRecaptcha } from '../../lib/recaptcha';
import { RECAPTCHA_SITE_KEY } from '../../config/site';
import type { Lang } from '../../i18n/types';

export type FormScreen = 'resume' | 'form' | 'success';

export function useApplicationForm(isOpen: boolean, lang: Lang, initial?: Partial<ApplicationData>) {
  const [screen, setScreen] = useState<FormScreen>('form');
  const [step, setStep] = useState(0);
  const [data, setData] = useState<ApplicationData>(() => ({ ...emptyApplicationData(), ...initial }));
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [result, setResult] = useState<{ id: string; nombre: string } | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const draftCheckedRef = useRef(false);
  const initialAppliedRef = useRef(false);

  useEffect(() => {
    if (!isOpen || draftCheckedRef.current) return;
    draftCheckedRef.current = true;
    const draft = loadDraft();
    if (draft && hasAnyValue(draft.data)) {
      setScreen('resume');
    } else if (initial && !initialAppliedRef.current) {
      initialAppliedRef.current = true;
      setData((d) => ({ ...d, ...initial }));
    }
  }, [isOpen, initial]);

  useEffect(() => {
    if (isOpen && RECAPTCHA_SITE_KEY) {
      loadRecaptcha(RECAPTCHA_SITE_KEY).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (screen !== 'form') return;
    if (!hasAnyValue(data)) return;
    saveDraft({ data, step, savedAt: Date.now() });
  }, [data, step, screen]);

  function setField<K extends FieldName>(field: K, value: ApplicationData[K]) {
    setData((d) => {
      const next = { ...d, [field]: value };
      if (field === 'servicio_financiero') {
        next.tipo_financiamiento = deriveTipoFinanciamiento(value as ServicioFinanciero | '') || '';
      }
      return next;
    });
    setErrors((e) => {
      if (!e[field]) return e;
      const next = { ...e };
      delete next[field];
      return next;
    });
  }

  function validateStep(stepIndex: number): boolean {
    const fields = STEP_FIELDS[stepIndex];
    const allErrors = validateApplication(data);
    const stepErrors: ValidationErrors = {};
    for (const f of fields) {
      if (allErrors[f]) stepErrors[f] = allErrors[f];
    }
    setErrors((e) => ({ ...e, ...stepErrors }));
    return Object.keys(stepErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEP_FIELDS.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function resumeContinue() {
    const draft = loadDraft();
    if (draft) {
      setData((d) => ({ ...d, ...draft.data }));
      setStep(draft.step ?? 0);
    }
    setScreen('form');
  }

  function resumeStartOver() {
    clearDraft();
    setData({ ...emptyApplicationData(), ...initial });
    setStep(0);
    setScreen('form');
  }

  async function handleSubmit() {
    const allErrors = validateApplication(data);
    if (hasErrors(allErrors)) {
      setErrors(allErrors);
      const firstField = Object.keys(allErrors)[0] as FieldName;
      const targetStep = stepForField(firstField);
      if (targetStep >= 0) setStep(targetStep);
      return;
    }

    setSubmitting(true);
    setNetworkError(false);
    try {
      const token = await getRecaptchaToken(RECAPTCHA_SITE_KEY);
      const res = await submitApplication(data, lang, token, honeypot);

      if (res.ok) {
        clearDraft();
        setResult({ id: res.id, nombre: res.nombre });
        setScreen('success');
      } else if (res.error === 'validation') {
        setErrors(res.fields as ValidationErrors);
        const firstField = Object.keys(res.fields)[0] as FieldName | undefined;
        if (firstField) {
          const targetStep = stepForField(firstField);
          if (targetStep >= 0) setStep(targetStep);
        }
      } else {
        setNetworkError(true);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return {
    screen,
    step,
    totalSteps: STEP_FIELDS.length,
    data,
    errors,
    submitting,
    networkError,
    result,
    honeypot,
    setHoneypot,
    setField,
    goNext,
    goBack,
    resumeContinue,
    resumeStartOver,
    handleSubmit,
    retrySubmit: handleSubmit,
  };
}
