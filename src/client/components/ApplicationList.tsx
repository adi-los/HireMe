import React from "react";
import { NowRecordListConnected } from "@servicenow/react-components/NowRecordListConnected";
import { Heading } from "@servicenow/react-components/Heading";

interface Props {
  onOpenApplication: (sysId: string, number: string) => void;
}

/**
 * Entry list for the CV Viewer. Recruiters open a specific application from
 * here; creating a new Application from this tool isn't a supported flow
 * (that's the candidate-portal apply endpoint), so the "New" action is
 * hidden rather than wired to nothing.
 */
export default function ApplicationList({ onOpenApplication }: Props) {
  return (
    <div style={{ padding: "16px" }}>
      <Heading level={1} label="Applications" />
      <NowRecordListConnected
        table="x_winu_hireme_application"
        listTitle="Applications"
        columns="number,candidate_ref,joboffer_ref,status,applied_date"
        limit={25}
        view="workspace"
        hideHeader={true}
        onRowClicked={e => {
          const payload = e.detail.payload;
          // `displayValue` is the table's configured display column
          // (`number`, for Application) — no separate `.number` field on
          // this payload.
          onOpenApplication(payload.sys_id, payload.row.displayValue.value || payload.sys_id);
        }}
      />
    </div>
  );
}
