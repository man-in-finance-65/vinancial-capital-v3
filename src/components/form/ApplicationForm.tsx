import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLang, interpolate, errorText } from '../../i18n';
import type { ApplicationData } from '../../lib/application';
import { hasAnyValue } from '../../lib/draftStorage';
import { SITE } from '../../config/site';
import { useApplicationForm } from './useApplicationForm';
import { Step1Intro } from './steps/Step1Intro';
import { Step2Service } from './steps/Step2Service';
import { Step3Plan } from './steps/Step3Plan';
import { Step4Business } from './steps/Step4Business';
import { Step5MoreQuestions } from './steps/Step5MoreQuestions';
import { Step6Contact } from './steps/Step6Contact';
import { SuccessScreen } from './SuccessScreen';
import { Button } from '../ui/Button';

export function ApplicationForm({
  isOpen,
  onClose,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  initial?: Partial<ApplicationData>;
}) {
  const { dict, lang } = useLang();
  const form = useApplicationForm(isOpen, lang, initial);
  const [confirmClose, setConfirmClose] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  function requestClose() {
    if (hasAnyValue(form.data)) {
      setConfirmClose(true);
    } else {
      onClose();
    }
  }

  const stepBody = (() => {
    switch (form.step) {
      case 0:
        return <Step1Intro onNext={form.goNext} />;
      case 1:
        return <Step2Service data={form.data} setField={form.setField} error={errorText(dict, form.errors.servicio_financiero)} />;
      case 2:
        return <Step3Plan data={form.data} setField={form.setField} errors={form.errors} />;
      case 3:
        return <Step4Business data={form.data} setField={form.setField} errors={form.errors} />;
      case 4:
        return <Step5MoreQuestions data={form.data} setField={form.setField} />;
      case 5:
        return (
          <Step6Contact
            data={form.data}
            setField={form.setField}
            errors={form.errors}
            honeypot={form.honeypot}
            setHoneypot={form.setHoneypot}
          />
        );
      default:
        return null;
    }
  })();

  const isFirstStep = form.step === 0;
  const isLastStep = form.step === form.totalSteps - 1;

  return (
    <div className="fixed inset-0 z-[60] animate-fade-rise bg-ink" role="dialog" aria-modal="true">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4 md:px-10">
          {form.screen === 'form' && !isFirstStep ? (
            <div className="flex-1 pr-6">
              <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-sky transition-all duration-300"
                  style={{ width: `${(form.step / (form.totalSteps - 1)) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted">{interpolate(dict.form.progress, { current: form.step + 1, total: form.totalSteps })}</p>
            </div>
          ) : (
            <div className="flex-1" />
          )}
          <button
            type="button"
            onClick={requestClose}
            aria-label={dict.nav.menuClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X size={22} />
          </button>
        </div>

        <div className="vc-scrollbar flex-1 overflow-y-auto px-6 py-8 md:px-10 md:py-12">
          <div className="mx-auto flex h-full max-w-xl flex-col">
            {form.screen === 'resume' && (
              <div className="flex flex-1 flex-col justify-center">
                <h2 className="font-slab text-3xl font-semibold text-foreground">{dict.form.resumeTitle}</h2>
                <p className="mt-3 text-base text-muted">{dict.form.resumeBody}</p>
                <div className="mt-8 flex gap-3">
                  <Button variant="primary" onClick={form.resumeContinue}>
                    {dict.form.resumeContinue}
                  </Button>
                  <Button variant="secondary" onClick={form.resumeStartOver}>
                    {dict.form.resumeStartOver}
                  </Button>
                </div>
              </div>
            )}

            {form.screen === 'form' && stepBody}

            {form.screen === 'success' && form.result && (
              <SuccessScreen nombre={form.result.nombre} id={form.result.id} onBackToSite={onClose} />
            )}
          </div>
        </div>

        {form.screen === 'form' && (
          <div className="border-t border-border px-6 py-5 md:px-10">
            <div className="mx-auto flex max-w-xl items-center justify-between">
              {!isFirstStep ? (
                <button type="button" onClick={form.goBack} className="text-sm font-semibold uppercase tracking-[0.14em] text-muted hover:text-foreground">
                  {dict.form.back}
                </button>
              ) : (
                <span />
              )}
              {!isFirstStep &&
                (isLastStep ? (
                  <div className="flex flex-col items-end gap-2">
                    {form.networkError && (
                      <div className="flex flex-col items-end gap-2 text-right">
                        <p className="max-w-xs text-sm text-destructive">{dict.form.networkError.title}</p>
                        <div className="flex gap-2">
                          <Button as="a" href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                            {dict.form.networkError.whatsapp}
                          </Button>
                          <Button variant="primary" disabled={form.submitting} onClick={form.retrySubmit}>
                            {dict.form.networkError.retry}
                          </Button>
                        </div>
                      </div>
                    )}
                    {!form.networkError && (
                      <Button variant="primary" icon disabled={form.submitting} onClick={form.handleSubmit}>
                        {form.submitting ? dict.form.step6.sendingButton : dict.form.step6.sendButton}
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button variant="primary" icon onClick={form.goNext}>
                    {dict.form.next}
                  </Button>
                ))}
            </div>
          </div>
        )}
      </div>

      {confirmClose && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 px-6" role="alertdialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-card border border-border bg-surface p-6">
            <p className="text-base text-foreground">{dict.form.closeConfirm}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmClose(false)} className="text-sm text-muted hover:text-foreground">
                {dict.form.closeConfirmStay}
              </button>
              <Button
                variant="primary"
                onClick={() => {
                  setConfirmClose(false);
                  onClose();
                }}
              >
                {dict.form.closeConfirmLeave}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
