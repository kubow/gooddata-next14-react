'use client';

import { useEffect, useState } from 'react';
import { backend } from './gooddata-backend';
import { isCatalogAttribute, isCatalogMeasure, isCatalogFact } from "@gooddata/sdk-model";

const WORKSPACE_ID = process.env.NEXT_PUBLIC_GD_WORKSPACE_ID;

export default function CatalogViewer() {
  const [attributes, setAttributes] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      backend
        .workspace(WORKSPACE_ID)
        .catalog()
        .load()
        .then((res) => {
          console.log('✅ Catalog loaded:', res.items);
          setAttributes(res.items.filter(isCatalogAttribute));
          setMeasures(res.items.filter(isCatalogMeasure));
          setFacts(res.items.filter(isCatalogFact));
        })
        .catch((err) => {
          console.error('❌ Failed to load insights:', err);
          setError(err.message ?? 'Unknown error');
        })
        .finally(() => setLoading(false));
    }, []);

  if (loading) return <p className="text-gray-600">Loading catalog...</p>;
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <div className="catalog-container">
      {/* Attributes */}
      <div className="catalog-column">
        <h3 className="catalog-title">Attributes</h3>
        <select className="catalog-select">
          {attributes.map((attr) => {
            // The attribute object contains displayForms — pick the first one (or map them all)
            const displayForm = attr.attribute?.displayForms?.[0];
            return (
              <option
                key={displayForm?.id ?? attr.attribute.id}
                value={displayForm?.id ?? attr.attribute.id}
              >
                {displayForm?.title ?? attr.attribute.title}
              </option>
            );
          })}
        </select>
      </div>

      {/* Measures */}
      <div className="catalog-column">
        <h3 className="catalog-title">Measures</h3>
        <select className="catalog-select">
          {measures.map((measure) => (
            <option key={measure.measure.id} value={measure.measure.id}>
              {measure.measure.title}
            </option>
          ))}
        </select>
      </div>

      {/* Facts */}
      <div className="catalog-column">
        <h3 className="catalog-title">Facts</h3>
        <select className="catalog-select">
          {facts.map((fact) => (
            <option key={fact.fact.id} value={fact.fact.id}>
              {fact.fact.title}
            </option>
          ))}
        </select>
      </div>
    </div>
)};