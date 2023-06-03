import '../environments';
import axios from 'axios';
import { FigmaDocument } from '../types/figma';

const createClient = (token: string) =>
  axios.create({
    baseURL: 'https://api.figma.com/v1',
    headers: {
      'X-Figma-Token': token,
    },
  });

const apiClient = createClient(process.env.FIGMA_API_KEY!);

const getFigmaFile = async (fileId: string, params: { depth?: number } = {}): Promise<FigmaDocument> => {
  const { data } = await apiClient.get(`/files/${fileId}`, { params });
  return data;
};

const getFigmaFileImages = async (fileId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}`);
  return data;
};

const getFigmaFileComponents = async (fileId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/components`);
  return data;
};

const getFigmaFileComponent = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/components/${componentId}`);
  return data;
};

const getFigmaFileComponentImage = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}`);
  return data;
};

const getFigmaFileComponentImageSvg = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=svg`);
  return data;
};

const getFigmaFileComponentImagePdf = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=pdf`);
  return data;
};

const getFigmaFileComponentImageEps = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=eps`);
  return data;
};

const getFigmaFileComponentImageJpg = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=jpg`);
  return data;
};

const getFigmaFileComponentImagePng = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=png`);
  return data;
};

const getFigmaFileComponentImageWebp = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=webp`);
  return data;
};

const getFigmaFileComponentImageGif = async (fileId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=gif`);
  return data;
};

const getFigmaFileNodes = async (fileId: string, nodeIds: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/nodes?ids=${nodeIds}`);
  return data;
};

const getFigmaFileComments = async (fileId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/comments`);
  return data;
};

const getFigmaFileComment = async (fileId: string, commentId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/comments/${commentId}`);
  return data;
};

const getFigmaFileVersions = async (fileId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/versions`);
  return data;
};

const getFigmaFileVersion = async (fileId: string, versionId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/versions/${versionId}`);
  return data;
};

const getFigmaFileTeamProjects = async (fileId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/projects`);
  return data;
};

const getFigmaFileProjectFiles = async (fileId: string, projectId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/projects/${projectId}`);
  return data;
};

const getFigmaFileProjectComponents = async (fileId: string, projectId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/projects/${projectId}/components`);
  return data;
};

const getFigmaFileProjectComponent = async (fileId: string, projectId: string, componentId: string) => {
  const { data } = await apiClient.get(`/files/${fileId}/projects/${projectId}/components/${componentId}`);
  return data;
};

const getFigmaFileProjectComponentImage = async (fileId: string, projectId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}`);
  return data;
};

const getFigmaFileProjectComponentImageSvg = async (fileId: string, projectId: string, componentId: string) => {
  const { data } = await apiClient.get(`/images/${fileId}?ids=${componentId}&format=svg`);
  return data;
};

const getFigmaUser = async (userId: string) => {
  const { data } = await apiClient.get(`/users/${userId}`);
  return data;
};

const getFigmaUserProjects = async (userId: string) => {
  const { data } = await apiClient.get(`/users/${userId}/projects`);
  return data;
};

const getFigmaUserProjectFiles = async (userId: string, projectId: string) => {
  const { data } = await apiClient.get(`/users/${userId}/projects/${projectId}`);
  return data;
};

const getMe = async () => {
  const { data } = await apiClient.get('/me');
  return data;
};

export {
  getFigmaFile,
  getFigmaFileImages,
  getFigmaFileComponents,
  getFigmaFileComponent,
  getFigmaFileComponentImage,
  getFigmaFileComponentImageSvg,
  getFigmaFileComponentImagePdf,
  getFigmaFileComponentImageEps,
  getFigmaFileComponentImageJpg,
  getFigmaFileComponentImagePng,
  getFigmaFileComponentImageWebp,
  getFigmaFileComponentImageGif,
  getFigmaFileNodes,
  getFigmaFileComments,
  getFigmaFileComment,
  getFigmaFileVersions,
  getFigmaFileVersion,
  getFigmaFileTeamProjects,
  getFigmaFileProjectFiles,
  getFigmaFileProjectComponents,
  getFigmaFileProjectComponent,
  getFigmaFileProjectComponentImage,
  getFigmaFileProjectComponentImageSvg,
  getFigmaUser,
  getFigmaUserProjects,
  getFigmaUserProjectFiles,
  getMe,
};
