/**
 * Cloudflare Pages Function - AI Generate Proxy
 * 
 * This function runs on Cloudflare's edge network and proxies
 * requests to OpenAI while keeping API keys secure.
 * 
 * Environment Variables (set in Cloudflare Dashboard):
 * - OPENAI_API_KEY: Your OpenAI API key
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { prompt, model = 'gpt-4o-mini', max_tokens = 1000 } = body;

        if (!prompt) {
            return new Response(JSON.stringify({ error: 'Prompt is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!env.OPENAI_API_KEY) {
            console.error('OPENAI_API_KEY not configured in Cloudflare environment');
            return new Response(JSON.stringify({ error: 'Server configuration error' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: prompt }],
                max_tokens: max_tokens
            })
        });

        if (!openaiResponse.ok) {
            const errorData = await openaiResponse.json().catch(() => ({}));
            console.error('OpenAI API error:', openaiResponse.status, errorData);
            return new Response(JSON.stringify({ 
                error: 'AI service error', 
                details: errorData.error?.message || 'Unknown error' 
            }), {
                status: openaiResponse.status,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await openaiResponse.json();
        return new Response(JSON.stringify({
            success: true,
            content: data.choices[0]?.message?.content || '',
            usage: data.usage
        }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Generate function error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
