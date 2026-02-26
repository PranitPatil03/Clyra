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
          "You are a contract analysis expert. You provide precise, structured analysis in JSON format only. Never include markdown formatting or extra text outside the JSON.",
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
    Analyze the following ${contractType} contract and provide:
    1. A list of at least 10 potential risks for the party receiving the contract, each with a brief explanation and severity level (low, medium, high).
    2. A list of at least 10 potential opportunities or benefits for the receiving party, each with a brief explanation and impact level (low, medium, high).
    3. A comprehensive summary of the contract, including key terms and conditions.
    4. Any recommendations for improving the contract from the receiving party's perspective.
    5. A list of key clauses in the contract.
    6. An assessment of the contract's legal compliance.
    7. A list of potential negotiation points.
    8. The contract duration or term, if applicable.
    9. A summary of termination conditions, if applicable.
    10. A breakdown of any financial terms or compensation structure, if applicable.
    11. Any performance metrics or KPIs mentioned, if applicable.
    12. A summary of any specific clauses relevant to this type of contract (e.g., intellectual property for employment contracts, warranties for sales contracts).
    13. An overall score from 1 to 100, with 100 being the highest. This score represents the overall favorability of the contract based on the identified risks and opportunities.

    Format your response as a JSON object with the following structure:
    {
      "risks": [{"risk": "Risk description", "explanation": "Brief explanation", "severity": "low|medium|high"}],
      "opportunities": [{"opportunity": "Opportunity description", "explanation": "Brief explanation", "impact": "low|medium|high"}],
      "summary": "Comprehensive summary of the contract",
      "recommendations": ["Recommendation 1", "Recommendation 2", ...],
      "keyClauses": ["Clause 1", "Clause 2", ...],
      "legalCompliance": "Assessment of legal compliance",
      "negotiationPoints": ["Point 1", "Point 2", ...],
      "contractDuration": "Duration of the contract, if applicable",
      "terminationConditions": "Summary of termination conditions, if applicable",
      "overallScore": "Overall score from 1 to 100",
      "financialTerms": {
        "description": "Overview of financial terms",
        "details": ["Detail 1", "Detail 2", ...]
      },
      "performanceMetrics": ["Metric 1", "Metric 2", ...],
      "specificClauses": "Summary of clauses specific to this contract type"
    }
      `;
  } else {
    prompt = `
    Analyze the following ${contractType} contract and provide:
    1. A list of at least 5 potential risks for the party receiving the contract, each with a brief explanation and severity level (low, medium, high).
    2. A list of at least 5 potential opportunities or benefits for the receiving party, each with a brief explanation and impact level (low, medium, high).
    3. A brief summary of the contract
    4. An overall score from 1 to 100, with 100 being the highest. This score represents the overall favorability of the contract based on the identified risks and opportunities.

     {
      "risks": [{"risk": "Risk description", "explanation": "Brief explanation"}],
      "opportunities": [{"opportunity": "Opportunity description", "explanation": "Brief explanation"}],
      "summary": "Brief summary of the contract",
      "overallScore": "Overall score from 1 to 100"
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
