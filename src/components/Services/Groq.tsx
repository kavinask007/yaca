import { ChatGroq } from "@langchain/groq";
import { ChatOllama } from "@langchain/ollama";
import { ChatBedrockConverse } from "@langchain/aws";
// const llm = new ChatOllama({
//   model: "llama3",
//   temperature: 0,
//   maxRetries: 2,
//   // other params...
// });
// const model = new ChatBedrockConverse({
//   region: process.env.BEDROCK_AWS_REGION || "us-east-1",
//   credentials: {
//     secretAccessKey: process.env.BEDROCK_AWS_SECRET_ACCESS_KEY || "",
//     accessKeyId: process.env.BEDROCK_AWS_ACCESS_KEY_ID || "",
//   },
// });
import { StringOutputParser } from "@langchain/core/output_parsers";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

export async function getChatStream(
  input: any,
  messages: any,
  api_key: string,
  modelname: string
): Promise<AsyncGenerator<string>> {
  const model = new ChatGroq({
    apiKey: api_key,
    model: modelname,
  });
  console.log(messages);
  let messages_formated = messages.map((message: any) => {
    if (message.sender === "user") {
      return new HumanMessage(message.conent);
    } else {
      return new AIMessage(message.content);
    }
  });
  messages_formated = [...messages_formated, new HumanMessage(input)];
  console.log(messages_formated);
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful assistant. Answer all questions to the best of your ability.",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  const chain = prompt.pipe(model);
  const response = await chain.stream({
    messages: messages_formated,
  });

  // const response = await model.stream(input);

  async function* streamGenerator() {
    let res = "";
    for await (const item of response) {
      res += item.content;
      yield res;
    }
  }
  return streamGenerator();
}
