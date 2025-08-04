'use client';

import { useEffect, useState } from 'react';
import { backend } from './gooddata-backend';
import { workspaceCatalog } from '@gooddata/sdk-backend-base';

const WORKSPACE_ID = process.env.NEXT_PUBLIC_GD_WORKSPACE_ID;

export default function CatalogViewer() {
  const [attributes, setAttributes] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const catalog = await workspaceCatalog(backend, WORKSPACE_ID)
          .forTypes(['attribute', 'measure', 'fact'])
          .load();

        setAttributes(catalog.attributes());
        setMeasures(catalog.measures());
        setFacts(catalog.facts());
      } catch (error) {
        console.error('Failed to load catalog:', error);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, []);

  if (loading) return <p className="text-gray-600">Loading catalog...</p>;

  return (
    <div className="catalog-container">
      {/* Attributes */}
      <div className="catalog-column">
        <h3 className="catalog-title">Attributes</h3>
        <select className="catalog-select">
          {attributes.map((attr) => (
            <option key={attr.id} value={attr.id}>
              {attr.title}
            </option>
          ))}
        </select>
      </div>

      {/* Measures */}
      <div className="catalog-column">
        <h3 className="catalog-title">Measures</h3>
        <select className="catalog-select">
          {measures.map((measure) => (
            <option key={measure.id} value={measure.id}>
              {measure.title}
            </option>
          ))}
        </select>
      </div>

      {/* Facts */}
      <div className="catalog-column">
        <h3 className="catalog-title">Facts</h3>
        <select className="catalog-select">
          {facts.map((fact) => (
            <option key={fact.id} value={fact.id}>
              {fact.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
