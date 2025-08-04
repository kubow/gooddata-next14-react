"use client";

import dynamic from 'next/dynamic';

import { backend } from './gooddata-backend';
import { BackendProvider, WorkspaceProvider } from "@gooddata/sdk-ui";


//import { InsightView } from "@gooddata/sdk-ui-ext";
const InsightView = dynamic(() =>
  import('@gooddata/sdk-ui-ext').then((mod) => mod.InsightView), {
  ssr: false,
});

export default function GoodDataChart() {

  return (
    <BackendProvider backend={backend}>
      <div className="gooddata-chart">
        <WorkspaceProvider workspace={process.env.NEXT_PUBLIC_GD_WORKSPACE_ID}>
          <h2 className="text-xl font-semibold mb-2">Static Insight</h2>
          <InsightView insight={process.env.NEXT_PUBLIC_GD_INSIGHT_ID} />
        </WorkspaceProvider>
      </div>
    </BackendProvider>
  );
}
