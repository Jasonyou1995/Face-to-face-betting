import { OpenAI } from 'openai';

class BetReviewAgent {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async reviewBetFairness(betCondition: string): Promise<{
    isValid: boolean;
    reason?: string;
  }> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an AI agent reviewing betting conditions for fairness and ethics."
        },
        {
          role: "user",
          content: `Please review this betting condition: ${betCondition}`
        }
      ]
    });

    // Process response and return verdict
    return {
      isValid: true, // Logic to determine validity
      reason: response.choices[0].message.content
    };
  }
}

export default BetReviewAgent; 