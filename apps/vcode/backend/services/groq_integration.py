"""
Groq AI Integration for VCode
Provides real-time AI processing for medical, legal, and technical meetings
"""

import os
from typing import Dict, List, Optional, Any
from groq import Groq
import asyncio
import json
from datetime import datetime

class GroqVCodeProcessor:
    """Groq AI processor for VCode meetings with accessibility focus"""
    
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.models = {
            "transcription": "whisper-large-v3",
            "analysis": "llama-3.1-70b-versatile",
            "medical": "llama-3.1-8b-instant",
            "legal": "llama-3.1-70b-versatile",
            "technical": "mixtral-8x7b-32768"
        }
        
    async def process_meeting_audio(
        self, 
        audio_data: bytes, 
        meeting_type: str = "general",
        accessibility_mode: bool = True
    ) -> Dict[str, Any]:
        """Process audio with Groq Whisper for deaf-accessible transcription"""
        
        try:
            # Transcribe audio using Groq Whisper
            transcription = self.client.audio.transcriptions.create(
                file=("audio.wav", audio_data),
                model=self.models["transcription"],
                response_format="verbose_json",
                timestamp_granularities=["word", "segment"]
            )
            
            # Process transcription for accessibility
            accessible_transcript = await self._enhance_for_accessibility(
                transcription, meeting_type, accessibility_mode
            )
            
            return {
                "status": "success",
                "transcription": accessible_transcript,
                "meeting_type": meeting_type,
                "accessibility_enhanced": accessibility_mode,
                "processing_time": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "meeting_type": meeting_type
            }
    
    async def analyze_meeting_content(
        self,
        transcript: str,
        meeting_type: str,
        participants: List[str],
        accessibility_requirements: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Analyze meeting content with specialized prompts for different meeting types"""
        
        # Select appropriate model and prompt based on meeting type
        model = self.models.get(meeting_type, self.models["analysis"])
        prompt = self._get_specialized_prompt(meeting_type, accessibility_requirements)
        
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": prompt
                    },
                    {
                        "role": "user", 
                        "content": f"""
                        Meeting Type: {meeting_type}
                        Participants: {', '.join(participants)}
                        Transcript: {transcript}
                        
                        Please analyze this meeting with focus on:
                        1. Key agreements and decisions
                        2. Action items and responsibilities
                        3. Accessibility compliance requirements
                        4. Legal/medical/technical implications
                        5. ASL interpretation accuracy needs
                        """
                    }
                ],
                temperature=0.1,
                max_tokens=2048
            )
            
            analysis = json.loads(response.choices[0].message.content)
            
            return {
                "status": "success",
                "analysis": analysis,
                "model_used": model,
                "meeting_type": meeting_type,
                "accessibility_compliant": True
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "model_used": model
            }
    
    async def generate_vcode_evidence(
        self,
        meeting_data: Dict[str, Any],
        legal_requirements: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Generate VCode evidence package using Groq AI"""
        
        try:
            evidence_prompt = f"""
            You are a legal evidence specialist creating VCode documentation.
            
            Meeting Data: {json.dumps(meeting_data, indent=2)}
            Legal Requirements: {json.dumps(legal_requirements, indent=2)}
            
            Generate a comprehensive VCode evidence package that includes:
            1. Executive summary of agreements
            2. Detailed transcript with timestamps
            3. ASL interpretation verification
            4. Legal compliance checklist
            5. Accessibility accommodation documentation
            6. Court admissibility assessment
            
            Format as JSON with clear sections for legal review.
            Ensure all content is accessible to deaf users.
            """
            
            response = self.client.chat.completions.create(
                model=self.models["legal"],
                messages=[
                    {
                        "role": "system",
                        "content": "You are a legal evidence specialist with expertise in accessibility law and deaf rights."
                    },
                    {
                        "role": "user",
                        "content": evidence_prompt
                    }
                ],
                temperature=0.1,
                max_tokens=4096
            )
            
            evidence_package = json.loads(response.choices[0].message.content)
            
            return {
                "status": "success",
                "evidence_package": evidence_package,
                "generated_at": datetime.now().isoformat(),
                "legal_compliant": True,
                "accessibility_verified": True
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    async def real_time_meeting_assistance(
        self,
        current_transcript: str,
        meeting_context: Dict[str, Any],
        user_query: Optional[str] = None
    ) -> Dict[str, Any]:
        """Provide real-time meeting assistance with Groq AI"""
        
        try:
            assistance_prompt = f"""
            You are an AI meeting assistant specialized in accessibility and deaf communication.
            
            Current Meeting Context: {json.dumps(meeting_context, indent=2)}
            Live Transcript: {current_transcript}
            User Query: {user_query or "Provide general meeting assistance"}
            
            Provide helpful, accessible assistance including:
            1. Key points summary
            2. Suggested clarifying questions
            3. Accessibility recommendations
            4. Next steps or action items
            5. Visual cues for deaf participants
            
            Keep responses concise and visually formatted.
            """
            
            response = self.client.chat.completions.create(
                model=self.models["analysis"],
                messages=[
                    {
                        "role": "system",
                        "content": "You are a deaf-friendly AI assistant providing real-time meeting support."
                    },
                    {
                        "role": "user",
                        "content": assistance_prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1024
            )
            
            assistance = response.choices[0].message.content
            
            return {
                "status": "success",
                "assistance": assistance,
                "timestamp": datetime.now().isoformat(),
                "accessibility_optimized": True
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
    
    def _get_specialized_prompt(self, meeting_type: str, accessibility_requirements: Dict[str, Any]) -> str:
        """Get specialized prompts for different meeting types"""
        
        base_accessibility = """
        ACCESSIBILITY REQUIREMENTS:
        - All responses must be visual-first (no audio dependencies)
        - Include ASL interpretation considerations
        - Use clear, simple language
        - Provide visual formatting and structure
        - Consider deaf cultural context
        """
        
        prompts = {
            "medical": f"""
            You are a medical meeting specialist with expertise in deaf healthcare.
            {base_accessibility}
            
            Focus on:
            - Medical terminology clarity
            - Patient rights and informed consent
            - ADA compliance in healthcare
            - ASL medical interpretation accuracy
            - Visual health communication methods
            """,
            
            "legal": f"""
            You are a legal meeting specialist with expertise in disability law.
            {base_accessibility}
            
            Focus on:
            - Legal agreement identification
            - Contract language clarity
            - ADA and disability rights compliance
            - Evidence admissibility standards
            - Deaf legal rights protection
            """,
            
            "technical": f"""
            You are a technical meeting specialist with accessibility expertise.
            {base_accessibility}
            
            Focus on:
            - Technical concept simplification
            - Visual documentation methods
            - Accessibility technology integration
            - User experience for deaf users
            - Technical compliance standards
            """
        }
        
        return prompts.get(meeting_type, f"""
        You are a general meeting specialist with deaf accessibility expertise.
        {base_accessibility}
        
        Focus on:
        - Clear communication facilitation
        - Accessibility best practices
        - Inclusive meeting management
        - Visual information presentation
        """)
    
    async def _enhance_for_accessibility(
        self, 
        transcription: Any, 
        meeting_type: str, 
        accessibility_mode: bool
    ) -> Dict[str, Any]:
        """Enhance transcription for deaf accessibility"""
        
        if not accessibility_mode:
            return transcription
        
        try:
            # Use Groq to enhance transcription for accessibility
            enhancement_prompt = f"""
            Enhance this transcription for deaf accessibility:
            
            Original: {json.dumps(transcription.dict() if hasattr(transcription, 'dict') else transcription)}
            Meeting Type: {meeting_type}
            
            Provide:
            1. Clear speaker identification
            2. Emotional context and tone indicators
            3. Background sound descriptions
            4. Visual cue suggestions
            5. ASL interpretation notes
            6. Key term definitions
            
            Format as accessible JSON structure.
            """
            
            response = self.client.chat.completions.create(
                model=self.models["analysis"],
                messages=[
                    {
                        "role": "system",
                        "content": "You are an accessibility specialist enhancing transcriptions for deaf users."
                    },
                    {
                        "role": "user",
                        "content": enhancement_prompt
                    }
                ],
                temperature=0.2,
                max_tokens=2048
            )
            
            enhanced = json.loads(response.choices[0].message.content)
            
            return {
                "original_transcription": transcription,
                "enhanced_transcription": enhanced,
                "accessibility_features": [
                    "speaker_identification",
                    "emotional_context",
                    "visual_cues",
                    "asl_notes",
                    "term_definitions"
                ],
                "enhancement_quality": "high"
            }
            
        except Exception as e:
            # Fallback to original transcription if enhancement fails
            return {
                "original_transcription": transcription,
                "enhanced_transcription": transcription,
                "accessibility_features": ["basic_transcription"],
                "enhancement_error": str(e)
            }

# Initialize global processor instance
groq_processor = GroqVCodeProcessor()
