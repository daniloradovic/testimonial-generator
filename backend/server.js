const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  const { productName, productDescription, customerName, customerContext, tone } = req.body;

  if (!productName || !customerName) {
    return res.status(400).json({ error: 'productName and customerName are required' });
  }

  const prompt = `You are helping a SaaS founder ask a happy customer for a testimonial.

Product: ${productName}
Description: ${productDescription || 'N/A'}
Customer: ${customerName}
Context: ${customerContext || 'No specific context provided'}

Write a ${tone || 'friendly'} email asking ${customerName} for a testimonial.
Requirements:
- personalised and specific, not generic
- non-pushy and respectful of their time
- mentions what they achieved if context is provided
- includes a clear but soft call to action
- under 150 words
- no subject line needed, just the email body

Return only the email body, nothing else.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'Anthropic API error' });
    }

    const email = data.content[0].text;
    res.json({ email });
  } catch (err) {
    console.error('Error calling Anthropic API:', err);
    res.status(500).json({ error: 'Failed to generate email' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
