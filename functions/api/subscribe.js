/**
 * Cloudflare Pages Function - Newsletter Subscribe
 * 
 * Handles newsletter subscriptions securely on Cloudflare's edge.
 */

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ error: 'Invalid email format' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        console.log('Newsletter subscription:', email);

        // TODO: Integrate with Mailchimp, ConvertKit, Buttondown, etc.
        // Example for Buttondown:
        // if (env.BUTTONDOWN_API_KEY) {
        //     await fetch('https://api.buttondown.email/v1/subscribers', {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': `Token ${env.BUTTONDOWN_API_KEY}`,
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({ email })
        //     });
        // }

        return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), {
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Subscribe function error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
