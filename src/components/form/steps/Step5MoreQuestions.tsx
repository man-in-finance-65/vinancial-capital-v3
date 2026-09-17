import { useLang } from '../../../i18n';
import {
  VIVIENDA_VALUES,
  CODEUDOR_VALUES,
  PUNTAJE_CREDITO_VALUES,
  HISTORIAL_LEGAL_VALUES,
  type ApplicationData,
  type FieldName,
} from '../../../lib/application';
import { OptionCard } from '../../ui/OptionCard';

function Group({
  label,
  sub,
  children,
}: {
  label: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <span className="block font-sans text-sm font-semibold text-foreground">{label}</span>
      {sub && <span className="mt-0.5 block text-xs text-muted">{sub}</span>}
      <div className="mt-2 grid gap-3">{children}</div>
    </div>
  );
}

export function Step5MoreQuestions({
  data,
  setField,
}: {
  data: ApplicationData;
  setField: <K extends FieldName>(field: K, value: ApplicationData[K]) => void;
}) {
  const { dict } = useLang();
  const s = dict.form.step5;

  return (
    <div className="flex flex-col gap-8">
      <Group label={s.viviendaLabel}>
        {VIVIENDA_VALUES.map((value) => (
          <OptionCard key={value} label={s.viviendaOptions[value]} selected={data.vivienda === value} onClick={() => setField('vivienda', value)} />
        ))}
      </Group>

      <Group label={s.codeudorLabel} sub={s.codeudorSub}>
        {CODEUDOR_VALUES.map((value) => (
          <OptionCard key={value} label={s.codeudorOptions[value]} selected={data.codeudor === value} onClick={() => setField('codeudor', value)} />
        ))}
      </Group>

      <Group label={s.puntajeLabel}>
        {PUNTAJE_CREDITO_VALUES.map((value) => (
          <OptionCard
            key={value}
            label={s.puntajeOptions[value]}
            selected={data.puntaje_credito === value}
            onClick={() => setField('puntaje_credito', value)}
          />
        ))}
      </Group>

      <Group label={s.historialLabel} sub={s.historialSub}>
        {HISTORIAL_LEGAL_VALUES.map((value) => (
          <OptionCard
            key={value}
            label={s.historialOptions[value]}
            selected={data.historial_legal === value}
            onClick={() => setField('historial_legal', value)}
          />
        ))}
      </Group>
    </div>
  );
}
