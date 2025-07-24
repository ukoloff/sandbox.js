import GigaChat from "gigachat";

export class GigaEmb {
  constructor(model = "Embeddings") {
    if (model == '+') {
      model = "EmbeddingsGigaR";
    }
    this.model = model;
    this.llm = new GigaChat();
  }

  async generate(texts) {
    let res = await this.llm.embeddings(texts, this.model);
    return res.data.map($ => $.embedding);
  }
}
