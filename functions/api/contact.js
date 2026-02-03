/**
 * Cloudflare Pages Function - Contact Form
 * 
 * Handles contact form submissions securely on Cloudflare's edge.
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { name, email, message } = body;

        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: 'All fields are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
        // For now, log to Cloudflare's console (visible in dashboard)
        console.log('Contact form submission:', { name, email, message: message.substring(0, 100) });

        // Optional: Send to Discord webhook, email API, etc.
        if (env.DISCORD_WEBHOOK_URL) {
            await fetch(env.DISCORD_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `📬 **New Contact Form Submission**\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message.substring(0, 500)}`
                })
            });
        }

        return new Response(JSON.stringify({ success: true, message: 'Message received' }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Contact function error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
