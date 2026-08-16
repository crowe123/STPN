/** @jsxImportSource preact */
import { useMemo, useState } from 'preact/hooks';
import config from '../../data/calculator.json';

type Option = { value: string; label: string; lowMult: number; highMult: number };
type Input = { id: string; label: string; help: string; options: Option[] };

const inputs = config.inputs as Input[];
const money = (n: number) =>
  `${config.locale.currencySymbol}${Math.round(n / 5) * 5}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default function CostEstimator({ formEndpoint, formEnabled, phoneDisplay, telHref, honeypot }: {
  formEndpoint: string;
  formEnabled: boolean;
  phoneDisplay: string;
  telHref: string;
  honeypot: string;
}) {
  const [choices, setChoices] = useState<Record<string, string>>(
    Object.fromEntries(inputs.map((i) => [i.id, i.options[1]?.value ?? i.options[0].value]))
  );

  const result = useMemo(() => {
    let low = config.baseLow;
    let high = config.baseHigh;
    const applied: { label: string; low: number; high: number }[] = [];
    for (const input of inputs) {
      const opt = input.options.find((o) => o.value === choices[input.id]) ?? input.options[0];
      low *= opt.lowMult;
      high *= opt.highMult;
      applied.push({ label: `${input.label}: ${opt.label}`, low: opt.lowMult, high: opt.highMult });
    }
    return { low, high, applied };
  }, [choices]);

  return (
    <div class="grid gap-8 lg:grid-cols-[1.05fr_1fr]">
      <div class="card p-6">
        {inputs.map((input) => (
          <fieldset key={input.id} class="mb-7 border-0 p-0 last:mb-0">
            <legend class="font-display text-lg font-bold uppercase tracking-wide text-primary-dark">
              {input.label}
            </legend>
            <p class="mt-1 text-[0.95rem] leading-relaxed text-ink-soft">{input.help}</p>
            <div class="mt-3 space-y-2">
              {input.options.map((o) => (
                <label
                  key={o.value}
                  class={`flex min-h-12 cursor-pointer items-center gap-3 rounded border px-3 py-2.5 text-[1.0625rem] ${
                    choices[input.id] === o.value
                      ? 'border-primary bg-primary-tint font-semibold text-primary-dark'
                      : 'border-line bg-white hover:border-primary-light'
                  }`}
                >
                  <input
                    type="radio"
                    name={input.id}
                    value={o.value}
                    checked={choices[input.id] === o.value}
                    onChange={() => setChoices({ ...choices, [input.id]: o.value })}
                    class="h-5 w-5 accent-[#14432F]"
                  />
                  <span>{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div>
        <div class="rounded border-2 border-accent bg-white p-6 shadow-card">
          <p class="font-display text-sm font-bold uppercase tracking-[0.16em] text-accent-dark">Estimated range</p>
          <p class="mt-2 font-display text-5xl font-bold leading-none text-primary-dark">
            {money(result.low)} – {money(result.high)}
          </p>
          <p class="mt-3 text-[1.0625rem] leading-relaxed text-ink-soft">{config.disclaimer}</p>
          <a href={telHref} class="btn btn-accent mt-5 w-full" data-cta="calculator-call">
            Call {phoneDisplay} to confirm
          </a>
        </div>

        <details class="mt-5 rounded border border-line bg-offwhite p-5" open>
          <summary class="cursor-pointer font-display text-lg font-bold uppercase tracking-wide text-primary-dark">
            How this number was calculated
          </summary>
          <ol class="mt-3 list-decimal space-y-2 pl-5 text-[1rem] leading-relaxed text-ink-soft">
            {config.formulaExplainer.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <table class="mt-4 w-full text-left text-[0.95rem]">
            <thead>
              <tr>
                <th class="border-b border-line py-1.5 pr-3 font-semibold text-primary-dark">Factor applied</th>
                <th class="border-b border-line py-1.5 pr-3 font-semibold text-primary-dark">Low ×</th>
                <th class="border-b border-line py-1.5 font-semibold text-primary-dark">High ×</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border-b border-line py-1.5 pr-3">
                  Published Tennessee base range
                </td>
                <td class="border-b border-line py-1.5 pr-3">${config.baseLow}</td>
                <td class="border-b border-line py-1.5">${config.baseHigh}</td>
              </tr>
              {result.applied.map((a) => (
                <tr key={a.label}>
                  <td class="border-b border-line py-1.5 pr-3">{a.label}</td>
                  <td class="border-b border-line py-1.5 pr-3">{a.low.toFixed(2)}</td>
                  <td class="border-b border-line py-1.5">{a.high.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p class="mt-4 text-sm leading-relaxed text-ink-soft">{config.basis.summary}</p>
          <ul class="mt-2 space-y-1 text-sm">
            {config.basis.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener nofollow" class="underline">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </details>

        <div class="mt-5 space-y-4">
          {config.comparisons.map((c) => (
            <div key={c.label} class="rounded border-l-4 border-primary-light bg-white p-4 shadow-card">
              <p class="font-display text-base font-bold uppercase tracking-wide text-primary">{c.label}</p>
              <p class="mt-1 text-[1rem] leading-relaxed text-ink-soft">{c.text}</p>
            </div>
          ))}
        </div>

        <div class="card mt-6 overflow-hidden">
          <div class="bg-primary px-5 py-4 text-white">
            <h2 class="text-xl text-white">{config.leadCapture.heading}</h2>
            <p class="mt-1 text-white/85">{config.leadCapture.body}</p>
          </div>
          <form class="space-y-4 p-5" method="POST" action={formEndpoint}>
            {!formEnabled && (
              <p class="rounded border-l-4 border-accent bg-accent-tint px-4 py-3 text-sm leading-relaxed">
                <strong>Online booking is not live yet.</strong> The form endpoint has not been configured, so
                submissions are disabled rather than lost. Call {phoneDisplay} and a person will take the details.
              </p>
            )}
            <input type="hidden" name="_source" value="calculator" />
            <input type="hidden" name="estimate" value={`${money(result.low)}-${money(result.high)}`} />
            <input type="hidden" name="tank_size" value={choices.size} />
            <input type="hidden" name="access" value={choices.access} />
            <input type="hidden" name="history" value={choices.history} />
            <div style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" aria-hidden="true">
              <input type="text" name={honeypot} tabIndex={-1} autocomplete="off" />
            </div>
            <div>
              <label class="block font-semibold text-primary-dark" for="calc-name">Name</label>
              <input
                id="calc-name"
                name="name"
                required
                disabled={!formEnabled}
                class="mt-1.5 min-h-12 w-full rounded border border-line px-3 py-2.5 text-[1.0625rem] disabled:bg-offwhite"
              />
            </div>
            <div>
              <label class="block font-semibold text-primary-dark" for="calc-phone">Phone</label>
              <input
                id="calc-phone"
                name="phone"
                type="tel"
                required
                disabled={!formEnabled}
                class="mt-1.5 min-h-12 w-full rounded border border-line px-3 py-2.5 text-[1.0625rem] disabled:bg-offwhite"
              />
            </div>
            <div>
              <label class="block font-semibold text-primary-dark" for="calc-zip">Property ZIP</label>
              <input
                id="calc-zip"
                name="zip"
                inputMode="numeric"
                maxLength={5}
                required
                disabled={!formEnabled}
                class="mt-1.5 min-h-12 w-full rounded border border-line px-3 py-2.5 text-[1.0625rem] disabled:bg-offwhite"
              />
            </div>
            <button type="submit" class="btn btn-accent w-full" disabled={!formEnabled}>
              {config.leadCapture.cta}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
