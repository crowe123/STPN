import { useState, useMemo } from 'preact/hooks';
import data from '../../data/calculator.json';

type Sel = Record<string, string>;

export default function CostCalculator({ endpoint, phone, honeypot }:
  { endpoint: string; phone: string; honeypot: string }) {
  const [sel, setSel] = useState<Sel>({});
  const complete = data.inputs.every((i) => sel[i.id]);

  const result = useMemo(() => {
    if (!complete) return null;
    const tank = data.inputs[0].options.find((o) => o.value === sel.tankSize)!;
    const access = data.inputs[1].options.find((o) => o.value === sel.access)!;
    const last = data.inputs[2].options.find((o) => o.value === sel.lastPumped)!;
    const mid = (tank as any).base + ((access as any).add ?? 0) + ((last as any).add ?? 0);
    const s = data.formula.spread;
    return { low: Math.round((mid * (1 - s)) / 5) * 5, high: Math.round((mid * (1 + s)) / 5) * 5, mid };
  }, [sel, complete]);

  return (
    <div class="grid gap-8 lg:grid-cols-[1.05fr_1fr] items-start">
      <div class="card p-6 md:p-8">
        {data.inputs.map((input) => (
          <fieldset key={input.id} class="mb-7 last:mb-0">
            <legend class="font-heading font-bold text-lg mb-1">{input.label}</legend>
            <p class="text-[14px] text-ink-soft mb-3">{input.help}</p>
            <div class="space-y-2">
              {input.options.map((o) => (
                <label key={o.value}
                  class={`flex items-center gap-3 border rounded-md px-4 py-3 cursor-pointer min-h-[44px] transition-colors ${
                    sel[input.id] === o.value ? 'border-accent bg-accent/8' : 'border-hairline hover:bg-surface'}`}>
                  <input type="radio" name={input.id} value={o.value}
                    checked={sel[input.id] === o.value}
                    onChange={() => setSel({ ...sel, [input.id]: o.value })}
                    class="accent-[#C2571A] w-[18px] h-[18px]" />
                  <span class="text-[15px]">{o.label}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </div>

      <div>
        <div class="card p-6 md:p-8 bg-surface" aria-live="polite">
          {!result ? (
            <p class="text-ink-soft text-lg">Answer the three questions and your estimate appears here — no email, no phone call.</p>
          ) : (
            <>
              <p class="font-heading font-bold text-lg">{data.output.headline}</p>
              <p class="mt-2 font-heading font-bold text-4xl md:text-5xl text-primary">
                ${result.low}–${result.high}
              </p>
              <p class="mt-4 text-[14px] text-ink-soft">{data.output.disclaimer}</p>
              <div class="mt-6 border-t border-hairline pt-5">
                <p class="font-heading font-bold">What that is protecting</p>
                <ul class="mt-3 space-y-3">
                  {data.output.comparisons.map((c) => (
                    <li key={c.label}>
                      <p class="flex justify-between gap-4 font-semibold text-[15px]">
                        <span>{c.label}</span><span class="text-accent-dark whitespace-nowrap">{c.value}</span>
                      </p>
                      <p class="text-[13.5px] text-ink-soft">{c.note}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        <div class="card p-6 md:p-8 mt-5">
          <p class="font-heading font-bold text-xl">{data.leadCapture.heading}</p>
          <p class="mt-2 text-ink-soft">{data.leadCapture.body}</p>
          <p class="mt-3 text-[15px]">Or call <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} class="font-bold text-accent-dark underline underline-offset-2">{phone}</a>.</p>
          <form action={endpoint} method="POST" class="mt-4 space-y-3">
            <input type="hidden" name="_source" value="cost-calculator" />
            <input type="hidden" name="estimate" value={result ? `$${result.low}-$${result.high}` : 'not completed'} />
            <input type="hidden" name="answers" value={JSON.stringify(sel)} />
            <div aria-hidden="true" style="position:absolute;left:-9999px;top:-9999px;">
              <input type="text" name={honeypot} tabIndex={-1} autocomplete="off" />
            </div>
            <label class="block">
              <span class="block font-semibold mb-1.5">Name</span>
              <input name="name" required class="w-full min-h-[44px] border border-hairline rounded-md px-3 py-2.5" />
            </label>
            <label class="block">
              <span class="block font-semibold mb-1.5">Phone</span>
              <input name="phone" type="tel" required class="w-full min-h-[44px] border border-hairline rounded-md px-3 py-2.5" />
            </label>
            <label class="block">
              <span class="block font-semibold mb-1.5">Property ZIP</span>
              <input name="zip" required inputMode="numeric" maxLength={5} class="w-full min-h-[44px] border border-hairline rounded-md px-3 py-2.5" />
            </label>
            <button type="submit" class="btn btn-accent w-full">{data.leadCapture.cta}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
