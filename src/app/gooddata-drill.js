"use client";

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';

import { backend } from './gooddata-backend';
import { BackendProvider, HeaderPredicates, WorkspaceProvider } from "@gooddata/sdk-ui";
import { 
  isCatalogAttribute, isCatalogMeasure, isCatalogFact, 
  attributeIdentifier, measureIdentifier, factIdentifier 
} from "@gooddata/sdk-model";

import * as Md from "./catalog";


//import { InsightView } from "@gooddata/sdk-ui-ext";
const InsightView = dynamic(() =>
  import('@gooddata/sdk-ui-ext').then((mod) => mod.InsightView), {
  ssr: false,
});

const WORKSPACE_ID = process.env.NEXT_PUBLIC_GD_WORKSPACE_ID;
// GoodData Insight identifiers (or refs) that you already have in the workspace:
const MONTHLY_INSIGHT = 'your_monthly_insight_id'; // e.g. groups by Month
const DAILY_INSIGHT   = 'your_daily_insight_id';   // e.g. groups by Day
// Display Form identifier of the Month label used in the monthly insight:
const MONTH_DF_ID = 'customer_created_date.month'; // <- make sure this matches your insight bucket
// ----------------------------------

export default function GoodDataSimpleDrill() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('monthly');
  const [monthFilter, setMonthFilter] = useState(null); // attribute filter on Month DF
  const [pickedLabel, setPickedLabel] = useState(null); // UX only

  useEffect(() => {
      backend
        .workspace(WORKSPACE_ID)
        .catalog()
        .load()
        .then((res) => {
          console.log('✅ Available Items list loaded:', res);
        })
        .catch((err) => {
          console.error('❌ Failed to load insights:', err);
          setError(err.message ?? 'Unknown error');
        })
        .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-600">Loading catalog...</p>;
  if (error) return <div className="text-red-600">Error: {error}</div>


  function handleDrill(event) {
    console.log('🔍 Drill event:', event);
    //const { drillContext } = event;
    const inter = event?.drillContext?.intersection ?? [];
    // Find the attribute header we drilled (the Month label)
    const hdr = inter
      .map(i => i.header)
      .find(h => h?.attributeHeaderItem && h?.attributeHeader);

    if (!hdr) return null;

    const dfIdentifier =
      hdr.attributeHeader.primaryLabel?.identifier ||
      hdr.attributeHeader.identifier;

    const value = hdr.attributeHeaderItem?.name;

    return { dfIdentifier, value };
  }

  return (
    <BackendProvider backend={backend}>
      <div className="gooddata-chart">
        <WorkspaceProvider workspace={process.env.NEXT_PUBLIC_GD_WORKSPACE_ID}>
          <h2 className="text-xl font-semibold mb-2">Simple Drill</h2>

            <InsightView 
              insight={Md.Insights.Vis1} 
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
                () => true, // EVERYTHING is drillable
                /* 
                HeaderPredicates.identifierMatch(attributeIdentifier(Md.ProductCategory)),
                HeaderPredicates.objMatch(Md.DateDatasets.CustomerCreatedDate.CustomerCreatedDateMonthYear),
                */
              ]}
            />
        </WorkspaceProvider>
      </div>
    </BackendProvider>
  );
}
