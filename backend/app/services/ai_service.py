# ============================================
# SKILLSYNC AI — AI / LLM SERVICE LAYER
# ============================================
import json
import logging
from typing import Optional, Dict, Any
from app.core.config import settings

logger = logging.getLogger(__name__)


class AIService:
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.LLM_MODEL
        self.client = None

        if self.api_key and self.api_key.startswith("sk-"):
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=self.api_key)
                logger.info("OpenAI client initialized successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI client: {e}")

    @property
    def is_configured(self) -> bool:
        return self.client is not None

    async def generate_completion(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float = 0.2,
        json_output: bool = True
    ) -> Optional[Dict[str, Any]]:
        """Safely invokes LLM with fallback, timeouts, and JSON parsing."""
        if not self.is_configured:
            return None

        try:
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
            response_format = {"type": "json_object"} if json_output else None

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                response_format=response_format,
                timeout=20.0
            )

            content = response.choices[0].message.content
            if json_output and content:
                return json.loads(content)
            return {"content": content}
        except Exception as e:
            logger.error(f"AI Service completion failed: {e}")
            return None


ai_service = AIService()
