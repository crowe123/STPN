/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import quiz from '../../data/quiz.json';

type Q = { id: string; text: string; options: { label: string; weight: number }[] };
const questions = quiz.questions as Q[];

const toneClass: Record<string, string> = {
  critical: 'border-alert bg-[#fdeceb]',
  warn: 'border-accent bg-accent-tint',
  notice: 'border-primary-light bg-primary-tint',
  ok: 'border-line bg-offwhite',
};
const toneText: Record<string, string> = {
  critical: 'text-alert',
  warn: 'text-accent-dark',
  notice: 'text-primary',
  ok: 'text-primary-dark',
};

export default function AssessmentQuiz({ phoneDisplay, telHref }: { phoneDisplay: string; telHref: string }) {
  const [answers, setAnswers] = useState<Record<string, number | undefined>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = Object.values(answers).filter((v) => v !== undefined).length;
  const score = useMemo(
    () => Object.values(answers).reduce<number>((sum, v) => sum + (v ?? 0), 0),
    [answers]
  );
  const result = useMemo(
    () => quiz.results.find((r) => score >= r.minScore) ?? quiz.results[quiz.results.length - 1],
    [score]
  );

  if (submitted) {
    return (
      <div>
        <div class={`rounded border-2 p-6 sm:p-8 ${toneClass[result.tone] ?? toneClass.ok}`}>
          <p class={`font-display text-sm font-bold uppercase tracking-[0.18em] ${toneText[result.tone] ?? ''}`}>
            {result.level}
          </p>
          <h2 class="mt-2 font-display text-3xl leading-tight text-primary-dark sm:text-4xl">{result.headline}</h2>
          <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink">{result.meaning}</p>

          <h3 class="mt-7 text-xl">What to do next</h3>
          <ol class="mt-3 max-w-2xl list-decimal space-y-2 pl-5 text-[1.0625rem] leading-relaxed text-ink">
            {result.next.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ol>

          <div class="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={telHref} class="btn btn-accent" data-cta="quiz-result-call">
              {result.cta} — {phoneDisplay}
            </a>
            <a href="/contact/" class="btn btn-outline">Send property details</a>
            <button type="button" class="btn btn-outline" onClick={() => setSubmitted(false)}>
              Change answers
            </button>
          </div>
        </div>

        <p class="mt-5 max-w-3xl text-sm leading-relaxed text-ink-soft">{quiz.disclaimer}</p>

        <div class="mt-7 rounded border border-line bg-white p-5">
          <h3 class="text-lg">Your answers</h3>
          <ul class="mt-3 space-y-1.5 text-[0.98rem] text-ink-soft">
            {questions.map((q) => {
              const w = answers[q.id];
              const chosen = q.options.find((o) => o.weight === w);
              return (
                <li key={q.id}>
                  <span class="font-semibold text-primary-dark">{q.text}</span>{' '}
                  {chosen ? chosen.label : 'not answered'}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div class="sticky top-20 z-10 rounded border border-line bg-white/95 px-4 py-3 shadow-card backdrop-blur">
        <div class="flex items-center justify-between gap-4">
          <p class="font-display text-base font-bold uppercase tracking-wide text-primary-dark">
            {answeredCount} of {questions.length} answered
          </p>
          <button
            type="button"
            class="btn btn-primary"
            disabled={answeredCount < questions.length}
            onClick={() => setSubmitted(true)}
          >
            See the result
          </button>
        </div>
        <div class="mt-2 h-2 w-full overflow-hidden rounded-sm bg-line">
          <div
            class="h-full bg-accent transition-all"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <ol class="mt-7 space-y-6">
        {questions.map((q, i) => (
          <li key={q.id} class="card p-6">
            <h2 class="text-xl leading-snug">
              <span class="mr-2 font-display text-accent-dark">{i + 1}.</span>
              {q.text}
            </h2>
            <div class="mt-4 space-y-2">
              {q.options.map((o) => (
                <label
                  key={o.label}
                  class={`flex min-h-12 cursor-pointer items-center gap-3 rounded border px-3 py-2.5 text-[1.0625rem] ${
                    answers[q.id] === o.weight
                      ? 'border-primary bg-primary-tint font-semibold text-primary-dark'
                      : 'border-line bg-white hover:border-primary-light'
                  }`}
                >
                  <input
                    type="radio"
                    name={q.id}
                    checked={answers[q.id] === o.weight}
                    onChange={() => setAnswers({ ...answers, [q.id]: o.weight })}
                    class="h-5 w-5 accent-[#14432F]"
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div class="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          class="btn btn-primary"
          disabled={answeredCount < questions.length}
          onClick={() => setSubmitted(true)}
        >
          See the result
        </button>
        {answeredCount < questions.length && (
          <p class="text-[1rem] text-ink-soft">
            {questions.length - answeredCount} question{questions.length - answeredCount === 1 ? '' : 's'} left.
          </p>
        )}
      </div>
      <p class="mt-6 max-w-3xl text-sm leading-relaxed text-ink-soft">{quiz.disclaimer}</p>
    </div>
  );
}
