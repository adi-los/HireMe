import React, { useEffect, useState } from "react";
import { Heading } from "@servicenow/react-components/Heading";
import { Loader } from "@servicenow/react-components/Loader";
import { fetchApplications } from "../services/tableApi";

interface Props {
  onOpenApplication: (sysId: string, number: string) => void;
}

/**
 * Entry list for the CV Viewer. Fetches directly via the Table API — see
 * `services/tableApi.ts` for why `NowRecordListConnected` doesn't work here.
 * `sysparm_display_value=all` means each field comes back as
 * `{ value, display_value }`; reference fields (candidate_ref, joboffer_ref)
 * use `display_value` for a readable name instead of a bare sys_id.
 */
export default function ApplicationList({ onOpenApplication }: Props) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications()
      .then(setRows)
      .catch(e => setError(e.message));
  }, []);

  return (
    <div style={{ padding: "16px" }}>
      <Heading level={1} label="Applications" />
      {error && <p>Could not load applications: {error}</p>}
      {!error && !rows && <Loader label="Loading applications..." />}
      {rows && rows.length === 0 && <p>No applications yet.</p>}
      {rows && rows.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #ccc" }}>
              <th style={{ padding: "8px" }}>Number</th>
              <th style={{ padding: "8px" }}>Candidate</th>
              <th style={{ padding: "8px" }}>Job Offer</th>
              <th style={{ padding: "8px" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr
                key={row.sys_id.value}
                onClick={() => onOpenApplication(row.sys_id.value, row.number.display_value || row.sys_id.value)}
                style={{ cursor: "pointer", borderBottom: "1px solid #eee" }}
              >
                <td style={{ padding: "8px" }}>{row.number.display_value || "—"}</td>
                <td style={{ padding: "8px" }}>{row.candidate_ref.display_value}</td>
                <td style={{ padding: "8px" }}>{row.joboffer_ref.display_value}</td>
                <td style={{ padding: "8px" }}>{row.status.display_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
