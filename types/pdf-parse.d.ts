declare module "pdf-parse" {
  type PdfData = {
    text: string;
    numpages: number;
    numrender: number;
    info?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
    version?: string;
  };

  export default function pdf(dataBuffer: Buffer | Uint8Array): Promise<PdfData>;
}
