<script lang="ts">
	export type Prop = {
		name: string;
		type: string;
		default?: string;
		description: string;
		required?: boolean;
	};

	type Props = {
		props: Prop[];
		class?: string;
	};

	let { props, class: cls = '' }: Props = $props();
</script>

<div class="props-wrap {cls}">
	<div class="props-scroll">
		<table class="props-table">
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				{#each props as prop}
					<tr>
						<td>
							<code class="prop-name">{prop.name}</code>
							{#if prop.required}
								<span class="prop-req">*</span>
							{/if}
						</td>
						<td><code class="prop-type">{prop.type}</code></td>
						<td>
							{#if prop.default !== undefined}
								<code class="prop-default">{prop.default}</code>
							{:else}
								<span class="prop-none">—</span>
							{/if}
						</td>
						<td class="prop-desc">{prop.description}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.props-wrap {
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		overflow: hidden;
	}

	.props-scroll {
		overflow-x: auto;
	}

	.props-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.8125rem;
	}

	thead {
		background: color-mix(in srgb, var(--muted) 80%, var(--background));
		border-bottom: 1px solid var(--border);
	}

	th {
		padding: 0.625rem 1rem;
		text-align: left;
		font-weight: 600;
		font-size: 0.72rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted-foreground);
		white-space: nowrap;
	}

	td {
		padding: 0.625rem 1rem;
		border-bottom: 1px solid var(--border);
		vertical-align: top;
		color: var(--foreground);
	}

	tbody tr:last-child td {
		border-bottom: none;
	}

	tbody tr:hover td {
		background: color-mix(in srgb, var(--muted) 50%, transparent);
	}

	.prop-name {
		font-family: ui-monospace, monospace;
		font-size: 0.78rem;
		color: var(--accent);
		background: color-mix(in srgb, var(--accent) 10%, transparent);
		padding: 0.1rem 0.35rem;
		border-radius: 0.3rem;
	}

	.prop-req {
		color: var(--destructive);
		font-size: 0.9rem;
		margin-left: 0.15rem;
	}

	.prop-type {
		font-family: ui-monospace, monospace;
		font-size: 0.75rem;
		color: #c792ea;
		background: color-mix(in srgb, #c792ea 8%, transparent);
		padding: 0.1rem 0.35rem;
		border-radius: 0.3rem;
		white-space: nowrap;
	}

	.prop-default {
		font-family: ui-monospace, monospace;
		font-size: 0.75rem;
		color: var(--muted-foreground);
		background: var(--muted);
		padding: 0.1rem 0.35rem;
		border-radius: 0.3rem;
	}

	.prop-none {
		color: var(--muted-foreground);
		opacity: 0.5;
	}

	.prop-desc {
		color: var(--muted-foreground);
		max-width: 24rem;
	}
</style>
