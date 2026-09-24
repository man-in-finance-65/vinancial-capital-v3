import { useLang } from '../../../i18n';
import { Button } from '../../ui/Button';

export function Step1Intro({ onNext }: { onNext: () => void }) {
  const { dict } = useLang();
  const s = dict.form.step1;

  return (
    <div className="flex flex-1 flex-col justify-center">
      <h2 className="font-slab text-3xl font-semibold text-foreground md:text-4xl">{s.title}</h2>
      <p className="mt-4 max-w-lg text-base leading-relaxed text-muted md:text-lg">{s.body}</p>
      <p className="mt-4 text-sm font-semibold text-sky">{s.timeNote}</p>
      <div className="mt-10">
        <Button variant="primary" icon onClick={onNext}>
          {s.cta}
        </Button>
      </div>
    </div>
  );
}
