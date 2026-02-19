export type EmbeddingInput = {
  chunkId: string;
  text: string;
};

export type EmbeddingVector = {
  chunkId: string;
  values: number[];
};

export async function generateChunkEmbeddings(inputs: EmbeddingInput[]): Promise<EmbeddingVector[]> {
  void inputs;
  // V1 scaffold: wire your embedding model + storage integration here.
  return [];
}
