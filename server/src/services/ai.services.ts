import redis from "../config/redis";
import { getDocument } from "pdfjs-dist";
import Groq from "groq-sdk";

const AI_MODEL = "llama-3.3-70b-versatile";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const extractTextFromPDF = async (fileKey: string) => {
  try {
    const fileData = await redis.get(fileKey);
    if (!fileData) {
      throw new Error("File not found");
    }

    let fileBuffer: Uint8Array;
    if (Buffer.isBuffer(fileData)) {
      fileBuffer = new Uint8Array(fileData);
    } else if (typeof fileData === "object" && fileData !== null) {
      // check if the the object has the expected structure
      const bufferData = fileData as { type?: string; data?: number[] };
      if (bufferData.type === "Buffer" && Array.isArray(bufferData.data)) {
        fileBuffer = new Uint8Array(bufferData.data);
      } else {
        throw new Error("Invalid file data");
      }
    } else {
      throw new Error("Invalid file data");
    }

    const pdf = await getDocument({ data: fileBuffer }).promise;
    let text = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(" ") + "\n";
    }
    return text;
  } catch (error) {
    console.log(error);
    throw new Error(
      `Failed to extract text from PDF. Error: ${JSON.stringify(error)}`
    );
  }
};

async function chatCompletion(prompt: string): Promise<string> {
  const response = await groq.chat.completions.create({
    model: AI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a legal contract analysis expert. You provide precise, structured analysis in JSON format only. Never include markdown formatting or extra text outside the JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 8192,
  });

  return response.choices[0]?.message?.content || "";
}

