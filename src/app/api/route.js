import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(request) {
  try {
    const req = await request.json();
    const openai = new OpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    });
    const query = req.QUERY;
    const mes = req.MESSAGE;

    console.log("query yeh hai ", query);
    console.log("route main hu aur message aaya hai ", mes);
    let query_new = "";
    if (mes == "I am sorry. Unable to understand you!") {
      query_new = query;
    } else {
      query_new =
        "For the Question -" +
        query +
        " I have answered " +
        mes +
        " I want a you to reframe this answer in correct way check suitability of my answer to the question and return only the reframed anwser no other statement except it. You may add on your own knowledge base also pertaining only to Indian perspective only .If the question and answer are related to greetings then just reflect my anwser. do not reframe it answer";

  
    }
    // const res = "this is dumm y on ly for testing";
    async function main() {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: query_new }],
        model: "gpt-3.5-turbo",
      });
      const res = completion.choices[0].message.content;
      console.log(res);
      return NextResponse.json({ RESULT: res });
    }

    // Await main() to ensure it completes before returning the response
    return await main();
  } catch (error) {
    console.error("Error occurred:", error);
    // Provide a meaningful response in case of error
    return NextResponse.error();
  }
}
