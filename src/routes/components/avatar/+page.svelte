<script lang="ts">
	import Avatar      from '$lib/components/Avatar.svelte';
	import AvatarGroup from '$lib/components/AvatarGroup.svelte';
	import CodeBlock   from '$lib/components/CodeBlock.svelte';
	import PropsTable  from '$lib/components/PropsTable.svelte';

	type Size   = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	type Status = 'online' | 'away' | 'busy' | 'offline' | 'none';

	const sizes:    Size[]   = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
	const statuses: Status[] = ['online', 'away', 'busy', 'offline'];

	const people = [
		{ name: 'Zeynep Kaya'   },
		{ name: 'Mert Aydın'    },
		{ name: 'Selin Çelik'   },
		{ name: 'Baran Yılmaz'  },
		{ name: 'Ece Demir'     },
		{ name: 'Can Öztürk'    },
		{ name: 'Lara Şahin'    },
		{ name: 'Kemal Arslan'  },
	];

	const importCode = `import Avatar from '$lib/components/Avatar.svelte';
import AvatarGroup from '$lib/components/AvatarGroup.svelte';`;

	const usageCode = `<Avatar src="https://..." name="Jane Doe" size="md" />`;

	const sizesCode = `<Avatar name="Zeynep Kaya" size="xs" />
<Avatar name="Zeynep Kaya" size="sm" />
<Avatar name="Zeynep Kaya" size="md" />
<Avatar name="Zeynep Kaya" size="lg" />
<Avatar name="Zeynep Kaya" size="xl" />
<Avatar name="Zeynep Kaya" size="2xl" />`;

	const fallbackCode = `<!-- image → initials → icon fallback chain -->
<Avatar src="https://i.pravatar.cc/150?img=47" name="Jane Doe" size="lg" />
<Avatar name="Jane Doe" size="lg" />
<Avatar size="lg" />`;

	const statusCode = `<Avatar name="Zeynep Kaya" size="lg" status="online" />
<Avatar name="Mert Aydın"  size="lg" status="away"   />
<Avatar name="Selin Çelik" size="lg" status="busy"   />
<Avatar name="Baran Kaya"  size="lg" status="offline" />`;

	const groupCode = `<AvatarGroup avatars={people} max={5} size="md" overlap="md" />`;

	const avatarProps = [
		{ name: 'src',    type: 'string',                                                  description: 'Image URL. Falls back to initials or icon if omitted or fails to load.' },
		{ name: 'name',   type: 'string',                                   default: "''",  description: 'Full name used to derive initials and generate a consistent color.' },
		{ name: 'size',   type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'", description: 'Avatar size preset.' },
		{ name: 'shape',  type: "'circle' | 'square'",                       default: "'circle'", description: 'Border-radius shape of the avatar.' },
		{ name: 'status', type: "'online' | 'away' | 'busy' | 'offline' | 'none'", default: "'none'", description: 'Shows a colored status dot. online pulses.' },
		{ name: 'class',  type: 'string',                                    description: 'Extra CSS classes forwarded to the root element.' },
	];

	const groupProps = [
		{ name: 'avatars',  type: 'Array<{ src?: string; name?: string }>', description: 'List of avatar data objects to display.' },
		{ name: 'max',      type: 'number',                  default: '5',         description: 'Maximum number of avatars to show before the overflow counter.' },
		{ name: 'size',     type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'", default: "'md'", description: 'Size of each avatar in the group.' },
		{ name: 'shape',    type: "'circle' | 'square'",     default: "'circle'",  description: 'Shape of each avatar in the group.' },
		{ name: 'overlap',  type: "'sm' | 'md' | 'lg'",      default: "'md'",      description: 'Controls how much avatars overlap each other.' },
	];
</script>

<!-- Header -->
<div class="comp-header">
	<div class="comp-header-top">
		<h1 class="comp-title">Avatar</h1>
	</div>
	<p class="comp-desc">Image, initials, and icon fallbacks — 6 sizes, 2 shapes, status indicator, and group stacking.</p>
</div>

<!-- Import -->
<section class="doc-section">
	<h2 class="doc-section-title">Import</h2>
	<CodeBlock code={importCode} lang="ts" />
</section>

<!-- Usage -->
<section class="doc-section">
	<h2 class="doc-section-title">Usage</h2>
	<div class="preview-box">
		<Avatar src="https://i.pravatar.cc/150?img=47" name="Zeynep Kaya" size="md" />
	</div>
	<CodeBlock code={usageCode} lang="svelte" />
</section>

<!-- Sizes -->
<section class="doc-section">
	<h2 class="doc-section-title">Sizes</h2>
	<p class="doc-section-desc">xs · sm · md · lg · xl · 2xl</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-end gap-5">
			{#each sizes as size}
				<div class="flex flex-col items-center gap-2">
					<Avatar name="Zeynep Kaya" {size} />
					<span class="text-xs text-muted-foreground">{size}</span>
				</div>
			{/each}
		</div>
	</div>
	<CodeBlock code={sizesCode} lang="svelte" />
</section>

<!-- Fallbacks -->
<section class="doc-section">
	<h2 class="doc-section-title">Fallbacks</h2>
	<p class="doc-section-desc">image → initials → icon</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-8">
			<div class="flex flex-col items-center gap-2">
				<Avatar src="https://i.pravatar.cc/150?img=47" name="Zeynep Kaya" size="lg" />
				<span class="text-xs text-muted-foreground">image</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Avatar name="Zeynep Kaya" size="lg" />
				<span class="text-xs text-muted-foreground">initials</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Avatar size="lg" />
				<span class="text-xs text-muted-foreground">icon</span>
			</div>
		</div>
	</div>
	<CodeBlock code={fallbackCode} lang="svelte" />
</section>

<!-- Shapes -->
<section class="doc-section">
	<h2 class="doc-section-title">Shapes</h2>
	<p class="doc-section-desc">circle · square</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-end gap-6">
			<div class="flex flex-col items-center gap-2">
				<Avatar name="Mert Aydın" size="lg" shape="circle" />
				<span class="text-xs text-muted-foreground">circle</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Avatar name="Mert Aydın" size="lg" shape="square" />
				<span class="text-xs text-muted-foreground">square</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Avatar src="https://i.pravatar.cc/150?img=12" name="Selin" size="lg" shape="circle" />
				<span class="text-xs text-muted-foreground">circle + img</span>
			</div>
			<div class="flex flex-col items-center gap-2">
				<Avatar src="https://i.pravatar.cc/150?img=12" name="Selin" size="lg" shape="square" />
				<span class="text-xs text-muted-foreground">square + img</span>
			</div>
		</div>
	</div>
</section>

<!-- Initials & Colors -->
<section class="doc-section">
	<h2 class="doc-section-title">Initials & Colors</h2>
	<p class="doc-section-desc">Color is auto-generated from the name.</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-4">
			{#each people as p}
				<div class="flex flex-col items-center gap-2">
					<Avatar name={p.name} size="md" />
					<span class="text-xs text-muted-foreground">{p.name.split(' ')[0]}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Status -->
<section class="doc-section">
	<h2 class="doc-section-title">Status</h2>
	<p class="doc-section-desc">online (pulse) · away · busy · offline</p>
	<div class="preview-box">
		<div class="flex flex-wrap items-center gap-8">
			{#each statuses as status}
				<div class="flex flex-col items-center gap-2">
					<Avatar name="Zeynep Kaya" size="lg" {status} />
					<span class="text-xs text-muted-foreground">{status}</span>
				</div>
			{/each}
		</div>
	</div>
	<CodeBlock code={statusCode} lang="svelte" />
</section>

<!-- Group -->
<section class="doc-section">
	<h2 class="doc-section-title">Group</h2>
	<p class="doc-section-desc">Stack — max, overlap, size, and shape are configurable.</p>
	<div class="preview-box">
		<div class="space-y-6">
			{#each [
				{ label: 'overlap: sm', overlap: 'sm' as const },
				{ label: 'overlap: md', overlap: 'md' as const },
				{ label: 'overlap: lg', overlap: 'lg' as const },
			] as row}
				<div class="flex items-center gap-6">
					<span class="w-28 text-xs text-muted-foreground shrink-0">{row.label}</span>
					<AvatarGroup avatars={people} max={5} size="md" overlap={row.overlap} />
				</div>
			{/each}
			<div class="flex items-center gap-6">
				<span class="w-28 text-xs text-muted-foreground shrink-0">lg · square</span>
				<AvatarGroup avatars={people} max={4} size="lg" shape="square" overlap="md" />
			</div>
		</div>
	</div>
	<CodeBlock code={groupCode} lang="svelte" />
</section>

<!-- Use Cases -->
<section class="doc-section">
	<h2 class="doc-section-title">Use Cases</h2>
	<p class="doc-section-desc">Real-world examples.</p>
	<div class="preview-box preview-box-stacked">
		<div class="grid grid-cols-1 gap-4 w-full sm:grid-cols-2">

			<div class="rounded-2xl border border-border bg-card p-5 space-y-4">
				<p class="text-xs font-medium text-muted-foreground">Comment Thread</p>
				{#each [
					{ name: 'Zeynep Kaya', status: 'online'  as Status, text: 'This animation is amazing!', time: '1m' },
					{ name: 'Mert Aydın',  status: 'away'    as Status, text: "I think the same.", time: '3m' },
					{ name: 'Selin Çelik', status: 'offline' as Status, text: 'Can you share the source code?', time: '12m' },
				] as c}
					<div class="flex gap-3">
						<Avatar name={c.name} size="sm" status={c.status} />
						<div class="flex-1">
							<div class="flex items-baseline gap-2 mb-1">
								<span class="text-sm font-semibold text-foreground">{c.name.split(' ')[0]}</span>
								<span class="text-xs text-muted-foreground">{c.time} ago</span>
							</div>
							<p class="text-sm text-muted-foreground">{c.text}</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="rounded-2xl border border-border bg-card p-5 space-y-4">
				<p class="text-xs font-medium text-muted-foreground">Team Card</p>
				<div class="flex items-center justify-between">
					<div>
						<p class="text-sm font-semibold text-foreground">Design Team</p>
						<p class="text-xs text-muted-foreground mt-0.5">8 members · 3 active</p>
					</div>
					<AvatarGroup avatars={people.slice(0,5)} max={4} size="sm" />
				</div>
				<div class="h-px bg-border"></div>
				{#each people.slice(0, 4) as p, i}
					{@const st = (['online','online','away','offline'] as Status[])[i]}
					<div class="flex items-center gap-3">
						<Avatar name={p.name} size="sm" status={st} />
						<span class="flex-1 text-sm font-medium text-foreground">{p.name}</span>
						<span class="text-xs px-2 py-0.5 rounded-full
							{st === 'online' ? 'bg-emerald-500/15 text-emerald-500' :
							 st === 'away'   ? 'bg-amber-400/15  text-amber-500'   :
							                   'bg-muted text-muted-foreground'}">
							{st}
						</span>
					</div>
				{/each}
			</div>

			<div class="rounded-2xl border border-border bg-card p-5 space-y-3">
				<p class="text-xs font-medium text-muted-foreground">Notifications</p>
				{#each [
					{ name: 'Zeynep Kaya',  action: 'liked your video',     time: '1m'  },
					{ name: 'Mert Aydın',   action: 'started following you', time: '5m'  },
					{ name: 'Selin Çelik',  action: 'left a comment',        time: '12m' },
					{ name: 'Baran Yılmaz', action: 'viewed your story',     time: '1h'  },
				] as n}
					<div class="flex items-center gap-3">
						<Avatar name={n.name} size="sm" />
						<p class="flex-1 text-sm">
							<span class="font-semibold text-foreground">{n.name.split(' ')[0]}</span>
							<span class="text-muted-foreground"> {n.action}</span>
						</p>
						<span class="text-xs text-muted-foreground shrink-0">{n.time}</span>
					</div>
				{/each}
			</div>

			<div class="rounded-2xl border border-border bg-card p-5 space-y-4">
				<p class="text-xs font-medium text-muted-foreground">Liked By</p>
				<div class="flex items-center gap-3">
					<AvatarGroup avatars={people.slice(0, 6)} max={5} size="sm" overlap="md" />
					<p class="text-sm text-muted-foreground">
						<span class="font-semibold text-foreground">{people[0].name.split(' ')[0]}</span>,
						<span class="font-semibold text-foreground">{people[1].name.split(' ')[0]}</span>
						and <span class="font-semibold text-foreground">{people.length - 2} others</span> liked this.
					</p>
				</div>
				<div class="h-px bg-border"></div>
				<div class="flex items-center gap-3">
					<AvatarGroup avatars={people} max={3} size="xs" overlap="sm" />
					<p class="text-xs text-muted-foreground">{people.length} members joined this group</p>
				</div>
			</div>

		</div>
	</div>
</section>

<!-- API Reference — Avatar -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference — Avatar</h2>
	<PropsTable props={avatarProps} />
</section>

<!-- API Reference — AvatarGroup -->
<section class="doc-section">
	<h2 class="doc-section-title">API Reference — AvatarGroup</h2>
	<PropsTable props={groupProps} />
</section>

<style>
	.comp-header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border); }
	.comp-header-top { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
	.comp-title { font-size: 1.875rem; font-weight: 800; letter-spacing: -0.025em; color: var(--foreground); }
	.comp-badge { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; background: color-mix(in srgb, var(--accent) 15%, transparent); color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent); padding: 0.15rem 0.5rem; border-radius: 9999px; }
	.comp-desc { color: var(--muted-foreground); font-size: 0.9375rem; line-height: 1.6; margin-bottom: 1rem; }
	.doc-section { margin-bottom: 2.5rem; display: flex; flex-direction: column; gap: 1rem; }
	.doc-section-title { font-size: 1.125rem; font-weight: 700; color: var(--foreground); letter-spacing: -0.01em; }
	.doc-section-desc { font-size: 0.875rem; color: var(--muted-foreground); margin-top: -0.5rem; }
	.doc-section-desc code { font-family: ui-monospace, monospace; font-size: 0.8em; background: var(--muted); padding: 0.1rem 0.35rem; border-radius: 0.25rem; color: var(--accent); }
	.preview-box { padding: 2rem; border: 1px solid var(--border); border-radius: 0.875rem; background: var(--card); display: flex; align-items: center; justify-content: center; min-height: 6rem; flex-wrap: wrap; gap: 0.75rem; }
	.preview-box-accent { background: radial-gradient(ellipse 80% 60% at 50% 0%, color-mix(in srgb, var(--accent) 8%, transparent), transparent); }
	.preview-box-stacked { align-items: flex-start; justify-content: flex-start; }
</style>
