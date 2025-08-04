'use client';

import React from 'react';

export function InsightDetails({ insight }) {
  if (!insight) return <p>No insight selected.</p>;
  {console.log("here is the selected item:", insight)}

  const renderMeasures = () => {
    return insight.buckets
      .filter(bucket => bucket.localIdentifier === 'measures')
      .flatMap(bucket =>
        bucket.items.map((item, idx) => {
          const m = item.measure;
          const def = m.definition?.measureDefinition || m.definition?.popMeasureDefinition || {};
          const source = def?.item?.identifier || '(derived)';
          return (
            <li key={idx} className="mb-1">
              <strong>{m.title}</strong> — <em>{def.aggregation || 'custom'}</em> on <code>{source}</code>
              {m.format && <span className="ml-2">[Format: <code>{m.format}</code>]</span>}
            </li>
          );
        })
      );
  };

  const renderAttributes = () => {
    return insight.buckets
      .filter(bucket => bucket.localIdentifier === 'attribute' || bucket.localIdentifier === 'view')
      .flatMap(bucket =>
        bucket.items.map((item, idx) => {
          const attr = item.attribute;
          return (
            <li key={idx}>
              {attr.localIdentifier} → <code>{attr.displayForm.identifier}</code>
            </li>
          );
        })
      );
  };

  const renderTotals = () => {
    return insight.buckets
      .filter(bucket => Array.isArray(bucket.totals) && bucket.totals.length > 0)
      .flatMap((bucket, idx) =>
        bucket.totals.map((total, tIdx) => (
          <li key={`${idx}-${tIdx}`}>
            <strong>{total.type}</strong> of <code>{total.measureIdentifier}</code> by <code>{total.attributeIdentifier}</code>
          </li>
        ))
      );
  };

  const renderFilters = () => {
    return insight.filters.map((f, idx) => {
      if (f.absoluteDateFilter) {
        const { dataSet, from, to } = f.absoluteDateFilter;
        return (
          <li key={idx}>
            Date filter on <code>{dataSet.identifier}</code>: <strong>{from}</strong> → <strong>{to}</strong>
          </li>
        );
      }
      if (f.relativeDateFilter) {
        const { dataSet, from, to, granularity } = f.relativeDateFilter;
        return (
          <li key={idx}>
            Relative filter on <code>{dataSet.identifier}</code> ({granularity}): <strong>{from}</strong> → <strong>{to}</strong>
          </li>
        );
      }
      return <li key={idx}>Unknown filter type</li>;
    });
  };

  const renderSorts = () => {
    return insight.sorts.map((s, idx) => {
      if (s.attributeSortItem) {
        return (
          <li key={idx}>
            Sort <code>{s.attributeSortItem.attributeIdentifier}</code> → <strong>{s.attributeSortItem.direction}</strong>
          </li>
        );
      }
      return <li key={idx}>Unknown sort type</li>;
    });
  };

  return (
    <div className="space-y-4 text-sm w-full break-words">
      <h2 className="text-lg font-semibold">{insight.title}</h2>

      <p>
        <strong>Visualization Type:</strong>{' '}
        <code className="bg-gray-100 px-1 rounded">{insight.visualizationUrl}</code>
      </p>

      <p>
        <strong>Ref:</strong>{' '}
        <code className="bg-gray-100 px-1 rounded">{insight.ref?.identifier}</code>
      </p>

      <section>
        <h3 className="font-medium mt-4">Measures</h3>
        <ul className="list-disc list-inside space-y-1">{renderMeasures()}</ul>
      </section>

      <section>
        <h3 className="font-medium mt-4">Attributes</h3>
        <ul className="list-disc list-inside space-y-1">{renderAttributes()}</ul>
      </section>

      {renderTotals().length > 0 && (
        <section>
          <h3 className="font-medium mt-4">Totals</h3>
          <ul className="list-disc list-inside space-y-1">{renderTotals()}</ul>
        </section>
      )}

      {insight.filters?.length > 0 && (
        <section>
          <h3 className="font-medium mt-4">Filters</h3>
          <ul className="list-disc list-inside space-y-1">{renderFilters()}</ul>
        </section>
      )}

      {insight.sorts?.length > 0 && (
        <section>
          <h3 className="font-medium mt-4">Sorts</h3>
          <ul className="list-disc list-inside space-y-1">{renderSorts()}</ul>
        </section>
      )}
    </div>
  );
}
