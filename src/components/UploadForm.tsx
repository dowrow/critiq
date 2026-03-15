"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useLang } from "@/context/LangContext";

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
    if (!ACCEPTED_EXTENSIONS.includes(ext) && !ACCEPTED_TYPES.includes(file.type)) {
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

  return (
    <div className="flex flex-col gap-6">
      {/* Drop zone */}
      <div
        className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-colors
          ${dragOver ? "border-amber-500 bg-amber-50" : "border-stone-300 bg-stone-50 hover:border-amber-400 hover:bg-amber-50/50"}`}
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
          className="sr-only"
          onChange={handleInputChange}
          aria-label={t.fileSelectorLabel}
        />

        <div className="text-5xl">📄</div>

        {selectedFile ? (
          <div className="text-center">
            <p className="font-semibold text-stone-800">{selectedFile.name}</p>
            <p className="text-sm text-stone-500 mt-1">
              {(selectedFile.size / 1024).toFixed(1)} KB · {t.dropzoneChange}
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="font-semibold text-stone-700">{t.dropzonePrompt}</p>
            <p className="text-sm text-stone-500 mt-1">{t.dropzoneHint}</p>
          </div>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading || !selectedFile}
        className={`w-full rounded-xl py-3 px-6 font-semibold text-white transition-all
          ${
            isLoading || !selectedFile
              ? "bg-stone-300 cursor-not-allowed"
              : "bg-amber-600 hover:bg-amber-700 active:scale-[0.98] shadow-md hover:shadow-lg"
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
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
