"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bot,
  X,
  Send,
  Clock,
  Flame,
  Utensils,
  BadgeDollarSign,
} from "lucide-react";

type FoodCard = {
  type: "food_card";
  name: string;
  image?: string;
  price?: string;
  calories?: string;
  cookTime?: string;
  ingredients?: string[];
  description?: string;
  discount?: string;
};

type FoodListItem = {
  name: string;
  image?: string;
  price?: string;
  calories?: string;
  cookTime?: string;
  description?: string;
  discount?: string;
};

type FoodList = {
  type: "food_list";
  title?: string;
  items: FoodListItem[];
};

type ChatMessage = {
  role: "user" | "assistant";
  text?: string;
  card?: FoodCard;
  list?: FoodList;
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          ...(data.reply?.type === "food_card"
            ? { card: data.reply }
            : data.reply?.type === "food_list"
              ? { list: data.reply }
              : { text: data.reply?.message || "No response" }),
        },
      ]);
    } catch (error) {
      console.error("Frontend Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="group fixed bottom-5 right-5 z-50">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90"
          aria-label="Toggle AI Assistant"
        >
          {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        </button>

        <div className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-black px-3 py-2 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100">
          {open ? "Close AI Assistant" : "Ask AI Assistant"}
        </div>
      </div>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[94vw] max-w-md overflow-hidden rounded-2xl border bg-background shadow-2xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2 font-semibold">
              <Bot className="h-5 w-5" />
              Warwick AI Assistant
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Close AI Assistant"
            >
              <X className="h-5 w-5 cursor-pointer" />
            </button>
          </div>

          <div className="h-[430px] space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Hello! Ask me about menu, offers, ingredients, or prices.
              </p>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[95%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {msg.card ? (
                  <div className="space-y-3">
                    {msg.card.image && (
                      <div className="relative h-36 w-full overflow-hidden rounded-xl bg-background">
                        <Image
                          src={msg.card.image}
                          alt={msg.card.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-base font-bold">{msg.card.name}</h4>

                      {msg.card.discount && (
                        <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                          <Flame className="mr-1 inline h-3 w-3" />
                          {msg.card.discount}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      {msg.card.price && (
                        <div className="rounded-lg bg-background p-2">
                          <BadgeDollarSign className="mx-auto mb-1 h-4 w-4 text-primary" />
                          <p className="text-[10px] text-muted-foreground">
                            Price
                          </p>
                          <p className="font-semibold">{msg.card.price}</p>
                        </div>
                      )}

                      {msg.card.calories && (
                        <div className="rounded-lg bg-background p-2">
                          <Utensils className="mx-auto mb-1 h-4 w-4 text-primary" />
                          <p className="text-[10px] text-muted-foreground">
                            Calories
                          </p>
                          <p className="font-semibold">{msg.card.calories}</p>
                        </div>
                      )}

                      {msg.card.cookTime && (
                        <div className="rounded-lg bg-background p-2">
                          <Clock className="mx-auto mb-1 h-4 w-4 text-primary" />
                          <p className="text-[10px] text-muted-foreground">
                            Time
                          </p>
                          <p className="font-semibold">{msg.card.cookTime}</p>
                        </div>
                      )}
                    </div>

                    {msg.card.description && (
                      <p className="text-sm text-muted-foreground">
                        {msg.card.description}
                      </p>
                    )}

                    {msg.card.ingredients &&
                      msg.card.ingredients.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.card.ingredients.map((item, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                ) : msg.list ? (
                  <div className="space-y-3">
                    {msg.list.title && (
                      <h4 className="text-base font-bold">{msg.list.title}</h4>
                    )}

                    <div className="space-y-3">
                      {msg.list.items.map((item, i) => (
                        <div
                          key={i}
                          className="overflow-hidden rounded-xl border bg-background"
                        >
                          {item.image && (
                            <div className="relative h-32 w-full bg-muted">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />

                              {item.discount && (
                                <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                                  {item.discount}
                                </span>
                              )}
                            </div>
                          )}

                          <div className="space-y-2 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-semibold">{item.name}</h5>

                              {item.price && (
                                <span className="whitespace-nowrap text-sm font-bold text-primary">
                                  {item.price}
                                </span>
                              )}
                            </div>

                            {item.description && (
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {item.description}
                              </p>
                            )}

                            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                              {item.calories && (
                                <span className="rounded-full bg-muted px-2 py-1">
                                  {item.calories}
                                </span>
                              )}

                              {item.cookTime && (
                                <span className="rounded-full bg-muted px-2 py-1">
                                  {item.cookTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))}

            {loading && (
              <div className="w-fit rounded-xl bg-muted px-3 py-2 text-sm">
                Typing...
              </div>
            )}
          </div>

          <div className="flex gap-2 border-t p-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Ask something..."
              className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
            />

            <button
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className="rounded-lg bg-primary cursor-pointer px-3 text-primary-foreground disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
