import { apiClient } from './client';

export const api = {
  // Coordinator
  getCoordinatorStatus: () => apiClient.get('/api/v1/coordinator/status'),
  getCoordinatorHistory: () => apiClient.get('/api/v1/coordinator/history'),
  triggerTraining: () => apiClient.post('/api/v1/coordinator/trigger'),
  getContributions: () => apiClient.get('/api/v1/coordinator/contributions'),
  
  // Hospitals
  getHospitals: () => apiClient.get('/api/v1/hospitals/'),
  uploadDataset: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post(`/api/v1/hospitals/${id}/dataset`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getDatasetMetadata: (id: number) => apiClient.get(`/api/v1/hospitals/${id}/dataset/metadata`),
  trainHospital: (id: number) => apiClient.post(`/api/v1/hospitals/${id}/train`),
  getTrainingStatus: (id: number) => apiClient.get(`/api/v1/hospitals/${id}/train/status`),
  getTrainingResult: (id: number) => apiClient.get(`/api/v1/hospitals/${id}/train/result`),
  
  // Prediction
  makePrediction: (data: any) => apiClient.post('/api/v1/prediction/', data),
  
  // Privacy
  getPrivacyStatus: () => apiClient.get('/api/v1/privacy/status'),
  
  // Blockchain
  getBlockchainEvents: () => apiClient.get('/api/v1/blockchain/events'),
};
