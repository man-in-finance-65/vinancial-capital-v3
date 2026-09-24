import { useLang, errorText, interpolate } from '../../../i18n';
import { useCurrency } from '../../../context/AppProviders';
import { MAX_LENGTHS, type ApplicationData, type FieldName } from '../../../lib/application';
import { CONSENT_COMPANY_NAME, PRIVACY_URL } from '../../../config/site';
import { FieldWrap, TextInput } from '../../ui/Field';
import { PhoneInput } from '../PhoneInput';

export function Step6Contact({
  data,
  setField,
  errors,
  honeypot,
  setHoneypot,
}: {
  data: ApplicationData;
  setField: <K extends FieldName>(field: K, value: ApplicationData[K]) => void;
  errors: Partial<Record<FieldName, string>>;
  honeypot: string;
  setHoneypot: (value: string) => void;
}) {
  const { dict } = useLang();
  const currency = useCurrency();
  const s = dict.form.step6;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <FieldWrap id="nombre" label={s.nombreLabel} error={errorText(dict, errors.nombre)}>
          <TextInput
            id="nombre"
            autoComplete="given-name"
            maxLength={MAX_LENGTHS.nombre}
            value={data.nombre}
            onChange={(e) => setField('nombre', e.target.value)}
          />
        </FieldWrap>
        <FieldWrap id="apellido" label={s.apellidoLabel} error={errorText(dict, errors.apellido)}>
          <TextInput
            id="apellido"
            autoComplete="family-name"
            maxLength={MAX_LENGTHS.apellido}
            value={data.apellido}
            onChange={(e) => setField('apellido', e.target.value)}
          />
        </FieldWrap>
      </div>

      <FieldWrap id="correo" label={s.correoLabel} error={errorText(dict, errors.correo)}>
        <TextInput
          id="correo"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={MAX_LENGTHS.correo}
          value={data.correo}
          onChange={(e) => setField('correo', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap id="telefono" label={s.telefonoLabel} error={errorText(dict, errors.telefono)}>
        <PhoneInput id="telefono" value={data.telefono} onChange={(v) => setField('telefono', v)} currency={currency} error={errors.telefono} />
      </FieldWrap>

      {/* Honeypot — hidden from real visitors, left empty by them. The backend ignores submissions where it is filled. */}
      <div className="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={data.consentimiento === 'si'}
            onChange={(e) => setField('consentimiento', e.target.checked ? 'si' : '')}
            className="mt-1 h-5 w-5 shrink-0 rounded border-border bg-panel text-sky focus:ring-sky"
            aria-describedby="consentimiento-notice"
          />
          <span className="text-sm text-foreground">{interpolate(s.consentimientoText, { company: CONSENT_COMPANY_NAME })}</span>
        </label>
        {errors.consentimiento && (
          <p className="mt-2 text-sm text-destructive" role="alert">
            {errorText(dict, errors.consentimiento)}
          </p>
        )}
        <p id="consentimiento-notice" className="mt-3 text-xs leading-relaxed text-muted">
          {s.dataNotice}{' '}
          <a
            href={PRIVACY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-2 hover:text-foreground"
          >
            {s.privacyLinkText}
          </a>
        </p>
      </div>
    </div>
  );
}
