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

<h1>Testimonial Request Generator</h1>
<p class="subtitle">For <a href="https://senja.io" target="_blank" rel="noopener">Senja</a> users who want more social proof</p>

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
