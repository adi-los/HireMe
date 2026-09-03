import React, { useEffect, useState } from "react";
import { Heading } from "@servicenow/react-components/Heading";
import { Button } from "@servicenow/react-components/Button";
import { Card } from "@servicenow/react-components/Card";
import { Loader } from "@servicenow/react-components/Loader";
import {
  fetchApplicationHeader,
  fetchCvDocumentForApplication,
  fetchProfileForApplication,
} from "../services/tableApi";

interface Props {
  applicationId: string;
  onBack: () => void;
}

/**
 * CV text and parsed profile side by side, for one Application (p.12).
 * Table API direct — see `services/tableApi.ts` for why `RecordProvider` /
 * `RelatedLists` don't work here.
 */
export default function ApplicationDetail({ applicationId, onBack }: Props) {
  const [header, setHeader] = useState<any | null>(null);
  const [cv, setCv] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetchApplicationHeader(applicationId),
      fetchCvDocumentForApplication(applicationId),
      fetchProfileForApplication(applicationId),
    ])
      .then(([h, c, p]) => {
        setHeader(h);
        setCv(c);
        setProfile(p);
      })
      .catch(e => setError(e.message));
  }, [applicationId]);

  return (
    <div style={{ padding: "16px" }}>
      <Button label="Back to Applications" variant="tertiary" onClicked={onBack} />
      <Heading level={1} label={header ? `Candidate Review — ${header.number.display_value}` : "Candidate Review"} />

      {error && <p>Could not load this application: {error}</p>}
      {!error && !header && <Loader label="Loading..." />}

      {header && (
        <div style={{ marginBottom: "16px" }}>
          <p>
            <strong>Candidate:</strong> {header.candidate_ref.display_value} &nbsp;|&nbsp;
            <strong> Job Offer:</strong> {header.joboffer_ref.display_value} &nbsp;|&nbsp;
            <strong> Status:</strong> {header.status.display_value}
          </p>
        </div>
      )}

      {header && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <Card>
            <Heading level={2} label="CV" />
            {!cv && <p>No CV on file.</p>}
            {cv && (
              <>
                <p>
                  <strong>{cv.file_name.display_value}</strong> — OCR: {cv.ocr_status.display_value}
                </p>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                  {cv.raw_text.display_value || "(no extracted text yet)"}
                </pre>
              </>
            )}
          </Card>
          <Card>
            <Heading level={2} label="Parsed Profile" />
            {!profile && <p>No parsed profile yet.</p>}
            {profile && (
              <>
                <p>
                  <strong>Experience:</strong> {profile.experience_years.display_value} years
                </p>
                <p>
                  <strong>Education:</strong> {profile.education.display_value || "—"}
                </p>
                <p>
                  <strong>Data confidence:</strong> {profile.data_confidence.display_value}
                </p>
                <p>
                  <strong>Skills:</strong> {formatSkills(profile.skills.display_value)}
                </p>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}

function formatSkills(rawJson: string): string {
  if (!rawJson) return "—";
  try {
    const skills = JSON.parse(rawJson);
    return Array.isArray(skills) ? skills.join(", ") : rawJson;
  } catch {
    return rawJson;
  }
}
