"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
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

  function handleFileSelect(file: File) {
    const error = validateFile(file);
    if (error) {
      onError(error);
      return;
    }
    setSelectedFile(file);
    onError("");
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

  async function handleSubmit() {
    if (!selectedFile) {
      onError(t.noFileError);
      return;
    }

    onLoading(true);
    onError("");
    onResult(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

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

  const dropzoneClass = `${styles.dropzone} ${
    dragOver ? styles.dropzoneOver : styles.dropzoneDefault
  }`;

  const submitBtnClass = `${styles.submitBtn} ${
    isLoading || !selectedFile ? styles.submitBtnDisabled : styles.submitBtnActive
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

        {selectedFile ? (
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
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !selectedFile}
        className={submitBtnClass}
      >
        {isLoading ? (
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
        ) : (
          t.submitButton
        )}
      </button>
    </div>
  );
}