export const detectContractType = async (
  contractText: string
): Promise<string> => {
  const prompt = `
    Analyze the following contract text and determine the type of contract it is.
    Provide only the contract type as a single plain string (e.g., "Employment Agreement", "Non-Disclosure Agreement", "Sales Agreement", "Lease Agreement", etc.).
    Do not include any JSON, quotes, or additional explanation. Just the type name.

    Contract text:
    ${contractText.substring(0, 2000)}
  `;

  let result = await chatCompletion(prompt);
  result = result.trim();

  // Handle cases where AI returns JSON like {"contract_type": "Lease"}
  try {
    const parsed = JSON.parse(result);
    if (typeof parsed === "object" && parsed !== null) {
      return (
        parsed.contract_type ||
        parsed.contractType ||
        parsed.type ||
        (Object.values(parsed)[0] as string) ||
        "Unknown"
      );
    }
    return String(parsed);
  } catch {
    // It's a plain string — just clean up quotes
    return result.replace(/^["']|["']$/g, "").trim();
  }
};

export const analyzeContractWithAI = async (
  contractText: string,
  tier: "free" | "premium",
  contractType: string
) => {
  let prompt;
  if (tier === "premium") {
    prompt = `
    Analyze the following ${contractType} contract thoroughly and provide a comprehensive legal analysis from the receiving party's perspective.

    Provide the following:
    1. At least 10 potential risks for the receiving party. For each risk: a concise title, a detailed explanation of exactly why it is harmful or problematic, severity level (high/medium/low), and a specific suggested alternative — concrete better clause language or negotiation approach the receiving party should use.
    2. At least 10 opportunities or benefits for the receiving party. For each: a concise title, a detailed explanation of the benefit, impact level (high/medium/low), and how to leverage or negotiate this opportunity for better terms.
    3. A comprehensive 3-5 paragraph summary covering key obligations, rights, risks, and overall assessment.
    4. Specific actionable recommendations to improve the contract from the receiving party's perspective.
    5. Key clauses explained in plain language — what each clause means in practice.
    6. An assessment of legal compliance and any regulatory concerns.
    7. Priority negotiation points with reasoning for why each matters.
    8. Contract duration and renewal terms.
    9. Termination conditions, notice requirements, and consequences.
    10. Financial terms and compensation structure breakdown.
    11. Performance metrics or KPIs if mentioned.
    12. Intellectual property clause analysis — who owns what.
    13. Overall favorability score from 1 to 100 (100 = most favorable to receiving party).

    Format your response as a JSON object with this exact structure:
    {
      "risks": [{"risk": "Concise risk title", "explanation": "Detailed explanation of why this is harmful and its potential consequences", "severity": "high|medium|low", "suggestedAlternative": "Specific better clause language or negotiation approach to use instead"}],
      "opportunities": [{"opportunity": "Opportunity title", "explanation": "Detailed explanation of the benefit and why it matters", "impact": "high|medium|low", "suggestedAlternative": "Concrete steps or language to negotiate to maximize this opportunity"}],
      "summary": "Comprehensive 3-5 paragraph summary",
      "recommendations": ["Specific actionable recommendation 1", "Recommendation 2"],
      "keyClauses": ["Plain-language explanation of clause 1 and what it means in practice", "Clause 2"],
      "legalCompliance": "Assessment of legal compliance and regulatory concerns",
      "negotiationPoints": ["Priority negotiation point 1 with reasoning", "Point 2"],
      "contractDuration": "Duration, term, and renewal conditions",
      "terminationConditions": "Termination conditions, notice requirements, and consequences",
      "overallScore": 75,
      "financialTerms": {
        "description": "Overview of all financial terms",
        "details": ["Financial detail 1", "Detail 2"]
      },
      "compensationStructure": {
        "baseSalary": "Base salary or rate if applicable",
        "bonuses": "Bonus structure if applicable",
        "equity": "Equity or stock options if applicable",
        "otherBenefits": "Other benefits or perks if applicable"
      },
      "performanceMetrics": ["Metric 1", "Metric 2"],
      "intellectualPropertyClauses": "Summary of IP ownership, assignment, and licensing clauses"
    }
      `;
  } else {
    prompt = `
    Analyze the following ${contractType} contract and provide:
    1. At least 5 potential risks for the receiving party, each with a brief explanation and severity level (high/medium/low).
    2. At least 5 opportunities or benefits for the receiving party, each with a brief explanation and impact level (high/medium/low).
    3. A brief 2-3 sentence summary of the contract.
    4. An overall favorability score from 1 to 100 (100 = most favorable to receiving party).

    Format as JSON:
    {
      "risks": [{"risk": "Risk title", "explanation": "Brief explanation", "severity": "high|medium|low"}],
      "opportunities": [{"opportunity": "Opportunity title", "explanation": "Brief explanation", "impact": "high|medium|low"}],
      "summary": "Brief 2-3 sentence summary",
      "overallScore": 50
    }
`;
  }

  prompt += `
    Important: Provide only the JSON object in your response, without any additional text or formatting. 
    
    
    Contract text:
    ${contractText}
    `;

  const text = await chatCompletion(prompt);
  let cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

  try {
    // Attempt to fix common JSON errors
    cleanedText = cleanedText
      .replace(/,\s*}/g, "}") // Remove trailing commas before }
      .replace(/,\s*]/g, "]"); // Remove trailing commas before ]

    const analysis = JSON.parse(cleanedText);
    return analysis;
  } catch (error) {
    console.log("Error parsing JSON:", error);
  }

  interface IRisk {
    risk: string;
    explanation: string;
  }

  interface IOpportunity {
    opportunity: string;
    explanation: string;
  }

  interface FallbackAnalysis {
    risks: IRisk[];
    opportunities: IOpportunity[];
    summary: string;
  }

  const fallbackAnalysis: FallbackAnalysis = {
    risks: [],
    opportunities: [],
    summary: "Error analyzing contract",
  };

  // Extract risks
  const risksMatch = cleanedText.match(/"risks"\s*:\s*\[([\s\S]*?)\]/);
  if (risksMatch) {
    fallbackAnalysis.risks = risksMatch[1].split("},").map((risk) => {
      const riskMatch = risk.match(/"risk"\s*:\s*"([^"]*)"/);
      const explanationMatch = risk.match(/"explanation"\s*:\s*"([^"]*)"/);
      return {
        risk: riskMatch ? riskMatch[1] : "Unknown",
        explanation: explanationMatch ? explanationMatch[1] : "Unknown",
      };
    });
  }

  //Extact opportunities
  const opportunitiesMatch = cleanedText.match(
    /"opportunities"\s*:\s*\[([\s\S]*?)\]/
  );
  if (opportunitiesMatch) {
    fallbackAnalysis.opportunities = opportunitiesMatch[1]
      .split("},")
      .map((opportunity) => {
        const opportunityMatch = opportunity.match(
          /"opportunity"\s*:\s*"([^"]*)"/
        );
        const explanationMatch = opportunity.match(
          /"explanation"\s*:\s*"([^"]*)"/
        );
        return {
          opportunity: opportunityMatch ? opportunityMatch[1] : "Unknown",
          explanation: explanationMatch ? explanationMatch[1] : "Unknown",
        };
      });
  }

  // Extract summary
  const summaryMatch = cleanedText.match(/"summary"\s*:\s*"([^"]*)"/);
  if (summaryMatch) {
    fallbackAnalysis.summary = summaryMatch[1];
  }

  return fallbackAnalysis;
};
