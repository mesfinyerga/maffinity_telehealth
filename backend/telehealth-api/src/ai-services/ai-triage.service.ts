import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { UrgencyLevel, LanguageType } from '../common/enums';

@Injectable()
export class AiTriageService {
  private readonly logger = new Logger(AiTriageService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeSymptoms(
    symptomsDescription: string,
    language: LanguageType = LanguageType.ENGLISH,
  ): Promise<{
    assessment: string;
    urgencyLevel: UrgencyLevel;
    recommendedAction: string;
  }> {
    try {
      const systemPrompt = this.getSystemPrompt(language);
      const userPrompt = this.getUserPrompt(symptomsDescription, language);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return this.parseAiResponse(response);
    } catch (error) {
      this.logger.error('Error analyzing symptoms:', error);
      return this.getFallbackResponse(language);
    }
  }

  private getSystemPrompt(language: LanguageType): string {
    const basePrompt = `You are a medical AI assistant for a telehealth platform in Ethiopia. Your role is to provide preliminary symptom assessment and triage guidance. 

IMPORTANT GUIDELINES:
- You are NOT providing a diagnosis
- You are providing preliminary assessment and guidance only
- Always recommend consulting with a healthcare professional for proper diagnosis
- Be culturally sensitive to Ethiopian healthcare context
- Identify urgency levels: LOW, MEDIUM, HIGH, EMERGENCY
- Provide clear, actionable recommendations

Response format (JSON):
{
  "assessment": "Brief assessment of symptoms",
  "urgencyLevel": "LOW|MEDIUM|HIGH|EMERGENCY",
  "recommendedAction": "Specific action recommendation"
}`;

    if (language === LanguageType.AMHARIC) {
      return basePrompt + `\n\nRespond in Amharic language. Use appropriate medical terminology that Ethiopian patients would understand.`;
    }

    return basePrompt + `\n\nRespond in English using simple, clear language that is accessible to patients with varying education levels.`;
  }

  private getUserPrompt(symptomsDescription: string, language: LanguageType): string {
    const basePrompt = `Patient symptoms: ${symptomsDescription}

Please provide a preliminary assessment, urgency level, and recommended action.`;

    if (language === LanguageType.AMHARIC) {
      return `የታካሚ ምልክቶች: ${symptomsDescription}\n\nእባክዎ የመጀመሪያ ግምገማ፣ የአስቸኳይነት ደረጃ እና የሚመከር እርምጃ ይስጡ።`;
    }

    return basePrompt;
  }

  private parseAiResponse(response: string): {
    assessment: string;
    urgencyLevel: UrgencyLevel;
    recommendedAction: string;
  } {
    try {
      // Try to parse JSON response
      const parsed = JSON.parse(response);
      
      return {
        assessment: parsed.assessment || 'Assessment not available',
        urgencyLevel: this.mapUrgencyLevel(parsed.urgencyLevel),
        recommendedAction: parsed.recommendedAction || 'Please consult with a healthcare provider',
      };
    } catch (error) {
      // Fallback parsing for non-JSON responses
      return this.parseTextResponse(response);
    }
  }

  private parseTextResponse(response: string): {
    assessment: string;
    urgencyLevel: UrgencyLevel;
    recommendedAction: string;
  } {
    // Extract urgency level from text
    let urgencyLevel = UrgencyLevel.MEDIUM;
    const urgencyKeywords = {
      [UrgencyLevel.EMERGENCY]: ['emergency', 'urgent', 'immediate', 'call 911', 'hospital'],
      [UrgencyLevel.HIGH]: ['high', 'soon', 'today', 'promptly'],
      [UrgencyLevel.LOW]: ['low', 'routine', 'monitor', 'self-care'],
    };

    const lowerResponse = response.toLowerCase();
    for (const [level, keywords] of Object.entries(urgencyKeywords)) {
      if (keywords.some(keyword => lowerResponse.includes(keyword))) {
        urgencyLevel = level as UrgencyLevel;
        break;
      }
    }

    return {
      assessment: response.substring(0, 500), // Truncate if too long
      urgencyLevel,
      recommendedAction: 'Please consult with a healthcare provider for proper evaluation and treatment.',
    };
  }

  private mapUrgencyLevel(level: string): UrgencyLevel {
    const upperLevel = level?.toUpperCase();
    switch (upperLevel) {
      case 'EMERGENCY':
        return UrgencyLevel.EMERGENCY;
      case 'HIGH':
        return UrgencyLevel.HIGH;
      case 'LOW':
        return UrgencyLevel.LOW;
      default:
        return UrgencyLevel.MEDIUM;
    }
  }

  private getFallbackResponse(language: LanguageType): {
    assessment: string;
    urgencyLevel: UrgencyLevel;
    recommendedAction: string;
  } {
    if (language === LanguageType.AMHARIC) {
      return {
        assessment: 'የAI ትንተና አሁን አይገኝም። እባክዎ ከጤና ባለሙያ ጋር ይማክሩ።',
        urgencyLevel: UrgencyLevel.MEDIUM,
        recommendedAction: 'ከጤና ባለሙያ ጋር ማማከር ይመከራል።',
      };
    }

    return {
      assessment: 'AI analysis is currently unavailable. Please consult with a healthcare professional.',
      urgencyLevel: UrgencyLevel.MEDIUM,
      recommendedAction: 'We recommend consulting with a healthcare provider for proper evaluation.',
    };
  }
}

