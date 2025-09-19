import { IntakeFormData } from '../types';

const API_ENDPOINT = 'https://n8nchrischowai.zeabur.app/webhook/1c39608f-289e-45ce-bb1c-7f0bbf5730c2';

export const buildPayload = (formData: IntakeFormData) => {
  return {
    jobTitle: formData.jobTitle,
    numberOfProfiles: formData.numberOfProfiles,
    batch: formData.batch,
    scoringScheme: formData.scoringScheme.map(row => ({
      area: row.areaName,
      weightPercent: row.weightPercent
    })),
    jdDocument: {
      fileName: formData.jdDocument.fileName,
      mimeType: formData.jdDocument.mimeType,
      contentFormat: formData.jdDocument.contentFormat,
      content: formData.jdDocument.content
    },
    timestamp: new Date().toISOString()
  };
};

export const submitIntakeForm = async (formData: IntakeFormData) => {
  const payload = buildPayload(formData);
  
  const response = await fetch(API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Placeholder function for dashboard data fetching
export const fetchDashboardData = async () => {
  // This would connect to Supabase in the future
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Dashboard data placeholder',
        candidates: [],
        analytics: {}
      });
    }, 1000);
  });
};
