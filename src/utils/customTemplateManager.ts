import { BusinessTemplate } from "@/data/business-templates";

export interface CustomTemplate extends BusinessTemplate {
  isCustom: true;
  createdAt: string;
  usageCount: number;
}

export interface CustomTemplateStorage {
  [key: string]: CustomTemplate;
}

const CUSTOM_TEMPLATES_KEY = 'customBusinessTemplates';

/**
 * Load all custom templates from localStorage
 */
export const loadCustomTemplates = (): CustomTemplate[] => {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!stored) return [];
    
    const templates: CustomTemplateStorage = JSON.parse(stored);
    return Object.values(templates);
  } catch (error) {
    console.error('Error loading custom templates:', error);
    return [];
  }
};

/**
 * Save a new custom template
 */
export const saveCustomTemplate = (template: Omit<CustomTemplate, 'isCustom' | 'createdAt' | 'usageCount'>): CustomTemplate => {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    const templates: CustomTemplateStorage = stored ? JSON.parse(stored) : {};
    
    const newTemplate: CustomTemplate = {
      ...template,
      isCustom: true,
      createdAt: new Date().toISOString(),
      usageCount: 0
    };
    
    templates[template.id] = newTemplate;
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    
    return newTemplate;
  } catch (error) {
    console.error('Error saving custom template:', error);
    throw error;
  }
};

/**
 * Update an existing custom template
 */
export const updateCustomTemplate = (id: string, updates: Partial<CustomTemplate>): CustomTemplate | null => {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!stored) return null;
    
    const templates: CustomTemplateStorage = JSON.parse(stored);
    
    if (!templates[id]) return null;
    
    templates[id] = {
      ...templates[id],
      ...updates
    };
    
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    return templates[id];
  } catch (error) {
    console.error('Error updating custom template:', error);
    return null;
  }
};

/**
 * Delete a custom template
 */
export const deleteCustomTemplate = (id: string): boolean => {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!stored) return false;
    
    const templates: CustomTemplateStorage = JSON.parse(stored);
    
    if (!templates[id]) return false;
    
    delete templates[id];
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    return true;
  } catch (error) {
    console.error('Error deleting custom template:', error);
    return false;
  }
};

/**
 * Increment usage count for a template
 */
export const incrementTemplateUsage = (id: string): void => {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!stored) return;
    
    const templates: CustomTemplateStorage = JSON.parse(stored);
    
    if (templates[id]) {
      templates[id].usageCount = (templates[id].usageCount || 0) + 1;
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(templates));
    }
  } catch (error) {
    console.error('Error incrementing template usage:', error);
  }
};

/**
 * Get a specific custom template by ID
 */
export const getCustomTemplate = (id: string): CustomTemplate | null => {
  try {
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (!stored) return null;
    
    const templates: CustomTemplateStorage = JSON.parse(stored);
    return templates[id] || null;
  } catch (error) {
    console.error('Error getting custom template:', error);
    return null;
  }
};

/**
 * Export all custom templates as JSON
 */
export const exportCustomTemplates = (): string => {
  const templates = loadCustomTemplates();
  return JSON.stringify(templates, null, 2);
};

/**
 * Import custom templates from JSON
 */
export const importCustomTemplates = (jsonString: string): boolean => {
  try {
    const imported: CustomTemplate[] = JSON.parse(jsonString);
    const stored = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    const existing: CustomTemplateStorage = stored ? JSON.parse(stored) : {};
    
    imported.forEach(template => {
      existing[template.id] = template;
    });
    
    localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(existing));
    return true;
  } catch (error) {
    console.error('Error importing custom templates:', error);
    return false;
  }
};
