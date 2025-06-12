import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import * as fs from 'fs';
import { MedicalImageType } from '../common/enums';

@Injectable()
export class AiDiagnosticsService {
  private readonly logger = new Logger(AiDiagnosticsService.name);
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeImage(
    imagePath: string,
    imageType: MedicalImageType,
    description?: string,
  ): Promise<{
    analysisResult: any;
    confidenceScore: number;
  }> {
    try {
      // Read image file and convert to base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.getMimeType(imagePath);

      const systemPrompt = this.getImageAnalysisPrompt(imageType);
      const userPrompt = description 
        ? `Please analyze this ${imageType} image. Additional context: ${description}`
        : `Please analyze this ${imageType} image.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { type: 'text', text: userPrompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`,
                  detail: 'high',
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
        temperature: 0.2,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('No response from OpenAI Vision');
      }

      return this.parseImageAnalysisResponse(response, imageType);
    } catch (error) {
      this.logger.error('Error analyzing medical image:', error);
      return this.getFallbackImageAnalysis(imageType);
    }
  }

  private getImageAnalysisPrompt(imageType: MedicalImageType): string {
    const basePrompt = `You are a medical AI assistant specializing in medical image analysis. 

IMPORTANT DISCLAIMERS:
- This is a preliminary AI analysis only
- NOT a substitute for professional medical diagnosis
- Always recommend professional medical review
- Highlight any limitations in the analysis

Response format (JSON):
{
  "findings": ["List of observed findings"],
  "confidence": 0.0-1.0,
  "recommendations": ["List of recommendations"],
  "limitations": ["Any limitations in the analysis"],
  "urgency": "LOW|MEDIUM|HIGH|EMERGENCY"
}`;

    const typeSpecificPrompts = {
      [MedicalImageType.XRAY]: `
Analyze this X-ray image for:
- Bone fractures or abnormalities
- Lung consolidation or pneumonia signs
- Heart size and shape
- Foreign objects
- Overall image quality`,

      [MedicalImageType.SKIN_LESION]: `
Analyze this skin lesion image for:
- Size, shape, and color characteristics
- Border irregularities
- Asymmetry
- Color variations
- Surface texture
- Signs requiring immediate attention`,

      [MedicalImageType.LAB_RESULT]: `
Analyze this lab result image for:
- Abnormal values
- Critical results
- Trends if multiple results
- Values requiring immediate attention`,

      [MedicalImageType.PRESCRIPTION]: `
Analyze this prescription image for:
- Medication names and dosages
- Potential drug interactions
- Dosage appropriateness
- Prescription clarity and completeness`,

      [MedicalImageType.OTHER]: `
Analyze this medical image for:
- Any visible abnormalities
- Areas of concern
- Image quality and clarity
- Recommendations for better imaging if needed`,
    };

    return basePrompt + '\n\n' + (typeSpecificPrompts[imageType] || typeSpecificPrompts[MedicalImageType.OTHER]);
  }

  private parseImageAnalysisResponse(response: string, imageType: MedicalImageType): {
    analysisResult: any;
    confidenceScore: number;
  } {
    try {
      const parsed = JSON.parse(response);
      
      return {
        analysisResult: {
          findings: parsed.findings || [],
          recommendations: parsed.recommendations || [],
          limitations: parsed.limitations || [],
          urgency: parsed.urgency || 'MEDIUM',
          imageType,
          analysisDate: new Date().toISOString(),
        },
        confidenceScore: parsed.confidence || 0.5,
      };
    } catch (error) {
      // Fallback parsing for non-JSON responses
      return {
        analysisResult: {
          findings: [response.substring(0, 500)],
          recommendations: ['Professional medical review recommended'],
          limitations: ['AI analysis has limitations and should not replace professional diagnosis'],
          urgency: 'MEDIUM',
          imageType,
          analysisDate: new Date().toISOString(),
        },
        confidenceScore: 0.5,
      };
    }
  }

  private getFallbackImageAnalysis(imageType: MedicalImageType): {
    analysisResult: any;
    confidenceScore: number;
  } {
    return {
      analysisResult: {
        findings: ['AI analysis currently unavailable'],
        recommendations: ['Please have this image reviewed by a qualified healthcare professional'],
        limitations: ['AI analysis service is temporarily unavailable'],
        urgency: 'MEDIUM',
        imageType,
        analysisDate: new Date().toISOString(),
      },
      confidenceScore: 0.0,
    };
  }

  private getMimeType(filePath: string): string {
    const extension = filePath.split('.').pop()?.toLowerCase();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
    };
    return mimeTypes[extension] || 'image/jpeg';
  }

  async generateImageReport(analysisResult: any, patientInfo?: any): Promise<string> {
    try {
      const reportPrompt = `Generate a professional medical image analysis report based on the following AI analysis:

Analysis Results: ${JSON.stringify(analysisResult)}
${patientInfo ? `Patient Context: ${JSON.stringify(patientInfo)}` : ''}

Please create a structured report that includes:
1. Executive Summary
2. Detailed Findings
3. Clinical Recommendations
4. Limitations and Disclaimers
5. Next Steps

Format as a professional medical report suitable for healthcare providers.`;

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a medical AI assistant generating professional medical reports. Always include appropriate disclaimers about AI limitations.',
          },
          { role: 'user', content: reportPrompt },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      });

      return completion.choices[0]?.message?.content || 'Report generation failed';
    } catch (error) {
      this.logger.error('Error generating image report:', error);
      return 'Report generation is currently unavailable. Please consult with a healthcare professional for image interpretation.';
    }
  }
}

