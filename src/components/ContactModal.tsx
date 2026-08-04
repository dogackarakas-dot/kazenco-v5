"use client";

import { useCallback, useId, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { upload } from "@vercel/blob/client";
import { usePathname } from "next/navigation";
import { FullScreenModal, type ModalPhase } from "@/components/FullScreenModal";
import { safeFilename } from "@/lib/rfq";
import { localeFromPathname } from "@/lib/i18n";
import { RFQ_COPY, SERVICE_LABELS } from "@/lib/modal-translations";

const RFQ_EMAIL = "info@kazenco.com";

export interface ContactModalProps {
  triggerLabel: string;
  triggerClassName?: string;
  initialOpen?: boolean;
  hideTrigger?: boolean;
}

type Status = "idle" | "uploading" | "submitting" | "success" | "fallback" | "error";

type AttachmentKind = "drawings" | "boq" | "documents";

interface RfqAttachment {
  file: File;
  kind: AttachmentKind;
  id: string;
}

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MAX_TOTAL_SIZE = 40 * 1024 * 1024;
const MAX_FILES = 8;
const ALLOWED_EXTENSIONS = new Set(["pdf", "dwg", "dxf", "xls", "xlsx", "csv", "doc", "docx"]);

const ATTACHMENT_COPY: Record<AttachmentKind, { label: string; accept: string; hint: string }> = {
  drawings: { label: "Drawings", accept: ".pdf,.dwg,.dxf", hint: "PDF, DWG or DXF" },
  boq: { label: "BOQ / quantities", accept: ".xls,.xlsx,.csv,.pdf", hint: "XLS, XLSX, CSV or PDF" },
  documents: { label: "Specifications", accept: ".pdf,.doc,.docx", hint: "PDF, DOC or DOCX" },
};

const FIELD_CLASS =
  "h-12 w-full rounded-lg border border-transparent bg-secondary px-3.5 text-base text-foreground outline-none transition-colors focus:border-foreground focus:bg-card";
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

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ContactModal({ triggerLabel, triggerClassName, initialOpen = false, hideTrigger = false }: ContactModalProps) {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = RFQ_COPY[locale];
  const [open, setOpen] = useState(initialOpen);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectName, setProjectName] = useState("");
  const [requestType, setRequestType] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [attachments, setAttachments] = useState<RfqAttachment[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [reference, setReference] = useState("");
  const fileInputs = useRef<Record<AttachmentKind, HTMLInputElement | null>>({
    drawings: null,
    boq: null,
    documents: null,
  });
  const titleId = useId();

  const canSubmit = [name, email, company, projectName, requestType, location, message].every(
    (value) => value.trim() !== "",
  ) && consent;

  const close = useCallback(() => {
    setOpen(false);
    setStatus("idle");
    setUploadProgress(0);
  }, []);

  const addAttachments = (kind: AttachmentKind, event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selected.length === 0) return;

    const next = [...attachments];
    for (const file of selected) {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXTENSIONS.has(extension)) {
        setAttachmentError(`${file.name}: unsupported file type.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setAttachmentError(`${file.name}: exceeds the 15 MB file limit.`);
        return;
      }
      if (next.some((item) => item.file.name === file.name && item.file.size === file.size)) continue;
      next.push({ file, kind, id: `${file.name}-${file.size}-${file.lastModified}` });
    }

    if (next.length > MAX_FILES) {
      setAttachmentError(`A maximum of ${MAX_FILES} files can be added.`);
      return;
    }
    if (next.reduce((total, item) => total + item.file.size, 0) > MAX_TOTAL_SIZE) {
      setAttachmentError("The combined file size cannot exceed 40 MB.");
      return;
    }
    setAttachments(next);
    setAttachmentError("");
  };

  const removeAttachment = (id: string) => {
    setAttachments((current) => current.filter((item) => item.id !== id));
    setAttachmentError("");
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) return;

    setStatus(attachments.length > 0 ? "uploading" : "submitting");
    setUploadProgress(0);
    const formData = new FormData(event.currentTarget);
    const phone = String(formData.get("phone") ?? "").trim();
    const requiredBy = String(formData.get("requiredBy") ?? "").trim();
    const specification = String(formData.get("specification") ?? "").trim();
    const website = String(formData.get("website") ?? "").trim();

    if (website) {
      setStatus("success");
      return;
    }

    const body = [
      "KAZENCO quotation request",
      "",
      `Request type: ${requestType}`,
      `Project name: ${projectName}`,
      `Project location: ${location}`,
      `Required by: ${requiredBy || "Not specified"}`,
      "",
      `Name: ${name}`,
      `Company: ${company}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not specified"}`,
      "",
      "Requirement:",
      message,
      "",
      "Specification / standard references:",
      specification || "Not specified",
      "",
      "Files selected in the RFQ form:",
      attachments.length > 0
        ? attachments.map(({ file, kind }) => `- ${ATTACHMENT_COPY[kind].label}: ${file.name} (${formatBytes(file.size)})`).join("\n")
        : "No files selected",
      "",
      attachments.length > 0 ? "Important: Please attach the files listed above to this email before sending." : "",
    ].join("\n");

    const openEmailFallback = () => {
      window.location.href = `mailto:${RFQ_EMAIL}?subject=${encodeURIComponent(
        `RFQ · ${requestType} · ${company}`,
      )}&body=${encodeURIComponent(body)}`;
      window.setTimeout(() => setStatus("fallback"), 400);
    };

    try {
      const statusResponse = await fetch("/api/rfq", { cache: "no-store" });
      const serviceStatus = (await statusResponse.json()) as { available?: boolean };
      if (!serviceStatus.available) throw new Error("Secure RFQ delivery is not configured.");

      const uploadedFiles = [];
      for (let index = 0; index < attachments.length; index += 1) {
        const attachment = attachments[index];
        const blob = await upload(`rfq/${safeFilename(attachment.file.name)}`, attachment.file, {
          access: "private",
          handleUploadUrl: "/api/rfq/upload",
          clientPayload: JSON.stringify({ kind: attachment.kind }),
          multipart: attachment.file.size > 5 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => {
            setUploadProgress(Math.round(((index + percentage / 100) / attachments.length) * 100));
          },
        });
        uploadedFiles.push({
          name: attachment.file.name,
          size: attachment.file.size,
          kind: attachment.kind,
          url: blob.url,
          pathname: blob.pathname,
        });
      }

      setStatus("submitting");
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          phone,
          projectName,
          requestType,
          location,
          requiredBy,
          message,
          specification,
          consent,
          website,
          files: uploadedFiles,
        }),
      });
      const result = (await response.json()) as { reference?: string; error?: string };
      if (!response.ok || !result.reference) throw new Error(result.error || "RFQ submission failed.");
      setReference(result.reference);
      setStatus("success");
    } catch {
      try {
        openEmailFallback();
      } catch {
        setStatus("error");
      }
    }
  };

  return (
    <>
      {!hideTrigger ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={triggerClassName ?? "inline cursor-pointer border-0 bg-transparent p-0 text-inherit [font:inherit]"}
        >
          {triggerLabel}
        </button>
      ) : null}

      <FullScreenModal open={open} onClose={close} labelledBy={titleId}>
        {(phase: ModalPhase) => {
          const visible = phase === "open";
          return (
            <div className="mx-auto grid max-w-[74rem] gap-6 lg:grid-cols-[0.32fr_0.68fr]">
              <div className="flex flex-col gap-6">
                <div className={`rounded-[24px] bg-card p-8 transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100 delay-150" : "translate-y-5 opacity-0"}`}>
                  <p className="m-0 mb-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">{copy[0]}</p>
                  <h3 id={titleId} className="m-0 text-[1.9rem] font-medium leading-tight">{copy[1]}</h3>
                </div>

                <div className={`rounded-[24px] bg-card p-8 transition-all duration-500 ease-out ${visible ? "translate-y-0 opacity-100 delay-[250ms]" : "translate-y-5 opacity-0"}`}>
                  <p className="m-0 mb-4 text-[0.95rem] leading-relaxed text-muted-foreground">
                    {copy[2]}
                  </p>
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">{copy[3]}</span>
                  <a href={`mailto:${RFQ_EMAIL}`} className="mt-1 block break-all text-foreground transition-colors hover:text-muted-foreground">{RFQ_EMAIL}</a>
                  <a href="https://wa.me/77024316698" target="_blank" rel="noreferrer" className="mt-3 block text-foreground transition-colors hover:text-muted-foreground">WhatsApp · +7 702 431 66 98</a>
                  <p className="m-0 mt-4 text-[0.85rem] text-muted-foreground">Atyrau, Kazakhstan · UTC+5</p>
                </div>
              </div>

              <form
                onSubmit={submit}
                className="rounded-[24px] bg-card p-6 transition-[clip-path,transform] duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] delay-150 sm:p-12"
                style={{
                  clipPath: visible ? "inset(0 0 0% 0 round 24px)" : "inset(0 0 100% 0 round 24px)",
                  transform: visible ? "translateY(0)" : "translateY(50px)",
                }}
              >
                <div className="mb-8">
                  <GroupHeader number={1} label={copy[4]} />
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-name`}>{copy[5]}*</label>
                      <input id={`${titleId}-name`} name="name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} className={FIELD_CLASS} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-email`}>{copy[6]}*</label>
                      <input id={`${titleId}-email`} type="email" name="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className={FIELD_CLASS} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-company`}>{copy[7]}*</label>
                      <input id={`${titleId}-company`} name="company" autoComplete="organization" required value={company} onChange={(event) => setCompany(event.target.value)} className={FIELD_CLASS} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-phone`}>{copy[8]}</label>
                      <input id={`${titleId}-phone`} type="tel" name="phone" autoComplete="tel" className={FIELD_CLASS} />
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <GroupHeader number={2} label={copy[9]} />
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-project`}>{copy[10]}*</label>
                      <input id={`${titleId}-project`} name="projectName" required value={projectName} onChange={(event) => setProjectName(event.target.value)} className={FIELD_CLASS} />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-type`}>{copy[11]}*</label>
                      <select id={`${titleId}-type`} name="requestType" required value={requestType} onChange={(event) => setRequestType(event.target.value)} className={FIELD_CLASS}>
                        <option value="">{copy[12]}</option>
                        {SERVICE_LABELS.en.map((value, index) => <option value={value} key={value}>{SERVICE_LABELS[locale][index]}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-location`}>{copy[13]}*</label>
                      <input id={`${titleId}-location`} name="location" required value={location} onChange={(event) => setLocation(event.target.value)} className={FIELD_CLASS} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-required`}>{copy[14]}</label>
                      <input id={`${titleId}-required`} type="date" name="requiredBy" className={FIELD_CLASS} />
                    </div>
                  </div>
                </div>

                <div>
                  <GroupHeader number={3} label={copy[15]} />
                  <div className="grid gap-3.5">
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-message`}>{copy[16]}*</label>
                      <textarea id={`${titleId}-message`} name="message" rows={5} required value={message} onChange={(event) => setMessage(event.target.value)} className="w-full resize-y rounded-lg border border-transparent bg-secondary px-3.5 py-3 text-base text-foreground outline-none transition-colors focus:border-foreground focus:bg-card" />
                    </div>
                    <div>
                      <label className={LABEL_CLASS} htmlFor={`${titleId}-specification`}>{copy[17]}</label>
                      <textarea id={`${titleId}-specification`} name="specification" rows={3} className="w-full resize-y rounded-lg border border-transparent bg-secondary px-3.5 py-3 text-base text-foreground outline-none transition-colors focus:border-foreground focus:bg-card" />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <GroupHeader number={4} label={copy[18]} />
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(Object.keys(ATTACHMENT_COPY) as AttachmentKind[]).map((kind) => {
                      const copy = ATTACHMENT_COPY[kind];
                      return (
                        <div key={kind}>
                          <input
                            ref={(node) => { fileInputs.current[kind] = node; }}
                            type="file"
                            multiple
                            accept={copy.accept}
                            onChange={(event) => addAttachments(kind, event)}
                            className="sr-only"
                            id={`${titleId}-${kind}`}
                          />
                          <button
                            type="button"
                            onClick={() => fileInputs.current[kind]?.click()}
                            className="flex min-h-24 w-full cursor-pointer flex-col items-start justify-center rounded-xl border border-dashed border-border bg-secondary px-4 py-3 text-left transition-colors hover:border-foreground hover:bg-card"
                          >
                            <span className="text-sm font-medium text-foreground">+ {RFQ_COPY[locale][19 + (Object.keys(ATTACHMENT_COPY) as AttachmentKind[]).indexOf(kind)]}</span>
                            <span className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{copy.hint}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <p className="m-0 mt-3 text-[11px] leading-relaxed text-muted-foreground">
                    {copy[22]}
                  </p>
                  {attachmentError && <p role="alert" className="m-0 mt-3 text-sm text-destructive">{attachmentError}</p>}
                  {attachments.length > 0 && (
                    <ul className="m-0 mt-4 grid list-none gap-2 p-0" aria-label="Selected RFQ files">
                      {attachments.map(({ file, kind, id }) => (
                        <li key={id} className="flex items-center justify-between gap-3 rounded-lg bg-secondary px-3.5 py-3 text-sm">
                          <span className="min-w-0">
                            <span className="block truncate text-foreground">{file.name}</span>
                            <span className="text-[11px] text-muted-foreground">{ATTACHMENT_COPY[kind].label} · {formatBytes(file.size)}</span>
                          </span>
                          <button type="button" onClick={() => removeAttachment(id)} className="shrink-0 cursor-pointer border-0 bg-transparent p-1 text-xs text-muted-foreground hover:text-foreground" aria-label={`Remove ${file.name}`}>
                            {copy[23]}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor={`${titleId}-website`}>Website</label>
                  <input id={`${titleId}-website`} name="website" tabIndex={-1} autoComplete="off" />
                </div>

                <label className="mt-5 flex items-start gap-3 text-[12px] leading-relaxed text-muted-foreground">
                  <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-foreground" />
                  <span>{copy[24]}</span>
                </label>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-4">
                  {status === "uploading" && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[25]} · {uploadProgress}%</p>}
                  {status === "submitting" && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[26]}</p>}
                  {status === "success" && reference && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[27]} · <strong className="text-foreground">{reference}</strong></p>}
                  {status === "fallback" && <p role="status" className="m-0 text-sm text-muted-foreground">{copy[28]}</p>}
                  {status === "error" && <p role="alert" className="m-0 text-sm text-destructive">{copy[29]}</p>}
                  <button type="submit" disabled={!canSubmit || status === "uploading" || status === "submitting" || status === "success"} className="flex h-12 items-center justify-center rounded-full bg-foreground px-7 text-[12px] font-semibold uppercase tracking-[0.06em] text-background transition-opacity disabled:cursor-not-allowed disabled:bg-[#d8d8d8] disabled:text-[#9c9c9c]">
                    {status === "uploading" ? `${copy[31]} ${uploadProgress}%` : status === "submitting" ? copy[32] : status === "success" ? copy[27] : copy[30]}
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
