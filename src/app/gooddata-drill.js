"use client";

import dynamic from 'next/dynamic';

import { backend } from './gooddata-backend';
import { BackendProvider, WorkspaceProvider } from "@gooddata/sdk-ui";
import { HeaderPredicates } from "@gooddata/sdk-ui";


//import { InsightView } from "@gooddata/sdk-ui-ext";
const InsightView = dynamic(() =>
  import('@gooddata/sdk-ui-ext').then((mod) => mod.InsightView), {
  ssr: false,
});

export default function GoodDataSimpleDrill() {

  return (
    <BackendProvider backend={backend}>
      <div className="gooddata-chart">
        <WorkspaceProvider workspace={process.env.NEXT_PUBLIC_GD_WORKSPACE_ID}>
          <h2 className="text-xl font-semibold mb-2">Simple Drill</h2>
          <InsightView 
            insight={process.env.NEXT_PUBLIC_GD_INSIGHT_ID}
            config={{
                //colors: ["rgb(195, 49, 73)", "rgb(168, 194, 86)"],
                legend: {
                    enabled: true,
                    position: "bottom"
                }
            }}
            onDrill={(event) => { console.log(event.dataView); }}
            drillableItems={[
                  HeaderPredicates.identifierMatch("drillable-Identifier1"),
                  HeaderPredicates.uriMatch("/drillable-Uri2")
            ]}
          />
        </WorkspaceProvider>
      </div>
    </BackendProvider>
  );
}
