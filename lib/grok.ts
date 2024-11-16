export async function generateReport(company: any, type: string) {
  const prompts = {
    'business-overview': `Generate a detailed business overview report for ${company.name}, a company in the ${company.industry} industry.
    Include analysis of:
    - Business Model: ${company.description}
    - Target Market: ${company.targetMarket}
    - Revenue Model: ${company.pricingModel}
    - Marketing Strategy: ${company.marketingStrategy}
    - Customer Acquisition: ${company.customerAcquisition}
    
    Provide insights on viability, monetization strategies, and potential risks.`,
    
    'market-research': `Generate a comprehensive market research report for ${company.name} in the ${company.industry} industry.
    Consider:
    - Target Market: ${company.targetMarket}
    - Industry Analysis
    - Competitive Landscape
    - Market Size and Growth Potential
    - Customer Behavior Analysis`,
    
    'launch-strategy': `Create a detailed launch strategy for ${company.name}.
    Based on:
    - Business Model: ${company.description}
    - Marketing Approach: ${company.marketingStrategy}
    - Customer Acquisition: ${company.customerAcquisition}
    
    Include MVP roadmap, technical requirements, and go-to-market strategy.`,
    
    'capital-raising': `Generate a capital raising strategy report for ${company.name}.
    Incorporating:
    - Business Model: ${company.description}
    - Market Opportunity: ${company.targetMarket}
    - Revenue Model: ${company.pricingModel}
    - Growth Strategy: ${company.marketingStrategy}
    
    Include funding requirements, valuation methodology, and investor pitch elements.`,
    'entreprenuer-learning': `Generate a swot /bcg/ansoff/grand matrix strategy ${company.name}.
    Incorporating:
    - Business Model: ${company.description}
    - Market Opportunity: ${company.targetMarket}
    - Revenue Model: ${company.pricingModel}
    - Growth Strategy: ${company.marketingStrategy}
    
    Include all aspects`
  };

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'You are a business analyst expert. Generate detailed business reports in markdown format.'
          },
          {
            role: 'user',
            content: prompts[type as keyof typeof prompts]
          }
        ],
        model: 'llama-3.2-11b-text-preview',
        stream: false,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (data.choices && data.choices.length > 0) {
      return data.choices[0].message.content;
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}