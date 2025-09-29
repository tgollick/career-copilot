"use client";

import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type CoverLetterPDFProps = {
  coverLetter: string;
  candidateName?: string;
  candidateContact?: string;
  jobTitle?: string;
  companyName?: string;
  date?: string;
};

const styles = StyleSheet.create({
  page: {
    padding: "60pt 65pt 50pt 65pt",
    fontSize: 10.5,
    fontFamily: "Helvetica",
    lineHeight: 1.6,
    backgroundColor: "#ffffff",
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: "1.5pt solid #2c3e50",
  },
  candidateName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#2c3e50",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  candidateContact: {
    fontSize: 9,
    color: "#5a5a5a",
    lineHeight: 1.4,
  },
  date: {
    fontSize: 10,
    color: "#5a5a5a",
    marginTop: 20,
    marginBottom: 20,
  },
  recipientBlock: {
    marginBottom: 20,
    paddingLeft: 3,
    borderLeft: "3pt solid #2c3e50",
    paddingVertical: 4,
  },
  recipientLine: {
    fontSize: 10.5,
    color: "#2c3e50",
    marginBottom: 2,
    marginLeft: 8,
    fontFamily: "Helvetica-Bold",
  },
  salutation: {
    fontSize: 10.5,
    color: "#1a1a1a",
    marginBottom: 14,
    marginTop: 6,
  },
  bodyText: {
    fontSize: 10.5,
    color: "#2a2a2a",
    marginBottom: 11,
    textAlign: "justify",
    lineHeight: 1.65,
  },
  closing: {
    fontSize: 10.5,
    color: "#1a1a1a",
    marginTop: 16,
    marginBottom: 3,
  },
  signature: {
    fontSize: 10.5,
    color: "#2c3e50",
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 35,
    left: 65,
    right: 65,
    fontSize: 7.5,
    textAlign: "center",
    color: "#999999",
    paddingTop: 8,
    borderTop: "0.5pt solid #e5e5e5",
  },
});

export const CoverLetterDocument = ({
  coverLetter,
  candidateName,
  candidateContact,
  jobTitle,
  companyName,
  date = new Date().toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }),
}: CoverLetterPDFProps) => {
  const lines = coverLetter.split("\n").filter((line) => line.trim());
  const bodyParagraphs: string[] = [];
  let salutation = "Dear Hiring Manager,";
  let closing = "Sincerely,";

  const salutationIndex = lines.findIndex((line) =>
    line.trim().startsWith("Dear")
  );
  if (salutationIndex !== -1) {
    salutation = lines[salutationIndex];
  }

  const closingIndex = lines.findIndex((line) =>
    /^(Sincerely|Best regards|Kind regards|Yours sincerely|Respectfully)/i.test(
      line.trim()
    )
  );

  const startIndex = salutationIndex !== -1 ? salutationIndex + 1 : 0;
  const endIndex = closingIndex !== -1 ? closingIndex : lines.length;

  for (let i = startIndex; i < endIndex; i++) {
    const line = lines[i].trim();
    if (
      line &&
      !line.startsWith("Dear") &&
      !/^(Sincerely|Best regards|Kind regards|Yours sincerely|Respectfully)/i.test(
        line
      )
    ) {
      bodyParagraphs.push(line);
    }
  }

  if (closingIndex !== -1) {
    closing = lines[closingIndex];
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.candidateName}>
            {candidateName?.toUpperCase()}
          </Text>
          <Text style={styles.candidateContact}>{candidateContact}</Text>
        </View>

        {/* Date */}
        <Text style={styles.date}>{date}</Text>

        {/* Recipient */}
        <View style={styles.recipientBlock}>
          <Text style={styles.recipientLine}>{jobTitle}</Text>
          <Text style={styles.recipientLine}>{companyName}</Text>
        </View>

        {/* Salutation */}
        <Text style={styles.salutation}>{salutation}</Text>

        {/* Body */}
        {bodyParagraphs.map((paragraph, idx) => (
          <Text key={idx} style={styles.bodyText}>
            {paragraph}
          </Text>
        ))}

        {/* Closing */}
        <Text style={styles.closing}>{closing}</Text>
        <Text style={styles.signature}>{candidateName}</Text>

        {/* Footer */}
        <Text style={styles.footer}>Generated via CareerCopilot</Text>
      </Page>
    </Document>
  );
};
