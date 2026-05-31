import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY missing" },
        { status: 500 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const productsRes = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });

    const products = await productsRes.json();

    const menuData = Array.isArray(products)
      ? products
          .map((item) => {
            return `
Name: ${item.name}
Arabic Name: ${item.nameAr || ""}
Category: ${item.category || ""}
Price: ${item.price ? `${item.price} SAR` : ""}
Calories: ${item.calories ? `${item.calories} kcal` : ""}
Cook Time: ${item.cookTime ? `${item.cookTime} min` : ""}
Image: ${item.image || ""}
Description: ${item.description || ""}
Ingredients: ${(item.ingredients || []).join(", ")}
Discount: ${item.discount ? `${item.discount}%` : ""}
`;
          })
          .join("\n")
      : "No menu data found";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: `
You are an AI Assistant for this restaurant menu website only.

Rules:
1. Only answer questions about this website food menu.
2. Do not answer unrelated questions.
3. Do not use markdown.
4. Do not use bullet points.
5. Do not add extra text outside JSON.
6. Reply in the same language as the user when possible.

If user asks for ONE specific food item details, return ONLY this JSON:
{
  "type": "food_card",
  "name": "Food Name",
  "image": "/image-url.jpg",
  "price": "52 SAR",
  "calories": "620 kcal",
  "cookTime": "18 min",
  "ingredients": ["Ingredient 1", "Ingredient 2"],
  "description": "Food description",
  "discount": "10%"
}

If user asks for multiple foods, menu list, category foods, offers, discounted foods, or recommendations, return ONLY this JSON:
{
  "type": "food_list",
  "title": "Available Menu Items",
  "items": [
    {
      "name": "Food Name",
      "image": "/image-url.jpg",
      "price": "52 SAR",
      "calories": "620 kcal",
      "cookTime": "18 min",
      "description": "Short description",
      "discount": "10%"
    }
  ]
}

If the question is unrelated, return ONLY:
{
  "type": "text",
  "message": "Sorry, I can only help with our restaurant menu, food items, prices, ingredients, and offers."
}

If no food is found, return ONLY:
{
  "type": "text",
  "message": "Sorry, this item is not available in our menu."
}
`,
      },
      contents: `
Website Menu Data:
${menuData}

User Question:
${message}
`,
    });

    let aiReply;

    try {
      aiReply = JSON.parse(response.text || "{}");
    } catch {
      aiReply = {
        type: "text",
        message: response.text || "Sorry, I could not generate a reply.",
      };
    }

    return NextResponse.json({
      reply: aiReply,
    });
  } catch (error: any) {
    console.error("GEMINI AI CHAT ERROR:", error);

    return NextResponse.json(
      {
        error: error?.message || "Gemini AI assistant failed",
      },
      { status: 500 },
    );
  }
}
