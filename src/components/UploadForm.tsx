"use client";

import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from "react";
import { useLang } from "@/context/LangContext";
import styles from "./UploadForm.module.css";

interface UploadFormProps {
  onResult: (result: unknown) => void;
  onError: (error: string) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".doc", ".txt"];

export default function UploadForm({
  onResult,
  onError,
  onLoading,
  isLoading,
}: UploadFormProps) {
  const { t } = useLang();
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [urlValue, setUrlValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (
      !ACCEPTED_EXTENSIONS.includes(ext) &&
      !ACCEPTED_TYPES.includes(file.type)
    ) {
      return t.unsupportedFormat(ext);
    }
    if (file.size > 50 * 1024 * 1024) {
      return t.fileTooLarge;
    }
    return null;
  }

  async function submitFile(file: File) {
    onLoading(true);
    onError("");
    onResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error ?? t.unknownError);
      } else {
        onResult(data);
      }
    } catch {
      onError(t.networkError);
    } finally {
      onLoading(false);
    }
  }

  async function submitUrl(url: string) {
    onLoading(true);
    onError("");
    onResult(null);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        onError(data.error ?? t.unknownError);
      } else {
        onResult(data);
      }
    } catch {
      onError(t.networkError);
    } finally {
      onLoading(false);
    }
  }

  function handleFileSelect(file: File) {
    const error = validateFile(file);
    if (error) {
      onError(error);
      return;
    }
    setSelectedFile(file);
    setUrlValue("");
    onError("");
    submitFile(file);
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleUrlSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = urlValue.trim();
    if (!trimmed) return;

    try {
      new URL(trimmed);
    } catch {
      onError(t.invalidUrl);
      return;
    }

    setSelectedFile(null);
    onError("");
    submitUrl(trimmed);
  }

  const dropzoneClass = `${styles.dropzone} ${
    dragOver ? styles.dropzoneOver : styles.dropzoneDefault
  }`;

  return (
    <div className={styles.form}>
      {/* Drop zone */}
      <div
        className={dropzoneClass}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        aria-label={t.dropzoneLabel}
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          className={styles.srOnly}
          onChange={handleInputChange}
          aria-label={t.fileSelectorLabel}
        />

        <div className={styles.icon}>📄</div>

        {isLoading && !urlValue ? (
          <div className={styles.loadingInfo}>
            <p className={styles.fileName}>{selectedFile?.name}</p>
            <span className={styles.spinner}>
              <svg
                className={styles.spinnerIcon}
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  style={{ opacity: 0.25 }}
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  style={{ opacity: 0.75 }}
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              {t.evaluating}
            </span>
          </div>
        ) : selectedFile ? (
          <div className={styles.fileInfo}>
            <p className={styles.fileName}>{selectedFile.name}</p>
            <p className={styles.fileMeta}>
              {(selectedFile.size / 1024).toFixed(1)} KB · {t.dropzoneChange}
            </p>
          </div>
        ) : (
          <div className={styles.prompt}>
            <p className={styles.promptText}>{t.dropzonePrompt}</p>
            <p className={styles.promptHint}>{t.dropzoneHint}</p>
            <button
              type="button"
              className={styles.selectBtn}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              {t.selectFile}
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>{t.orDivider}</span>
        <span className={styles.dividerLine} />
      </div>

      {/* URL input */}
      <form className={styles.urlForm} onSubmit={handleUrlSubmit}>
        <div className={styles.urlIcon}>🔗</div>
        <input
          type="url"
          className={styles.urlInput}
          placeholder={t.urlPlaceholder}
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          disabled={isLoading}
          aria-label={t.urlLabel}
        />
        <button
          type="submit"
          className={styles.urlBtn}
          disabled={isLoading || !urlValue.trim()}
        >
          {isLoading && urlValue ? (
            <svg
              className={styles.spinnerIcon}
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                style={{ opacity: 0.25 }}
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                style={{ opacity: 0.75 }}
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            t.evaluateUrl
          )}
        </button>
      </form>
    </div>
  );
}
