import { useState } from 'preact/hooks';
import data from '../../data/quiz.json';

export default function UrgencyQuiz({ phone }: { phone: string }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const total = Object.values(answers).reduce((a, b) => a + b, 0);
  const answered = Object.keys(answers).length;
  const result = data.results.find((r) => total >= r.min) ?? data.results[data.results.length - 1];
  const tel = `tel:${phone.replace(/[^+\d]/g, '')}`;

  const tone: Record<string, string> = {
    critical: 'border-accent bg-accent/10',
    high: 'border-accent/60 bg-accent/5',
    medium: 'border-hairline bg-surface',
    low: 'border-primary/30 bg-primary/5',
  };

  if (done) {
    return (
      <div class={`card p-7 md:p-9 border-2 ${tone[result.tone]}`} aria-live="polite">
        <p class="text-[13px] font-bold uppercase tracking-wide text-accent-dark">{result.level}</p>
        <p class="mt-2 font-heading font-bold text-2xl md:text-3xl">{result.headline}</p>
        <p class="mt-4 text-lg leading-relaxed">{result.meaning}</p>
        <p class="mt-6 font-heading font-bold text-lg">What to do next</p>
        <ol class="mt-3 space-y-2.5">
          {result.steps.map((s, i) => (
            <li key={i} class="flex gap-3 text-[16px]">
              <span class="font-heading font-bold text-accent shrink-0">{i + 1}.</span><span>{s}</span>
            </li>
          ))}
        </ol>
        <div class="mt-7 flex flex-col sm:flex-row gap-3">
          <a href={tel} class="btn btn-accent text-lg">{result.cta}</a>
          <button type="button" class="btn btn-ghost text-primary" onClick={() => { setAnswers({}); setDone(false); }}>Start again</button>
        </div>
        <p class="mt-5 text-[13.5px] text-ink-soft">
          This is a guide based on what you told us, not a diagnosis. Anything involving sewage in
          living space should be treated as urgent regardless of what a questionnaire says.
        </p>
      </div>
    );
  }

  return (
    <div class="card p-6 md:p-8">
      <p class="text-[14px] text-ink-soft">{answered} of {data.questions.length} answered</p>
      <div class="mt-2 h-1.5 bg-hairline rounded-full overflow-hidden">
        <div class="h-full bg-accent transition-all" style={{ width: `${(answered / data.questions.length) * 100}%` }} />
      </div>
      <div class="mt-7 space-y-8">
        {data.questions.map((q, qi) => (
          <fieldset key={q.id}>
            <legend class="font-heading font-bold text-lg mb-3">{qi + 1}. {q.text}</legend>
            <div class="space-y-2">
              {q.options.map((o) => (
                <label key={o.label}
                  class={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer min-h-[44px] ${
                    answers[q.id] === o.score ? 'border-accent bg-accent/8' : 'border-hairline hover:bg-surface'}`}>
                  <input type="radio" name={q.id} checked={answers[q.id] === o.score}
                    onChange={() => setAnswers({ ...answers, [q.id]: o.score })}
                    class="accent-[#C2571A] w-[18px] h-[18px]" />
                  <span class="text-[15px]">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>
      <button type="button" class="btn btn-accent w-full mt-8 text-lg"
        disabled={answered < data.questions.length}
        onClick={() => setDone(true)}>
        {answered < data.questions.length ? `Answer all ${data.questions.length} questions` : 'See my result'}
      </button>
    </div>
  );
}
