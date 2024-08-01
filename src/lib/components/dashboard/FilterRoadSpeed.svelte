<script lang="ts">
	import { onMount } from 'svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { maxSpeedLimitStore, MaxSpeedFilters } from '../../../stores/leaflet';
	import type { TMaxSpeedLimit, TMaxSpeedOption } from '$lib/domain/entities/Leaflet';

	let selected: TMaxSpeedOption = MaxSpeedFilters[0];

	onMount(() => {
		maxSpeedLimitStore.subscribe((value: TMaxSpeedLimit) => {
			selected = MaxSpeedFilters.find((option) => option.value === value) || MaxSpeedFilters[0];
		});
	});

	$: maxSpeedLimitStore.set(selected.value);
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Filtrer les routes par limitation de vitesse</Card.Title>
		<Card.Description>Données fourni par OpenStreetMap</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-6">
			<div class="grid gap-3">
				<Label for="filter-maxspeed">Vitesse maximum en Km/h</Label>
				<Select.Root bind:selected>
					<Select.Trigger id="filter-maxspeed" aria-label="Select maxspeed">
						<Select.Value placeholder="Select maxspeed" />
					</Select.Trigger>
					<Select.Content>
						{#each MaxSpeedFilters as { value, label, disabled }}
							<Select.Item {value} {label} {disabled}>
								{label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>
	</Card.Content>
	<Card.Footer class="flex flex-wrap">
		{#each MaxSpeedFilters as { value, label, disabled, color }}
			<div class="flex w-1/2 flex-col px-2">
				<p class="text-sm text-gray-500">
					{label} km/h
				</p>
				<div class="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
					<div style={`background-color: ${color};`} class={`h-full w-full flex-1`}></div>
				</div>
			</div>
		{/each}
		<!-- </div> -->
	</Card.Footer>
</Card.Root>
