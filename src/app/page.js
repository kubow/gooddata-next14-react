"use client";
export const dynamic = "force-dynamic";

import CatalogViewer from "./gooddata-catalog";
import GoodDataChart from "./gooddata-chart";
import GoodDataSimpleDrill from "./gooddata-drill";
import DynamicInsightSelector from "./gooddata-insights";

export default function Home() {
  return (
    <div id="main">
      <header className="site-header py-4 px-6 border-b flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold">Drilling Showcase</h1>
        <nav className="flex gap-4 mt-2 md:mt-0">
          <a href="#static" className="nav-link hover:underline">Static Insight</a>
          <a href="#insight_catalog" className="nav-link hover:underline">Insight Catalog</a>
          <a href="#simple_drill" className="nav-link hover:underline">Simple Drill</a>
          <a href="#full_catalog" className="nav-link hover:underline">Full Catalog</a>
        </nav>
      </header>

      <main className="px-6 py-10 space-y-12">
        <section id="static" className="data-visualization">
          <GoodDataChart />
        </section>

        <section id="insight_catalog" className="data-visualization">
          <DynamicInsightSelector />
        </section>

        <section id="simple_drill" className="data-visualization">
          <GoodDataSimpleDrill />
        </section>

        <section id="full_catalog" className="data-visualization">
          <h2 className="text-2xl font-semibold mb-4">Full Catalog</h2>
          <CatalogViewer />
        </section>
      </main>

      <footer className="py-4 border-t mt-8 text-sm text-center">
        <div>Connected to: {process.env.NEXT_PUBLIC_GD_HOSTNAME}</div>
      </footer>
    </div>
  );
}
