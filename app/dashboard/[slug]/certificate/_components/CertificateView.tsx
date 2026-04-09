"use client";

import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Download, Award } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

interface Props {
  userName: string;
  courseTitle: string;
  completionDate: string;
  courseSlug: string;
}

export function CertificateView({
  userName,
  courseTitle,
  completionDate,
  courseSlug,
}: Props) {
  const certRef = useRef<HTMLDivElement>(null);

  // Print the certificate (browser print = save as PDF works natively)
  function handleDownload() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">

      {/* ── Actions bar (hidden when printing) ──────────────────────── */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/dashboard/${courseSlug}`}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Course
        </Link>

        <Button onClick={handleDownload}>
          <Download className="size-4 mr-2" />
          Download as PDF
        </Button>
      </div>

      {/* ── Certificate card ─────────────────────────────────────────── */}
      <div
        ref={certRef}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border-8 border-primary/20 p-12 print:shadow-none print:border-8 print:rounded-none"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {/* Top decoration line */}
        <div className="w-full h-2 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-full mb-10" />

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="size-10 text-primary" />
            <span className="text-2xl font-bold text-primary tracking-wide">
              ShatouLMS
            </span>
          </div>
          <h1
            className="text-4xl font-bold text-gray-800 tracking-wide uppercase mb-2"
            style={{ letterSpacing: "0.15em" }}
          >
            Certificate of Completion
          </h1>
          <p className="text-gray-500 text-lg">
            This certificate is proudly presented to
          </p>
        </div>

        {/* Recipient name */}
        <div className="text-center mb-8">
          <p
            className="text-5xl text-primary font-bold"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {userName}
          </p>
          <div className="w-64 h-px bg-gray-300 mx-auto mt-4" />
        </div>

        {/* Body text */}
        <div className="text-center mb-10 space-y-2">
          <p className="text-gray-600 text-lg">
            has successfully completed the course
          </p>
          <p className="text-2xl font-bold text-gray-800 px-8">
            &ldquo;{courseTitle}&rdquo;
          </p>
          <p className="text-gray-500 text-base">
            on {completionDate}
          </p>
        </div>

        {/* What they demonstrated */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10 text-center">
          <p className="text-gray-600 text-sm leading-relaxed">
            By completing this course, the recipient has demonstrated dedication
            to continuous learning and the acquisition of valuable skills
            through the ShatouLMS platform.
          </p>
        </div>

        {/* Signature row */}
        <div className="flex items-end justify-between mt-10">
          <div className="text-center">
            <div className="w-48 h-px bg-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-semibold">
              ShatouLMS Platform
            </p>
            <p className="text-xs text-gray-400">Authorized Signature</p>
          </div>

          <div className="text-center">
            <div className="w-32 h-32 rounded-full border-4 border-primary/30 flex items-center justify-center mx-auto mb-2 bg-primary/5">
              <Award className="size-12 text-primary/60" />
            </div>
            <p className="text-xs text-gray-400">Official Seal</p>
          </div>

          <div className="text-center">
            <div className="w-48 h-px bg-gray-400 mb-2" />
            <p className="text-sm text-gray-600 font-semibold">
              {completionDate}
            </p>
            <p className="text-xs text-gray-400">Date of Completion</p>
          </div>
        </div>

        {/* Bottom decoration line */}
        <div className="w-full h-2 bg-gradient-to-r from-primary via-primary/60 to-primary rounded-full mt-10" />
      </div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\\:hidden { display: none !important; }
          [ref="certRef"], [ref="certRef"] * { visibility: visible; }
          @page { size: landscape; margin: 0.5cm; }
        }
      `}</style>
    </div>
  );
}