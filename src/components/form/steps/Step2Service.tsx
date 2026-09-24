import { useLang } from '../../../i18n';
import { MAX_LENGTHS, SERVICIO_FINANCIERO_VALUES, type ApplicationData } from '../../../lib/application';
import { TextArea } from '../../ui/Field';
import { OptionCard } from '../../ui/OptionCard';

export function Step2Service({
  data,
  setField,
  error,
}: {
  data: ApplicationData;
  setField: (field: 'servicio_financiero' | 'servicio_otro', value: string) => void;
  error?: string;
}) {
  const { dict } = useLang();
  const s = dict.form.step2;

  return (
    <div>
      <h2 className="font-slab text-2xl font-semibold text-foreground md:text-3xl">{s.prompt}</h2>
      <div className="mt-6 grid gap-3">
        {SERVICIO_FINANCIERO_VALUES.map((value) => {
          const option = s.options[value];
          return (
            <OptionCard
              key={value}
              label={option.label}
              sub={option.sub}
              selected={data.servicio_financiero === value}
              onClick={() => setField('servicio_financiero', value)}
            />
          );
        })}
      </div>
      {data.servicio_financiero === 'otro' && (
        <TextArea
          id="servicio_otro"
          className="mt-3"
          maxLength={MAX_LENGTHS.servicio_otro}
          placeholder={s.otroPlaceholder}
          value={data.servicio_otro}
          onChange={(e) => setField('servicio_otro', e.target.value)}
        />
      )}
      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
