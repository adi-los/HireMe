import React from "react";
import { Heading } from "@servicenow/react-components/Heading";
import { Button } from "@servicenow/react-components/Button";
import { RecordProvider } from "@servicenow/react-components/RecordContext";
import { FormColumnLayout } from "@servicenow/react-components/FormColumnLayout";
import { RelatedLists } from "@servicenow/react-components/RelatedLists";

interface Props {
  applicationId: string;
  onBack: () => void;
}

/**
 * CV and parsed profile for one Application (p.12).
 *
 * `NowRecordListConnected` has no query/filter prop in its own shipped
 * reference — despite what the SDK's ui-page-guide prose claims about a
 * `key`-based filtering trick — so a hand-filtered "CVDocument where
 * application_ref=X" panel isn't achievable with it; it would silently show
 * every CV in the app, not this one. `RelatedLists` inside a single
 * `RecordProvider` scoped to the Application is the real, correctly-scoped
 * mechanism: it surfaces CVDocument, CandidateProfile, ScoringResult and
 * InterviewSession as tabs automatically, via their reference field to this
 * record — no sys_id resolution needed. Not the literal two-column layout
 * blueprint p.12 describes, but the functionally correct version of it
 * given what this component library actually supports.
 */
export default function ApplicationDetail({ applicationId, onBack }: Props) {
  return (
    <div style={{ padding: "16px" }}>
      <Button label="Back to Applications" variant="tertiary" onClicked={onBack} />
      <Heading level={1} label="Candidate Review" />
      <RecordProvider table="x_winu_hireme_application" sysId={applicationId} isReadOnly={true}>
        <FormColumnLayout />
        <RelatedLists limit={5} />
      </RecordProvider>
    </div>
  );
}
