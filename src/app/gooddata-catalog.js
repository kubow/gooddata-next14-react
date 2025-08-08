'use client';

import { useEffect, useState } from 'react';
import { backend } from './gooddata-backend';
import { isCatalogAttribute, isCatalogMeasure, isCatalogFact } from "@gooddata/sdk-model";

const WORKSPACE_ID = process.env.NEXT_PUBLIC_GD_WORKSPACE_ID;

export default function CatalogViewer() {
  const [attributes, setAttributes] = useState([]);
  const [measures, setMeasures] = useState([]);
  const [facts, setFacts] = useState([]);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [selectedMeasure, setSelectedMeasure] = useState(null);
  const [selectedFact, setSelectedFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
      backend
        .workspace(WORKSPACE_ID)
        .catalog()
        .load()
        .then((res) => {
          console.log('✅ Catalog loaded:', res);
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
      
      {/* Attributes Column */}
      <div className="catalog-column">
        <h3 className="catalog-title">Attributes</h3>
        <select
          className="catalog-select"
          onChange={(e) => {
            const match = attributes.find(attr => attr.attribute?.id === e.target.value);
            setSelectedAttribute(match || null);
          }}
        >
          <option value="">-- Select Attribute --</option>
          {attributes.map((attr) => {
            const displayForm = attr.attribute?.displayForms?.[0];
            return (
              <option
                key={displayForm?.id ?? attr.attribute.id}
                value={attr.attribute.id}
              >
                {displayForm?.title ?? attr.attribute.title}
              </option>
            );
          })}
        </select>
        {selectedAttribute && (
          <div className="catalog-details">
            <p><strong>Title:</strong> {selectedAttribute.attribute.title}</p>
            <p><strong>ID:</strong> {selectedAttribute.attribute.id}</p>
            <p><strong>Tags:</strong> {selectedAttribute.attribute.tags?.join(', ') || 'None'}</p>
          </div>
        )}
      </div>

      {/* Measures Column */}
      <div className="catalog-column">
        <h3 className="catalog-title">Measures</h3>
        <select
          className="catalog-select"
          onChange={(e) => {
            const match = measures.find(measure => measure.measure.id === e.target.value);
            setSelectedMeasure(match || null);
          }}
        >
          <option value="">-- Select Measure --</option>
          {measures.map((measure) => (
            <option key={measure.measure.id} value={measure.measure.id}>
              {measure.measure.title}
            </option>
          ))}
        </select>
        {selectedMeasure && (
          <div className="catalog-details">
            <p><strong>Title:</strong> {selectedMeasure.measure.title}</p>
            <p><strong>ID:</strong> {selectedMeasure.measure.id}</p>
            <p><strong>Expression:</strong> {selectedMeasure.measure.expression}</p>
            <p><strong>Description:</strong> {selectedMeasure.measure.description}</p>
            <p><strong>Tags:</strong> {selectedMeasure.measure.tags?.join(', ') || 'None'}</p>
          </div>
        )}
      </div>

      {/* Facts Column */}
      <div className="catalog-column">
        <h3 className="catalog-title">Facts</h3>
        <select
          className="catalog-select"
          onChange={(e) => {
            const match = facts.find(fact => fact.fact.id === e.target.value);
            setSelectedFact(match || null);
          }}
        >
          <option value="">-- Select Fact --</option>
          {facts.map((fact) => (
            <option key={fact.fact.id} value={fact.fact.id}>
              {fact.fact.title}
            </option>
          ))}
        </select>
        {selectedFact && (
          <div className="catalog-details">
            <p><strong>Title:</strong> {selectedFact.fact.title}</p>
            <p><strong>ID:</strong> {selectedFact.fact.id}</p>
            <p><strong>Tags:</strong> {selectedFact.fact.tags?.join(', ') || 'None'}</p>
          </div>
        )}
      </div>

    </div>
)};