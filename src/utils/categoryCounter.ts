import { weightComparisons, categorizeItem } from './weightComparisons';

export const getCategoryCounts = (enabledCategories?: string[]) => {
  const counts: Record<string, number> = {};
  
  // Filter comparisons by enabled categories if provided
  let filteredComparisons = weightComparisons;
  if (enabledCategories && enabledCategories.length > 0) {
    filteredComparisons = weightComparisons.filter(item => {
      const category = categorizeItem(item.name);
      return enabledCategories.includes(category);
    });
  }
  
  filteredComparisons.forEach(item => {
    const category = categorizeItem(item.name);
    counts[category] = (counts[category] || 0) + 1;
  });
  
  return counts;
};

export const getCategoryItems = (category: string, enabledCategories?: string[]) => {
  // Filter comparisons by enabled categories if provided
  let filteredComparisons = weightComparisons;
  if (enabledCategories && enabledCategories.length > 0) {
    filteredComparisons = weightComparisons.filter(item => {
      const itemCategory = categorizeItem(item.name);
      return enabledCategories.includes(itemCategory);
    });
  }
  
  return filteredComparisons.filter(item => categorizeItem(item.name) === category);
};