import React, { useState, useEffect, useCallback } from "react";
import ApplicationList from "./components/ApplicationList";
import ApplicationDetail from "./components/ApplicationDetail";

/**
 * CV Viewer (blueprint p.12): "Inline document preview next to the parsed
 * structured profile — skills, experience, education — side by side."
 *
 * Two views, URL-addressable per the UI Page guide's navigation rules:
 *   ?view=list                 — applications, click a row to open one
 *   ?view=detail&id=<sys_id>   — that application's CV text + parsed profile
 */

interface ViewState {
  view: string;
  applicationId: string | null;
}

function getViewFromUrl(): ViewState {
  const params = new URLSearchParams(window.location.search);
  return {
    view: params.get("view") || "list",
    applicationId: params.get("id") || null,
  };
}

export default function App() {
  const [current, setCurrent] = useState<ViewState>(getViewFromUrl);

  useEffect(() => {
    const onPopState = () => setCurrent(getViewFromUrl());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateToView = useCallback(
    (view: string, applicationId: string | null, title: string) => {
      const params = new URLSearchParams({ view });
      if (applicationId) params.set("id", applicationId);
      const relativePath = `${window.location.pathname}?${params}`;
      const pageTitle = `HireMe — ${title}`;

      if (window.self !== window.top) {
        (window as any).CustomEvent.fireTop("magellanNavigator.permalink.set", {
          relativePath,
          title: pageTitle,
        });
      }
      window.history.pushState({ view, applicationId }, "", relativePath);
      document.title = pageTitle;
      setCurrent({ view, applicationId });
    },
    []
  );

  if (current.view === "detail" && current.applicationId) {
    return (
      <ApplicationDetail
        applicationId={current.applicationId}
        onBack={() => navigateToView("list", null, "Applications")}
      />
    );
  }

  return (
    <ApplicationList
      onOpenApplication={(id, number) =>
        navigateToView("detail", id, `Application ${number}`)
      }
    />
  );
}
