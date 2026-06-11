import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to low-latency JSON database storage
const DB_PATH = path.join(process.cwd(), "db.json");

// Import initial data to seed if db.json is missing
import { INITIAL_PRODUCTS, BLOG_ARTICLES, FAQ_DATA } from "./src/data";
import { Product, Order, UserProfile, BlogArticle } from "./src/types";

interface DBStructure {
  products: Product[];
  orders: Order[];
  blogs: BlogArticle[];
  users: UserProfile[];
}

// Ensure the local database file exists
function readDB(): DBStructure {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const defaultState: DBStructure = {
        products: INITIAL_PRODUCTS,
        orders: [
          {
            id: "order-1001",
            userId: "cust-1",
            items: [
              {
                productId: "prod-saree-royal",
                name: "Royal Banarasi Silk Saree",
                price: 3499,
                quantity: 1,
                color: "Deep Royal Blue",
                size: "Unstitched Blouse Included",
                image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80"
              }
            ],
            subtotal: 3499,
            discountAmount: 0,
            shippingFee: 0,
            tax: 175,
            total: 3674,
            paymentMethod: "UPI",
            paymentStatus: "Paid",
            orderStatus: "Delivered",
            shippingAddress: {
              name: "Priya Patel",
              phone: "+91 98765 43210",
              street: "12 Luxury Boulevard",
              city: "Mumbai",
              state: "Maharashtra",
              zipCode: "400001",
              country: "India"
            },
            trackingNumber: "MM-1029384",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        blogs: BLOG_ARTICLES,
        users: [
          {
            id: "cust-1",
            name: "Priya Patel",
            email: "priya@gmail.com",
            role: "customer",
            phone: "+91 98765 43210",
            address: {
              street: "12 Luxury Boulevard",
              city: "Mumbai",
              state: "Maharashtra",
              zipCode: "400001",
              country: "India"
            }
          },
          {
            id: "admin-madhu",
            name: "Madhu Fashion Admin",
            email: "madhukatta0731@gmail.com",
            role: "admin"
          }
        ]
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultState, null, 2), "utf8");
      return defaultState;
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to read database file, returning default structure", error);
    return { products: INITIAL_PRODUCTS, orders: [], blogs: BLOG_ARTICLES, users: [] };
  }
}

function writeDB(data: DBStructure) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    console.error("Failed to write to database file", error);
  }
}

// Lazy initialization of GoogleGenAI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    } else {
      console.warn("WARNING: GEMINI_API_KEY is not defined or is placeholder. AI suggestions will use default smart matching.");
    }
  }
  return aiClient;
}

