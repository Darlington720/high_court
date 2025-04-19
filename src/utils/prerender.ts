import { fetchDocuments } from '../lib/documents';

export async function generateStaticParams() {
  const { data: years } = await fetchDocuments(
    { category: "Hansards" },
    { field: "created_at", direction: "desc" }
  );

  const uniqueYears = [...new Set(years.map(doc => 
    doc.subcategory.replace('Hansards ', '')
  ))];

  return uniqueYears.map(year => ({
    year: year.toString()
  }));
}