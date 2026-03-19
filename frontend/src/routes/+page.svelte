<script>
	let productName = $state('');
	let productDescription = $state('');
	let customerName = $state('');
	let customerContext = $state('');
	let tone = $state('friendly');

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
</script>

<h1>Testimonial Request Generator</h1>
<p class="subtitle">For <a href="https://senja.io" target="_blank" rel="noopener">Senja</a> users who want more social proof</p>

<form>
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

	<button type="submit" class="generate-btn" disabled={!canGenerate}>
		Generate
	</button>
</form>