// API endpoint to fetch products
app.get("/api/products", (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// Create new product
app.post("/api/products", (req, res) => {
  const db = readDB();
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    ...req.body
  };
  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// Update product
app.put("/api/products/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.products.findIndex(p => p.id === id);
  if (idx !== -1) {
    db.products[idx] = { ...db.products[idx], ...req.body };
    writeDB(db);
    res.json(db.products[idx]);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// Delete product
app.delete("/api/products/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const initialLen = db.products.length;
  db.products = db.products.filter(p => p.id !== id);
  if (db.products.length < initialLen) {
    writeDB(db);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

// API endpoint to fetch orders
app.get("/api/orders", (req, res) => {
  const db = readDB();
  res.json(db.orders);
});

// Place custom order
app.post("/api/orders", (req, res) => {
  const db = readDB();
  const newOrder: Order = {
    id: `order-${1000 + db.orders.length + 1}`,
    createdAt: new Date().toISOString(),
    ...req.body
  };

  // Adjust stock levels
  newOrder.items.forEach(item => {
    const pIdx = db.products.findIndex(pr => pr.id === item.productId);
    if (pIdx !== -1) {
      db.products[pIdx].stock = Math.max(0, db.products[pIdx].stock - item.quantity);
    }
  });

  db.orders.push(newOrder);
  writeDB(db);
  res.status(201).json(newOrder);
});

// Update shipping/order status
app.put("/api/orders/:id", (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const idx = db.orders.findIndex(o => o.id === id);
  if (idx !== -1) {
    db.orders[idx] = { ...db.orders[idx], ...req.body };
    writeDB(db);
    res.json(db.orders[idx]);
  } else {
    res.status(404).json({ error: "Order not found" });
  }
});

// Get user profile or login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  // Simple check for simulation or admin access
  const isOwner = email === "madhukatta0731@gmail.com" || email === "admin@madhumagic.com" || password === "admin123";
  let user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) {
    // Auto register for test demo
    user = {
      id: `cust-${Date.now()}`,
      email,
      name: email.split("@")[0].toUpperCase(),
      role: isOwner ? "admin" : "customer"
    };
    db.users.push(user);
    writeDB(db);
  } else if (isOwner && user.role !== "admin") {
    user.role = "admin";
    writeDB(db);
  }

  res.json({ success: true, user });
});

// AI Fashion Recommendation API route using Gemini AI
app.post("/api/ai/recommend", async (req, res) => {
  const { preferences, history, currentItemId } = req.body;
  const db = readDB();
  const products = db.products;

  const client = getGeminiClient();

  if (!client) {
    // Clever matching fallback if key is unauthorized/unset
    console.log("No Gemini key. Running static hybrid fallback matching");
    // Filter out some relevant suggestions based on category or type
    let matches = products;
    if (currentItemId) {
      const current = products.find(p => p.id === currentItemId);
      if (current) {
        matches = products.filter(p => p.id !== currentItemId && (p.category === current.category || p.type === current.type));
      }
    } else if (preferences && preferences.category) {
      matches = products.filter(p => p.category.toLowerCase().includes(preferences.category.toLowerCase()));
    }
    if (matches.length === 0) matches = products;
    res.json({
      recommendations: matches.slice(0, 3),
      aiThinking: "Offline local matching: Matching based on current category filters and boutique trends."
    });
    return;
  }

  try {
    const prompt = `You are the master virtual stylist for "Madhu Magic Fashion Hub", a premium royal ladies and boutique jewelry fashion label.
We have these luxury items currently in stock:
${products.map(p => `- ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Type: ${p.type}, Price: ₹${p.price}, Colors: ${p.colors.join(", ")}`).join("\n")}

The user has specified constraints/history:
Current Item Id (if viewing): ${currentItemId || "None"}
Preferences: ${JSON.stringify(preferences || {})}
Recent Browsing Type: ${JSON.stringify(history || [])}

Please recommend exactly 3 product IDs from our inventory that would style perfectly, complement these selections, or delight the user.
Return your recommendation strictly as a JSON object with two fields:
1. "recommendedIds": array of 3 product ID strings from the inventory above.
2. "stylistNote": a concise, elegant, luxurious 2-sentence styling tip explaining this aesthetic curation from a premium boutique stylist's view.

Ensure correct formatting and valid product IDs only. Do not invent items not present in the inventory list.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of exactly 3 recommended product IDs from the inventory list."
            },
            stylistNote: {
              type: Type.STRING,
              description: "An elegant, luxurious greeting and styled explanation of the choices as a Madhu Magic personal fashion shopper."
            }
          },
          required: ["recommendedIds", "stylistNote"]
        }
      }
    });

    const bodyText = response.text || "{}";
    const result = JSON.parse(bodyText);

    // Populate actual products based on response IDs
    const recommendedList = (result.recommendedIds || [])
      .map((id: string) => products.find(p => p.id === id))
      .filter(Boolean);

    // If gemini fails to match existing IDs, fallback clean fill
    while (recommendedList.length < 3 && products.length > 0) {
      const next = products.find(p => !recommendedList.some(r => r.id === p.id));
      if (next) recommendedList.push(next);
      else break;
    }

    res.json({
      recommendations: recommendedList.slice(0, 3),
      aiThinking: result.stylistNote || "Excellently styled recommendations matching luxurious aesthetics."
    });
  } catch (error) {
    console.error("Gemini stylist generation failed:", error);
    res.status(200).json({
      recommendations: products.slice(0, 3),
      aiThinking: "As your boutique stylist, I recommend pairing our best Banarasi textiles with traditional gold plated jewellery for stunning celebrations."
    });
  }
});

// Start our server integration with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Madhu Magic Luxury Platform live on http://localhost:${PORT}`);
  });
}

startServer();
