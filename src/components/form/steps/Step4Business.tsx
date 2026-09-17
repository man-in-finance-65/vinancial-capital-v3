import { useMemo } from 'react';
import { useLang, errorText } from '../../../i18n';
import { useCurrency } from '../../../context/AppProviders';
import { MAX_LENGTHS, TIPO_NEGOCIO_VALUES, type ApplicationData, type FieldName } from '../../../lib/application';
import { INDUSTRIES } from '../../../lib/industries';
import { regionsForCurrency } from '../../../lib/regions';
import { FieldWrap, TextInput } from '../../ui/Field';
import { SearchableSelect } from '../../ui/SearchableSelect';
import { OptionCard } from '../../ui/OptionCard';

export function Step4Business({
  data,
  setField,
  errors,
}: {
  data: ApplicationData;
  setField: <K extends FieldName>(field: K, value: ApplicationData[K]) => void;
  errors: Partial<Record<FieldName, string>>;
}) {
  const { dict, lang } = useLang();
  const currency = useCurrency();
  const s = dict.form.step4;

  const regionOptions = useMemo(
    () => regionsForCurrency(currency).map((r) => ({ value: r.value, label: r[lang] })),
    [currency, lang]
  );
  const industryOptions = useMemo(() => INDUSTRIES.map((i) => ({ value: i.value, label: i[lang] })), [lang]);

  return (
    <div className="flex flex-col gap-6">
      <FieldWrap id="empresa" label={s.empresaLabel} error={errorText(dict, errors.empresa)}>
        <TextInput
          id="empresa"
          autoComplete="organization"
          maxLength={MAX_LENGTHS.empresa}
          value={data.empresa}
          onChange={(e) => setField('empresa', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap id="provincia_estado" label={s.provinciaLabel} error={errorText(dict, errors.provincia_estado)}>
        <SearchableSelect
          id="provincia_estado"
          value={data.provincia_estado}
          onChange={(v) => setField('provincia_estado', v)}
          options={regionOptions}
        />
      </FieldWrap>

      <FieldWrap id="industria" label={s.industriaLabel} error={errorText(dict, errors.industria)}>
        <SearchableSelect id="industria" value={data.industria} onChange={(v) => setField('industria', v)} options={industryOptions} />
      </FieldWrap>

      <FieldWrap id="sitio_web" label={s.sitioWebLabel} error={errorText(dict, errors.sitio_web)}>
        <TextInput
          id="sitio_web"
          type="url"
          inputMode="url"
          autoComplete="url"
          maxLength={MAX_LENGTHS.sitio_web}
          placeholder={s.sitioWebPlaceholder}
          value={data.sitio_web}
          onChange={(e) => setField('sitio_web', e.target.value)}
        />
      </FieldWrap>

      <div>
        <span className="block font-sans text-sm font-semibold text-foreground">{s.tipoNegocioLabel}</span>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {TIPO_NEGOCIO_VALUES.map((value) => (
            <OptionCard
              key={value}
              label={s.tipoNegocioOptions[value]}
              selected={data.tipo_negocio === value}
              onClick={() => setField('tipo_negocio', value)}
            />
          ))}
        </div>
      </div>

      <FieldWrap id="tiempo_operando" label={s.tiempoOperandoLabel} error={errorText(dict, errors.tiempo_operando)}>
        <TextInput
          id="tiempo_operando"
          maxLength={MAX_LENGTHS.tiempo_operando}
          placeholder={s.tiempoOperandoPlaceholder}
          value={data.tiempo_operando}
          onChange={(e) => setField('tiempo_operando', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap id="ingresos_anuales" label={s.ingresosLabel} sublabel={s.ingresosSubLabel} error={errorText(dict, errors.ingresos_anuales)}>
        <TextInput
          id="ingresos_anuales"
          maxLength={MAX_LENGTHS.ingresos_anuales}
          placeholder={s.ingresosPlaceholder}
          value={data.ingresos_anuales}
          onChange={(e) => setField('ingresos_anuales', e.target.value)}
        />
      </FieldWrap>
    </div>
  );
}
