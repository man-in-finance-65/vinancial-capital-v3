import { useLang, errorText } from '../../../i18n';
import { URGENCIA_VALUES, MAX_LENGTHS, type ApplicationData, type FieldName } from '../../../lib/application';
import { FieldWrap, TextArea, TextInput } from '../../ui/Field';
import { OptionCard } from '../../ui/OptionCard';

export function Step3Plan({
  data,
  setField,
  errors,
}: {
  data: ApplicationData;
  setField: <K extends FieldName>(field: K, value: ApplicationData[K]) => void;
  errors: Partial<Record<FieldName, string>>;
}) {
  const { dict } = useLang();
  const s = dict.form.step3;

  return (
    <div className="flex flex-col gap-6">
      <FieldWrap id="situacion" label={s.situacionLabel} error={errorText(dict, errors.situacion)}>
        <TextArea
          id="situacion"
          value={data.situacion}
          maxLength={MAX_LENGTHS.situacion}
          placeholder={s.situacionPlaceholder}
          onChange={(e) => setField('situacion', e.target.value)}
        />
      </FieldWrap>

      <FieldWrap id="monto_solicitado" label={s.montoLabel} error={errorText(dict, errors.monto_solicitado)}>
        <TextInput
          id="monto_solicitado"
          type="text"
          inputMode="text"
          maxLength={MAX_LENGTHS.monto_solicitado}
          placeholder={s.montoPlaceholder}
          value={data.monto_solicitado}
          onChange={(e) => setField('monto_solicitado', e.target.value)}
        />
      </FieldWrap>

      <div>
        <span className="block font-sans text-sm font-semibold text-foreground">{s.urgenciaLabel}</span>
        <div className="mt-2 grid gap-3">
          {URGENCIA_VALUES.map((value) => (
            <OptionCard
              key={value}
              label={s.urgenciaOptions[value]}
              selected={data.urgencia === value}
              onClick={() => setField('urgencia', value)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
