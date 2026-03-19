<script>
	let productName = $state('');
	let productDescription = $state('');
	let customerName = $state('');
	let customerContext = $state('');
	let tone = $state('friendly');
	let generating = $state(false);
	let result = $state('');
	let error = $state('');
	let copied = $state(false);

	const tones = [
		{ value: 'friendly', label: 'Friendly' },
		{ value: 'professional', label: 'Professional' },
		{ value: 'short', label: 'Short & Sweet' }
	];

	let canGenerate = $derived(
		productName.trim() !== '' &&
		productDescription.trim() !== '' &&
		customerName.trim() !== ''
	);

	async function handleGenerate() {
		generating = true;
		result = '';
		error = '';

		try {
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					productName,
					productDescription,
					customerName,
					customerContext,
					tone
				})
			});

			const data = await res.json();

			if (!res.ok) {
				error = data.error || 'Something went wrong';
			} else {
				result = data.email;
			}
		} catch (err) {
			error = 'Failed to connect to server';
		} finally {
			generating = false;
		}
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(result);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div class="page">
	<header>
		<h1>Testimonial Request Generator</h1>
		<p class="subtitle">For <a href="https://senja.io" target="_blank" rel="noopener">Senja</a> users who want more social proof</p>
	</header>

	<form onsubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
		<label>
			Product name
			<input type="text" bind:value={productName} required placeholder="e.g. PodCheck" />
		</label>

		<label>
			Product description
			<textarea rows="2" bind:value={productDescription} required placeholder="e.g. A podcast RSS feed health checker"></textarea>
		</label>

		<label>
			Customer name
			<input type="text" bind:value={customerName} required placeholder="e.g. Justin" />
		</label>

		<label>
			Customer context <span class="optional">(optional)</span>
			<textarea rows="3" bind:value={customerContext} placeholder="e.g. they used us for X and achieved Y"></textarea>
		</label>

		<fieldset class="tone-selector">
			<legend>Tone</legend>
			<div class="tone-buttons">
				{#each tones as t}
					<button
						type="button"
						class="tone-btn"
						class:active={tone === t.value}
						onclick={() => tone = t.value}
					>
						{t.label}
					</button>
				{/each}
			</div>
		</fieldset>

		<button type="submit" class="generate-btn" disabled={!canGenerate || generating}>
			{generating ? 'Generating...' : 'Generate'}
		</button>
	</form>

	{#if error}
		<p class="error">{error}</p>
	{/if}

	{#if result}
		<div class="result-card">
			<div class="result-header">
				<h2>Your Email</h2>
				<button class="copy-btn" onclick={copyToClipboard}>
					{copied ? 'Copied!' : 'Copy'}
				</button>
			</div>
			<pre class="result-text">{result}</pre>
			<button class="regenerate-btn" onclick={handleGenerate} disabled={generating}>
				{generating ? 'Generating...' : 'Regenerate'}
			</button>
			<p class="powered-by">Powered by Claude</p>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 600px;
		margin: 0 auto;
		padding: 48px 24px 64px;
	}

	header {
		text-align: center;
		margin-bottom: 40px;
	}

	h1 {
		font-size: 1.75rem;
		font-weight: 600;
		color: #111;
		margin-bottom: 8px;
	}

	.subtitle {
		font-size: 0.95rem;
		color: #666;
	}

	.subtitle a {
		color: #111;
		font-weight: 500;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.subtitle a:hover {
		color: #000;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 0.875rem;
		font-weight: 500;
		color: #333;
	}

	.optional {
		font-weight: 400;
		color: #999;
	}

	input,
	textarea {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.9375rem;
		padding: 10px 12px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		background: #fff;
		color: #111;
		transition: border-color 0.15s, box-shadow 0.15s;
		outline: none;
	}

	input:focus,
	textarea:focus {
		border-color: #111;
		box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.12);
	}

	input::placeholder,
	textarea::placeholder {
		color: #aaa;
	}

	textarea {
		resize: vertical;
	}

	.tone-selector {
		border: none;
		padding: 0;
	}

	.tone-selector legend {
		font-size: 0.875rem;
		font-weight: 500;
		color: #333;
		margin-bottom: 8px;
	}

	.tone-buttons {
		display: flex;
		gap: 8px;
	}

	.tone-btn {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		padding: 8px 18px;
		border-radius: 999px;
		border: 1px solid #d1d5db;
		background: #fff;
		color: #444;
		cursor: pointer;
		transition: all 0.15s;
	}

	.tone-btn:hover {
		border-color: #999;
		color: #111;
	}

	.tone-btn.active {
		background: #111;
		color: #fff;
		border-color: #111;
	}

	.generate-btn {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 1rem;
		font-weight: 600;
		padding: 14px;
		width: 100%;
		border: none;
		border-radius: 10px;
		background: #111;
		color: #fff;
		cursor: pointer;
		transition: background 0.15s;
		margin-top: 4px;
	}

	.generate-btn:hover:not(:disabled) {
		background: #333;
	}

	.generate-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error {
		margin-top: 16px;
		padding: 12px 16px;
		background: #fef2f2;
		border: 1px solid #fecaca;
		border-radius: 8px;
		color: #dc2626;
		font-size: 0.875rem;
	}

	.result-card {
		position: relative;
		margin-top: 32px;
		padding: 24px;
		background: #fff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 16px;
	}

	.result-header h2 {
		font-size: 1rem;
		font-weight: 600;
		color: #111;
	}

	.copy-btn {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.8125rem;
		font-weight: 500;
		padding: 6px 14px;
		border: 1px solid #d1d5db;
		border-radius: 6px;
		background: transparent;
		color: #444;
		cursor: pointer;
		transition: all 0.15s;
	}

	.copy-btn:hover {
		border-color: #111;
		color: #111;
	}

	.result-text {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.9375rem;
		line-height: 1.7;
		color: #333;
		white-space: pre-wrap;
		word-wrap: break-word;
		margin-bottom: 16px;
	}

	.regenerate-btn {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		font-size: 0.875rem;
		font-weight: 500;
		padding: 10px 20px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		background: #fff;
		color: #333;
		cursor: pointer;
		transition: all 0.15s;
	}

	.regenerate-btn:hover:not(:disabled) {
		border-color: #111;
		color: #111;
	}

	.regenerate-btn:disabled {
		color: #ccc;
		cursor: not-allowed;
	}

	.powered-by {
		margin-top: 16px;
		font-size: 0.75rem;
		color: #aaa;
		text-align: center;
	}

	@media (max-width: 480px) {
		.page {
			padding: 32px 16px 48px;
		}

		h1 {
			font-size: 1.5rem;
		}

		.tone-buttons {
			flex-wrap: wrap;
		}

		.tone-btn {
			flex: 1;
			text-align: center;
			min-width: 0;
		}
	}
</style>
