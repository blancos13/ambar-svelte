<script lang="ts">
	import Button from './Button.svelte';

	type Props = {
		code: string;
		lang?: string;
		lineNumbers?: boolean;
		collapsible?: boolean;
		collapseLines?: number;
		filename?: string;
		class?: string;
	};

	let {
		code,
		lang          = 'svelte',
		lineNumbers   = false,
		collapsible   = true,
		collapseLines = 4,
		filename,
		class: cls    = '',
	}: Props = $props();

	let copied   = $state(false);
	let expanded = $state(false);

	const lines  = $derived(code.split('\n'));
	const isLong = $derived(collapsible && lines.length > collapseLines);

	// collapsed height: N lines × 1.6 line-height × 0.8125rem font + 2rem padding
	const collapsedH = $derived(`calc(${collapseLines} * 1.6 * 0.8125rem + 2rem)`);

	function copy() {
		navigator.clipboard.writeText(code).then(() => {
			copied = true;
			setTimeout(() => { copied = false; }, 1800);
		});
	}

	// ── Tokeniser ──────────────────────────────────────────────────────────────
	function highlight(src: string, language: string): string {
		function esc(s: string) {
			return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		}

		if (language === 'bash' || language === 'sh') {
			return src.split('\n').map(line => {
				if (!line.trim()) return '';
				if (line.trimStart().startsWith('#')) return `<span class="t-comment">${esc(line)}</span>`;
				return line.split(/(\s+)/).map((tok, i) => {
					if (/^\s+$/.test(tok)) return tok;
					if (i === 0 && /^(npx|npm|pnpm|yarn|bun|node|git|cd|mkdir|cp|mv|rm|ls|cat|echo|export|source)$/.test(tok))
						return `<span class="t-cmd">${esc(tok)}</span>`;
					if (/^--?[\w-]+/.test(tok)) return `<span class="t-flag">${esc(tok)}</span>`;
					if (/^["']/.test(tok))       return `<span class="t-str">${esc(tok)}</span>`;
					return `<span class="t-arg">${esc(tok)}</span>`;
				}).join('');
			}).join('\n');
		}

		const KW = new Set([
			'import','export','from','default','as','type','interface',
			'let','const','var','function','return','if','else','for','while',
			'class','new','typeof','instanceof','extends','implements',
			'async','await','void','boolean','string','number','null',
			'undefined','true','false','in','of','switch','case','break',
			'continue','throw','try','catch','finally','static','readonly',
		]);

		return src.split('\n').map(line => {
			let out = ''; let i = 0; const n = line.length;
			while (i < n) {
				if (line[i]==='/'&&line[i+1]==='/') { out+=`<span class="t-comment">${esc(line.slice(i))}</span>`; break; }
				if (line[i]==='{' && /[#/:@]/.test(line[i+1]??'')) {
					const e = line.indexOf('}', i);
					if (e !== -1) { out += `<span class="t-svelte">${esc(line.slice(i, e+1))}</span>`; i = e+1; continue; }
				}
				if (line[i]==='{') { out += esc('{'); i++; continue; }
				for (const q of ['"',"'",'`']) {
					if (line[i]===q) {
						let j=i+1; while(j<n&&!(line[j]===q&&line[j-1]!=='\\'))j++;
						out += `<span class="t-str">${esc(line.slice(i,j+1))}</span>`; i=j+1; break;
					}
				}
				if (i < n && !['"',"'",'`'].includes(line[i])) {
					if (line[i]==='<'&&(line[i+1]==='/'||/[A-Za-z]/.test(line[i+1]??''))) {
						const cl=line[i+1]==='/';
						out += `<span class="t-punct">${cl?'&lt;/':'&lt;'}</span>`; i+=cl?2:1;
						let j=i; while(j<n&&/[\w-]/.test(line[j]))j++;
						if(j>i){out+=`<span class="t-tag">${esc(line.slice(i,j))}</span>`;i=j;} continue;
					}
					if (line[i]==='>') { out+=`<span class="t-punct">&gt;</span>`;i++;continue; }
					if (/[A-Za-z_$]/.test(line[i])) {
						let j=i; while(j<n&&/[\w$]/.test(line[j]))j++;
						const w=line.slice(i,j);
						out += KW.has(w)?`<span class="t-kw">${esc(w)}</span>`:esc(w); i=j; continue;
					}
					if (/[0-9]/.test(line[i])) {
						let j=i; while(j<n&&/[0-9.]/.test(line[j]))j++;
						out += `<span class="t-num">${esc(line.slice(i,j))}</span>`; i=j; continue;
					}
					out += esc(line[i]); i++;
				}
			}
			return out;
		}).join('\n');
	}

	const highlighted = $derived(highlight(code, lang));
</script>

<div class="cb {cls}">
	<!-- ── Top bar ── -->
	<div class="cb-bar">
		<div class="cb-bar-left">
			<span class="cb-dot cb-dot-r"></span>
			<span class="cb-dot cb-dot-y"></span>
			<span class="cb-dot cb-dot-g"></span>
			{#if filename}
				<span class="cb-filename">{filename}</span>
			{/if}
		</div>
		<div class="cb-bar-right">
			<span class="cb-lang-pill">{lang}</span>
			<button class="cb-copy-btn" onclick={copy} aria-label="Copy code">
				{#if copied}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="cb-icon"><path d="M20 6 9 17l-5-5"/></svg>
					Copied!
				{:else}
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cb-icon"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
					Copy
				{/if}
			</button>
		</div>
	</div>

	<!-- ── Code body ── -->
	<div class="cb-body" style="--max-h:{isLong && !expanded ? collapsedH : 'none'}">
		{#if lineNumbers}
			<div class="cb-gutter" aria-hidden="true">
				{#each lines as _, i}
					<span>{i + 1}</span>
				{/each}
			</div>
		{/if}
		<pre class="cb-pre"><code class="cb-code">{@html highlighted}</code></pre>
	</div>

	<!-- ── View Code veil ── -->
	{#if isLong && !expanded}
		<div class="cb-veil">
			<Button variant="secondary" size="sm" onclick={() => (expanded = true)} class="cb-view-btn">
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cb-icon"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
				View Code
			</Button>
		</div>
	{/if}

	<!-- ── Collapse row ── -->
	{#if isLong && expanded}
		<div class="cb-collapse-row">
			<Button variant="ghost" size="sm" onclick={() => (expanded = false)}>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="cb-icon"><polyline points="18 15 12 9 6 15"/></svg>
				Collapse
			</Button>
		</div>
	{/if}
</div>

<style>
	/* ── Shell ── */
	.cb {
		border-radius: 0.85rem;
		overflow: hidden;
		background: var(--cb-bg, var(--muted));
		border: 1px solid var(--border);
		position: relative;
		/* Ensure code block never forces the page wider than its container */
		max-width: 100%;
		min-width: 0;
	}

	/* ── Top bar ── */
	.cb-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.55rem 0.75rem 0.55rem 1rem;
		background: color-mix(in srgb, var(--border) 50%, var(--cb-bg, var(--muted)));
		border-bottom: 1px solid var(--border);
	}

	.cb-bar-left  { display: flex; align-items: center; gap: 0.45rem; }
	.cb-bar-right { display: flex; align-items: center; gap: 0.5rem; }

	/* macOS dots */
	.cb-dot {
		width: 0.65rem;
		height: 0.65rem;
		border-radius: 50%;
		display: block;
	}
	.cb-dot-r { background: #ff5f57; }
	.cb-dot-y { background: #febc2e; }
	.cb-dot-g { background: #28c840; }

	.cb-filename {
		font-family: ui-monospace, Menlo, monospace;
		font-size: 0.72rem;
		color: var(--muted-foreground);
		margin-left: 0.3rem;
	}

	.cb-lang-pill {
		font-size: 0.6rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted-foreground);
		background: color-mix(in srgb, var(--border) 60%, transparent);
		border: 1px solid var(--border);
		padding: 0.15rem 0.5rem;
		border-radius: 9999px;
	}

	.cb-copy-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.72rem;
		font-weight: 500;
		color: var(--muted-foreground);
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		padding: 0.2rem 0.55rem;
		border-radius: 0.4rem;
		transition: color 0.12s, border-color 0.12s, background 0.12s;
		line-height: 1;
	}
	.cb-copy-btn:hover {
		color: var(--foreground);
		border-color: var(--border);
		background: color-mix(in srgb, var(--foreground) 6%, transparent);
	}

	.cb-icon { width: 0.85rem; height: 0.85rem; flex-shrink: 0; }

	/* ── Code body ── */
	.cb-body {
		display: flex;
		max-height: var(--max-h, none);
		overflow: hidden;
	}

	/* ── Gutter ── */
	.cb-gutter {
		display: flex;
		flex-direction: column;
		padding: 1rem 0.75rem;
		border-right: 1px solid var(--border);
		user-select: none;
		flex-shrink: 0;
		min-width: 2.25rem;
		text-align: right;
	}
	.cb-gutter span {
		font-family: ui-monospace, Menlo, monospace;
		font-size: 0.8125rem;
		line-height: 1.6;
		color: var(--muted-foreground);
		opacity: 0.45;
	}

	/* ── Pre / Code ── */
	.cb-pre {
		margin: 0;
		padding: 1rem 1.25rem;
		overflow-x: auto;
		line-height: 1.6;
		font-size: 0.8125rem;
		flex: 1;
		scrollbar-width: thin;
		scrollbar-color: var(--border) transparent;
	}
	.cb-code {
		font-family: ui-monospace, 'Cascadia Code', 'Fira Code', Menlo, Monaco, Consolas, monospace;
		display: block;
	}

	/* ── Veil (View Code gradient) ── */
	.cb-veil {
		position: absolute;
		bottom: 0; left: 0; right: 0;
		height: 5rem;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 0.75rem;
		background: linear-gradient(
			to bottom,
			transparent,
			color-mix(in srgb, var(--muted) 65%, transparent),
			var(--muted)
		);
		pointer-events: none;
	}

	:global(.cb-view-btn) {
		pointer-events: all !important;
		box-shadow: 0 2px 8px color-mix(in srgb, var(--foreground) 10%, transparent) !important;
	}

	/* ── Collapse row ── */
	.cb-collapse-row {
		display: flex;
		justify-content: center;
		padding: 0.4rem;
		border-top: 1px solid var(--border);
		background: color-mix(in srgb, var(--border) 30%, var(--muted));
	}

	/* ─────────── Token colours — light mode ─────────── */
	:global(.t-kw)      { color: #0550ae; }
	:global(.t-str)     { color: #0a3069; }
	:global(.t-num)     { color: #953800; }
	:global(.t-comment) { color: #6e7781; font-style: italic; }
	:global(.t-tag)     { color: #116329; }
	:global(.t-punct)   { color: #24292f; }
	:global(.t-svelte)  { color: #8250df; }
	:global(.t-cmd)     { color: #0550ae; font-weight: 600; }
	:global(.t-flag)    { color: #953800; }
	:global(.t-arg)     { color: #24292f; }

	/* ─────────── Token colours — dark mode ─────────── */
	:global(html.dark) :global(.t-kw)      { color: #ff7b72; }
	:global(html.dark) :global(.t-str)     { color: #a5d6ff; }
	:global(html.dark) :global(.t-num)     { color: #79c0ff; }
	:global(html.dark) :global(.t-comment) { color: #8b949e; }
	:global(html.dark) :global(.t-tag)     { color: #7ee787; }
	:global(html.dark) :global(.t-punct)   { color: #e6edf3; }
	:global(html.dark) :global(.t-svelte)  { color: #d2a8ff; }
	:global(html.dark) :global(.t-cmd)     { color: #ff7b72; font-weight: 600; }
	:global(html.dark) :global(.t-flag)    { color: #ffa657; }
	:global(html.dark) :global(.t-arg)     { color: #e6edf3; }
</style>
