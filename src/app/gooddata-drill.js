"use client";

import dynamic from 'next/dynamic';

import { backend } from './gooddata-backend';
import { BackendProvider,HeaderPredicates, WorkspaceProvider } from "@gooddata/sdk-ui";

import * as Md from "./catalog";


//import { InsightView } from "@gooddata/sdk-ui-ext";
const InsightView = dynamic(() =>
  import('@gooddata/sdk-ui-ext').then((mod) => mod.InsightView), {
  ssr: false,
});

export default function GoodDataSimpleDrill() {

  function handleDrill(event) {
    console.log('🔍 Drill event:', event);
    const { drillContext } = event;
    const measureTitle = drillContext.intersection[0].title;
    const attributeValue = drillContext.intersection[1]?.title;

    alert(`You drilled into ${measureTitle} for ${attributeValue}`);
  }

  return (
    <BackendProvider backend={backend}>
      <div className="gooddata-chart">
        <WorkspaceProvider workspace={process.env.NEXT_PUBLIC_GD_WORKSPACE_ID}>
          <h2 className="text-xl font-semibold mb-2">Simple Drill</h2>
            <InsightView 
              insight={Md.Insights.GrossProfitMarginDetail} 
              //process.env.NEXT_PUBLIC_GD_INSIGHT_ID
              config={{
                  //colors: ["rgb(195, 49, 73)", "rgb(168, 194, 86)"],
                  legend: {
                      enabled: true,
                      position: "bottom"
                  }
              }}
              onDrill={handleDrill}
              drillableItems={[
                    HeaderPredicates.identifierMatch(Md.CustomerState)
              ]}
            />
        </WorkspaceProvider>
      </div>
    </BackendProvider>
  );
}
