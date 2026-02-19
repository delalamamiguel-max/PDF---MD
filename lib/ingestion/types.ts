export type NormalizedSection = {
  heading: string;
  level: 1 | 2;
  content: string;
  anchor: string;
};

export type IngestionContext = {
  documentId: string;
  userId: string;
  title: string;
  sourceFilename: string;
  uploadedAt: string;
  pdfUrl: string;
  reprocessReason?: string;
};
