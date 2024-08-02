<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { maxSpeedLimitStore, MaxSpeedFilters } from '../../../stores/leaflet';
	import type { TMaxSpeedLimit } from '$lib/domain/entities/Leaflet';

	let selected: TMaxSpeedLimit[] = $maxSpeedLimitStore;
	onMount(() => {
		maxSpeedLimitStore.subscribe((value: TMaxSpeedLimit[]) => {
			selected = value;
		});
	});

	$: maxSpeedLimitStore.set(selected);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Filtrer les routes par limitation de vitesse</Card.Title>
		<Card.Description>Données fourni par OpenStreetMap</Card.Description>
	</Card.Header>
	<Card.Content class="flex flex-wrap gap-4">
		{#each MaxSpeedFilters as { value, label, disabled, color }}
			{@const checked = $maxSpeedLimitStore.includes(value)}
			<div class="items-top flex space-x-2">
				<!-- <Checkbox bind:checked id={`checkbox-${value}`} /> -->
				<Checkbox
					{checked}
					onCheckedChange={(v) => {
						if (v) {
							$maxSpeedLimitStore = [...$maxSpeedLimitStore, value];
						}
						if (!v) {
							$maxSpeedLimitStore = $maxSpeedLimitStore.filter((i) => i !== value);
						}
					}}
					id={`checkbox-${value}`}
				/>
				<div class="grid gap-1.5 leading-none">
					<Label
						for={`checkbox-${value}`}
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						{label} km/h
					</Label>
					<div class="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
						<div style={`background-color: ${color};`} class={`h-full w-full flex-1`}></div>
					</div>
				</div>
			</div>
		{/each}
	</Card.Content>
</Card.Root>
