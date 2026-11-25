import { motion } from 'motion/react';
import { type FormEvent, useId, useRef, useState } from 'react';
import { SITE } from '../data/site';

export interface EnquiryOption {
  id: string;
  label: string;
}

export interface EnquiryState {
  ok: boolean;
  message?: string;
  errors?: Record<string, string>;
}

export function validateEnquiry(formData: FormData): EnquiryState {
  const website = String(formData.get('website') ?? '').trim();
  if (website) return { ok: true };

  const name = String(formData.get('name') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const area = String(formData.get('area') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = 'Please enter your name (at least 2 characters).';
  if (name.length > 80) errors.name = 'Name must be 80 characters or fewer.';

  const digits = phone.replace(/[^\d]/g, '');
  if (digits.length < 7) errors.phone = 'Please enter a valid phone or WhatsApp number.';

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (area.length > 80) errors.area = 'Area must be 80 characters or fewer.';
  if (message.length > 2000) errors.message = 'Message must be 2000 characters or fewer.';

  if (Object.keys(errors).length) {
    return {
      ok: false,
      message: 'Please check the highlighted details below.',
      errors,
    };
  }
  return { ok: true };
}

function TextField({
  label,
  name,
  error,
  hint,
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-semibold">
        {label}
        {rest.required ? (
          <span className="text-toffee-ink"> *</span>
        ) : (
          <span className="font-normal text-cocoa-soft"> (optional)</span>
        )}
      </label>
      <input
        id={id}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className="mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base outline-none transition-[border-color,box-shadow] focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)] aria-[invalid=true]:border-[#b3261e]"
        {...rest}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-cocoa-soft">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-sm font-semibold text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({
  puppy,
  puppies,
  success = {
    heading: "Thank you — we've received your enquiry!",
    body: 'Our team will reach out shortly. For the fastest reply, message us on WhatsApp.',
  },
  whatsappHref = SITE.whatsappHref,
  compact = false,
}: {
  puppy?: EnquiryOption;
  puppies?: EnquiryOption[];
  success?: { heading: string; body: string };
  whatsappHref?: string;
  compact?: boolean;
}) {
  const [state, setState] = useState<EnquiryState>({ ok: false });
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const selectId = useId();
  const msgId = useId();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = validateEnquiry(new FormData(e.currentTarget));
    if (!res.ok) {
      setState(res);
      return;
    }
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setState({ ok: true });
    }, 350);
  };

  if (state.ok) {
    return (
      <motion.div
        role="status"
        initial={{ rotateX: -80, opacity: 0, y: -10 }}
        animate={{ rotateX: 0, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
        className="tp-sent rounded-[2rem] border-[3px] border-cocoa bg-honey p-8 text-center"
      >
        <svg viewBox="0 0 120 84" className="tp-envelope mx-auto w-32" aria-hidden="true">
          <path d="M6 10h108v68H6z" fill="#fffdf8" stroke="#2a170e" strokeWidth={3} strokeLinejoin="round" />
          <path d="M6 10l54 40 54-40" fill="none" stroke="#2a170e" strokeWidth={3} strokeLinejoin="round" />
          <circle cx={94} cy={62} r={12} fill="#c2622b" stroke="#2a170e" strokeWidth={2.5} />
        </svg>
        <p className="font-plush mt-4 text-[2rem]">{success.heading}</p>
        <p className="mx-auto mt-2 max-w-[38ch] text-cocoa-soft">{success.body}</p>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-6">
          WhatsApp us
        </a>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-5">
      {state.message && (
        <p role="alert" className="rounded-2xl bg-blush px-4 py-3 font-semibold">
          {state.message}
        </p>
      )}
      <div className={compact ? 'space-y-5' : 'grid gap-5 sm:grid-cols-2'}>
        <TextField
          label="Your name"
          name="name"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          error={state.errors?.name}
        />
        <TextField
          label="Phone or WhatsApp"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          error={state.errors?.phone}
          hint="With country code, e.g. +971 50 123 4567"
        />
        <TextField label="Email" name="email" type="email" autoComplete="email" error={state.errors?.email} />
        <TextField
          label="Your area"
          name="area"
          autoComplete="address-level2"
          maxLength={80}
          error={state.errors?.area}
          hint="e.g. Dubai Marina"
        />
      </div>

      {puppy ? (
        <input type="hidden" name="puppyId" value={puppy.id} />
      ) : (
        puppies && (
          <div>
            <label htmlFor={selectId} className="block text-[0.95rem] font-semibold">
              Puppy you&apos;re interested in <span className="font-normal text-cocoa-soft">(optional)</span>
            </label>
            <select
              id={selectId}
              name="puppyId"
              className="mt-1.5 h-12 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 text-base"
              defaultValue=""
            >
              <option value="">Not sure yet</option>
              {puppies.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )
      )}

      <div>
        <label htmlFor={msgId} className="block text-[0.95rem] font-semibold">
          Message <span className="font-normal text-cocoa-soft">(optional)</span>
        </label>
        <textarea
          id={msgId}
          name="message"
          rows={compact ? 3 : 4}
          maxLength={2000}
          className="mt-1.5 w-full rounded-2xl border-2 border-cocoa/60 bg-milk px-4 py-3 text-base outline-none focus:border-cocoa focus:shadow-[0_0_0_4px_rgb(242_190_107/0.6)]"
          defaultValue={puppy ? `Hi! I'd love to know more about ${puppy.label}.` : ''}
        />
        {state.errors?.message && <p className="mt-1 text-sm font-semibold text-[#b3261e]">{state.errors.message}</p>}
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <button type="submit" disabled={pending} className="btn btn-primary w-full disabled:opacity-70 sm:w-auto">
        {pending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
