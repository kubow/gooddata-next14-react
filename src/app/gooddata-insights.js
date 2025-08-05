'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { backend } from './gooddata-backend'; // adjust this path
import { Spinner } from './spinner'; // own loader
import { InsightDetails } from './gooddata-insight-details';


const InsightView = dynamic(
  () => import('@gooddata/sdk-ui-ext').then((mod) => mod.InsightView),
  { ssr: false }
);

const WORKSPACE_ID = process.env.NEXT_PUBLIC_GD_WORKSPACE_ID;

export default function DynamicInsightSelector() {
  const [insights, setInsights] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    backend
      .workspace(WORKSPACE_ID)
      .insights()
      .getInsights()
      .then((res) => {
        //console.log('✅ Insights loaded:', res.items);
        const loaded = res.items.map((i) => i.insight);
        setInsights(loaded);

        if (loaded.length > 0) {
          setSelectedId(loaded[0].identifier);
          setSelectedInsight(loaded[0]);
        }
      })
      .catch((err) => {
        console.error('❌ Failed to load insights:', err);
        setError(err.message ?? 'Unknown error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectChange = (id) => {
    setSelectedId(id);
    console.log("selecting visual id:", id);
    const match = insights.find((i) => i.identifier === id);
    if (match) {
      setSelectedInsight(match);
    } else {
      setSelectedInsight(null);
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>
  if (insights.length == 0) return <div>No insights found in this workspace.</div>;

  return (
    <div className="insight-flex-container">
      {/* Left column: Insight selector */}
      <div className="insight-column">
        <h2>Insight Catalog</h2>
        <label htmlFor="insight-select" className="insight-label">
          Select Insight
        </label>
        <select
          id="insight-select"
          className="insight-select"
          value={selectedId ?? ''}
          onChange={(e) => handleSelectChange(e.target.value)}
        >
          {insights.map((i) => (
            <option key={i.identifier} value={i.identifier}>
              {i.title}
            </option>
          ))}
        </select>
      </div>

      {/* Right column: Insight details */}
      <div className="insight-column">
        <div className="insight-details-box">
          {selectedInsight ? (
            <InsightDetails insight={selectedInsight} />
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No insight selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}