"use client";

import { useCallback, useId, useState, type FormEvent } from "react";
import { FullScreenModal, type ModalPhase } from "@/components/FullScreenModal";

const RFQ_EMAIL = "dogankarakas@kazenco.com";

interface ContactModalProps {
  triggerLabel: string;
  triggerClassName?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_CLASS =
  "h-12 w-full rounded-lg border border-transparent bg-[#F1F1F1] px-3.5 text-base text-foreground outline-none transition-colors focus:border-foreground focus:bg-white";
const LABEL_CLASS = "mb-1.5 block text-[13px] text-muted-foreground";

function GroupHeader({ number, label }: { number: number; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background">
        {number}
      </span>
      <hr className="flex-1 border-0 border-t border-border" />
      <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function ContactModal({ triggerLabel, triggerClassName }: ContactModalProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const titleId = useId();

  const canSubmit = name.trim() !== "" && email.trim() !== "" && budget.trim() !== "";

  const close = useCallback(() => {
    setOpen(false);
    setStatus("idle");
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const company = String(formData.get("company") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();
    const startDate = String(formData.get("startDate") ?? "").trim();
    const launchDate = String(formData.get("launchDate") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const body = [
      "Project enquiry",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Company: ${company || "—"}`,
      `Website: ${website || "—"}`,
      `Budget range: ${budget}`,
      `Estimated start date: ${startDate || "—"}`,
      `Expected launch date: ${launchDate || "—"}`,
      "",
      "Project details:",
      message || "—",
    ].join("\n");

    try {
      window.location.href = `mailto:${RFQ_EMAIL}?subject=${encodeURIComponent(
        `Project enquiry - ${company || name}`,
      )}&body=${encodeURIComponent(body)}`;
      window.setTimeout(() => setStatus("success"), 500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          triggerClassName ??
          "inline cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit]"
        }
      >
        {triggerLabel}
      </button>

      <FullScreenModal open={open} onClose={close} labelledBy={titleId}>
        {(phase: ModalPhase) => {
          const visible = phase === "open";
          return (
            <div className="mx-auto grid max-w-[74rem] gap-6 lg:grid-cols-[0.32fr_0.68fr]">
              <div className="flex flex-col gap-6">
                <div
                  className={`rounded-[24px] bg-white p-8 transition-all duration-500 ease-out ${
                    visible ? "translate-y-0 opacity-100 delay-150" : "translate-y-5 opacity-0"
                  }`}
                >
                  <h3 id={titleId} className="m-0 text-[1.9rem] font-medium leading-tight">
                    Project enquiry
                  </h3>
                </div>

                <div
                  className={`rounded-[24px] bg-white p-8 transition-all duration-500 ease-out ${
                    visible ? "translate-y-0 opacity-100 delay-[250ms]" : "translate-y-5 opacity-0"
                  }`}
                >
                  <p className="m-0 mb-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                    Tell us about your project and our procurement team will follow up with next steps.
                  </p>
                  <a
                    href={`mailto:${RFQ_EMAIL}`}
                    className="mt-1 block text-foreground transition-colors hover:text-muted-foreground"
                  >
                    {RFQ_EMAIL}
                  </a>
                  <a
                    href="https://wa.me/77024316698"
                    className="mt-1 block text-foreground transition-colors hover:text-muted-foreground"
                  >
                    WhatsApp
                  </a>
                  <p className="m-0 mt-4 text-[0.85rem] text-muted-foreground">Atyrau, Kazakhstan (UTC+5)</p>
                </div>
              </div>

              <form
                onSubmit={submit}
                className="rounded-[24px] bg-white p-6 transition-[clip-path,transform] duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] delay-150 sm:p-12"
                style={{
                  clipPath: visible ? "inset(0 0 0% 0 round 24px)" : "inset(0 0 100% 0 round 24px)",
                  transform: visible ? "translateY(0)" : "translateY(50px)",
                }}
              >
                <div className="mb-8">
                  <GroupHeader number={1} label="You" />
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-name`}>
                        Name*
                      </label>
                      <input
                        id={`${titleId}-name`}
                        name="name"
                        required
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-email`}>
                        Email*
                      </label>
                      <input
                        id={`${titleId}-email`}
                        type="email"
                        name="email"
                        required
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        className={FIELD_CLASS}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <GroupHeader number={2} label="Your company" />
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-company`}>
                        Company name
                      </label>
                      <input id={`${titleId}-company`} name="company" className={FIELD_CLASS} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-website`}>
                        Website
                      </label>
                      <input id={`${titleId}-website`} name="website" className={FIELD_CLASS} />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <GroupHeader number={3} label="Your project" />
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-budget`}>
                        Budget range*
                      </label>
                      <input
                        id={`${titleId}-budget`}
                        name="budget"
                        required
                        value={budget}
                        onChange={(event) => setBudget(event.target.value)}
                        className={FIELD_CLASS}
                      />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-start`}>
                        Estimated start date
                      </label>
                      <input id={`${titleId}-start`} type="date" name="startDate" className={FIELD_CLASS} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-launch`}>
                        Expected launch date
                      </label>
                      <input id={`${titleId}-launch`} type="date" name="launchDate" className={FIELD_CLASS} />
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <GroupHeader number={4} label="Tell us more" />
                  <label className={LABEL_CLASS} htmlFor={`${titleId}-message`}>
                    Project description
                  </label>
                  <textarea
                    id={`${titleId}-message`}
                    name="message"
                    rows={5}
                    className="w-full resize-y rounded-lg border border-transparent bg-[#F1F1F1] px-3.5 py-3 text-base text-foreground outline-none transition-colors focus:border-foreground focus:bg-white"
                  />
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
                  {status === "success" && (
                    <p role="status" className="m-0 text-sm text-muted-foreground">
                      Thanks — your email client should be open now.
                    </p>
                  )}
                  {status === "error" && (
                    <p role="alert" className="m-0 text-sm text-destructive">
                      Something went wrong — please email us directly.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={!canSubmit || status === "submitting"}
                    className="flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-[12px] font-semibold uppercase tracking-[0.06em] text-background transition-opacity disabled:cursor-not-allowed disabled:bg-[#d8d8d8] disabled:text-[#9c9c9c]"
                  >
                    {status === "submitting" ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            </div>
          );
        }}
      </FullScreenModal>
    </>
  );
}
