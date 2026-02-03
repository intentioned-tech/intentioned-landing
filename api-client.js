/**
 * Intentioned API Client
 * 
 * Secure client-side functions for calling backend API proxy.
 * All API keys are stored server-side - this file contains NO secrets.
 * 
 * Usage:
 *   import { generateAIResponse, textToSpeech, speechToText } from './api-client.js';
 *   
 *   const response = await generateAIResponse('Hello, how are you?');
 *   console.log(response.content);
 */

const API_BASE = ''; // Empty for same-origin, or set to your server URL

/**
 * Generate AI text response via secure backend proxy
 * @param {string} prompt - The user's prompt
 * @param {Object} options - Optional parameters
 * @param {string} options.model - AI model to use (default: 'gpt-4o-mini')
 * @param {number} options.max_tokens - Maximum tokens (default: 2000)
 * @param {number} options.temperature - Creativity level 0-1 (default: 0.7)
 * @param {string} options.system_prompt - System context/instructions
 * @returns {Promise<{success: boolean, content: string, usage?: Object}>}
 */
export async function generateAIResponse(prompt, options = {}) {
    try {
        const response = await fetch(`${API_BASE}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                model: options.model || 'gpt-4o-mini',
                max_tokens: options.max_tokens || 2000,
                temperature: options.temperature || 0.7,
                system_prompt: options.system_prompt || ''
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.details || error.error || 'AI request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('AI Generation Error:', error);
        return { success: false, content: '', error: error.message };
    }
}

/**
 * Generate AI response using Anthropic Claude via secure backend proxy
 * @param {string} prompt - The user's prompt
 * @param {Object} options - Optional parameters
 * @returns {Promise<{success: boolean, content: string, usage?: Object}>}
 */
export async function generateClaudeResponse(prompt, options = {}) {
    try {
        const response = await fetch(`${API_BASE}/api/anthropic/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt,
                model: options.model || 'claude-3-haiku-20240307',
                max_tokens: options.max_tokens || 2000,
                system_prompt: options.system_prompt || ''
            })
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.details || error.error || 'Claude request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Claude Generation Error:', error);
        return { success: false, content: '', error: error.message };
    }
}

/**
 * Convert text to speech via secure backend proxy
 * @param {string} text - Text to convert to speech
 * @param {Object} options - Optional parameters
 * @param {string} options.voice - Voice ID (default: 'alloy')
 * @param {string} options.model - TTS model (default: 'tts-1')
 * @returns {Promise<Blob>} Audio blob
 */
export async function textToSpeech(text, options = {}) {
    try {
        const response = await fetch(`${API_BASE}/api/tts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text,
                voice: options.voice || 'alloy',
                model: options.model || 'tts-1'
            })
        });

        if (!response.ok) {
            throw new Error('TTS request failed');
        }

        return await response.blob();
    } catch (error) {
        console.error('TTS Error:', error);
        throw error;
    }
}

/**
 * Convert speech to text via secure backend proxy
 * @param {Blob} audioBlob - Audio data to transcribe
 * @returns {Promise<{success: boolean, text: string}>}
 */
export async function speechToText(audioBlob) {
    try {
        const response = await fetch(`${API_BASE}/api/stt`, {
            method: 'POST',
            headers: {
                'Content-Type': audioBlob.type || 'audio/webm'
            },
            body: audioBlob
        });

        if (!response.ok) {
            throw new Error('STT request failed');
        }

        return await response.json();
    } catch (error) {
        console.error('STT Error:', error);
        return { success: false, text: '', error: error.message };
    }
}

/**
 * Check server health and API key configuration
 * @returns {Promise<{status: string, services: Object}>}
 */
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/api/health`);
        return await response.json();
    } catch (error) {
        return { status: 'error', error: error.message };
    }
}

// Legacy/non-module support
if (typeof window !== 'undefined') {
    window.IntentionedAPI = {
        generateAIResponse,
        generateClaudeResponse,
        textToSpeech,
        speechToText,
        checkHealth
    };
}
