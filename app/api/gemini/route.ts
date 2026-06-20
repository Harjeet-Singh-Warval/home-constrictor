import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Fallback generator for offline/graceful degradation if API key is not configured or fails
function getMockSpec(style: string, size: string, location: string, ecoLevel: string) {
  const sqFt = size.includes("Micro") ? 320 : size.includes("Standard") ? 640 : 1180;
  const mods = size.includes("Micro") ? 1 : size.includes("Standard") ? 2 : 4;
  const price = size.includes("Micro") ? 84000 : size.includes("Standard") ? 148000 : 256000;
  
  return {
    modelName: `The Pody ${style.replace(" Home", "").trim()} Capsule`,
    areaSqFt: sqFt,
    modulesCount: mods,
    foundationRecommendation: location.toLowerCase().includes("mountain") || location.toLowerCase().includes("hill")
      ? "Helical steel screw piles for slope stability and minimal site footprint." 
      : "Slab-on-grade concrete pad with heavy load anchor plates.",
    woodMaterials: "Sustainable cross-laminated timber (CLT) of Baltic spruce with custom red cedar cladding.",
    insulationRating: "R-38 high-density wood fiber insulation panels with smart vapor barriers.",
    floorPlanLayout: `A highly efficient ${mods}-module configuration comprising ${size.includes("Micro") ? "an open studio with a fold-away queen wall-bed" : "a dedicated parent bedroom block"} integrated with a central wet-core module containing the spatial bathroom and galley kitchenette.`,
    customFeatures: [
      `Double-glazed low-E insulated wood-clad windows tailored for ${location}`,
      "Integrated magnetic storage rails within high-efficiency storage walls",
      ecoLevel.includes("Completely") ? "Greywater secondary filtering tank and dual-flush composting toilet system" : "Solar-ready high-efficiency circuit panels"
    ],
    solarCapacityKwp: ecoLevel.includes("Completely") ? 5.2 : 2.6,
    costBreakdown: {
      engineering: Math.round(price * 0.08),
      fabrication: Math.round(price * 0.65),
      sitePrep: Math.round(price * 0.12),
      transport: Math.round(price * 0.15),
      total: price
    },
    architectNote: `Designed beautifully for ${location}. This system incorporates advanced thermal bridging resistance and maximum off-grid efficiency.`
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { style = "Cedar Lane", size = "Standard", location = "General Location", ecoLevel = "Solar Ready", budget = "$150,000" } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    
    // Check if API key is missing or is placeholder
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
      console.warn("Using offline fallback mockup as GEMINI_API_KEY is not configured.");
      return NextResponse.json(getMockSpec(style, size, location, ecoLevel));
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const prompt = `You are the lead AI Architect for PODY, a high-end prefab modular and tiny home manufacturer. 
    Analyze the user's custom cabin preferences:
    - Architectural Style Preference: ${style}
    - Cabin Structure/Size: ${size}
    - Build Location and Climate: ${location}
    - Sustainability & Off-Grid Level: ${ecoLevel}
    - User Target Budget: ${budget}

    Return a meticulously calculated, highly professional modular building specification layout in JSON format reflecting these parameters. 
    Match their location for specific foundation types and insulation materials (e.g., if there's heavy snow, suggest higher R-values and metal roofs).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "modelName",
            "areaSqFt",
            "modulesCount",
            "foundationRecommendation",
            "woodMaterials",
            "insulationRating",
            "floorPlanLayout",
            "customFeatures",
            "solarCapacityKwp",
            "costBreakdown",
            "architectNote"
          ],
          properties: {
            modelName: {
              type: Type.STRING,
              description: "A customized premium name combining style and location, e.g. 'Reno Vista Studio Capsule'."
            },
            areaSqFt: {
              type: Type.INTEGER,
              description: "Estimated floor area in square feet matching the selected size."
            },
            modulesCount: {
              type: Type.INTEGER,
              description: "Number of modular pods (1 to 6) required."
            },
            foundationRecommendation: {
              type: Type.STRING,
              description: "Specific recommendation for the building foundation based on the climate or location terrain."
            },
            woodMaterials: {
              type: Type.STRING,
              description: "High-end wood or framing materials recommended (e.g. Baltic Birch, Thermo-pine claddings)."
            },
            insulationRating: {
              type: Type.STRING,
              description: "Insulation rating and thermal envelope material (e.g., R-30 or R-40 Wood Fiber panels)."
            },
            floorPlanLayout: {
              type: Type.STRING,
              description: "A 1-2 sentence description detailing how the spaces connect and transition."
            },
            customFeatures: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 specific custom specifications added to fit their profile."
            },
            solarCapacityKwp: {
              type: Type.NUMBER,
              description: "Kwp size of solar roof arrays based on their sustainability selections (e.g., 2.5 to 7.5)."
            },
            costBreakdown: {
              type: Type.OBJECT,
              required: ["engineering", "fabrication", "sitePrep", "transport", "total"],
              description: "Detailed financial estimate matching their structural scope and target budget.",
              properties: {
                engineering: { type: Type.INTEGER, description: "Engineering design and structural licensing cost." },
                fabrication: { type: Type.INTEGER, description: "Factory production of the modules." },
                sitePrep: { type: Type.INTEGER, description: "Foundation preparation and utility connections." },
                transport: { type: Type.INTEGER, description: "Delivery logistics, crane lift, and modular stitching." },
                total: { type: Type.INTEGER, description: "Sum total of all parts." }
              }
            },
            architectNote: {
              type: Type.STRING,
              description: "A friendly, professional inspiring closing note from the Pody lead architect."
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API");
    }

    const parsedData = JSON.parse(text.trim());
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Graceful fallback to mock data so the app never crashes
    try {
      const fallbackData = getMockSpec("Cedar Lane", "Standard", "Reno, NV", "Solar Ready");
      return NextResponse.json({
        ...fallbackData,
        architectNote: "Note: Running in offline/sandbox demo configuration. " + fallbackData.architectNote
      });
    } catch (inner) {
      return NextResponse.json({ error: "Failed to parse design specs: " + error.message }, { status: 500 });
    }
  }
}
