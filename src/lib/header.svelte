<script lang="ts">
	import {
		Menubar,
		MenubarContent,
		MenubarItem,
		MenubarMenu,
		MenubarTrigger
	} from '$lib/components/ui/menubar';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';
	import { Menu } from 'lucide-svelte';
	let currentRoute = ''; // This should be updated based on your routing logic
	import { page } from '$app/stores';
	import { setMode, mode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	$: {
		currentRoute = $page.url.pathname;
	}

	function isActive(item) {
		return currentRoute === item.value;
	}
	function handleModeChange() {
		if ($mode === 'light') {
			setMode('dark');
		} else {
			setMode('light');
		}
	}
	let projectName = 'Mediathek Community';
	let menuItems = [
		{ name: 'Home', value: '/' },
		{ name: 'About', value: '/about' },
		{ name: 'Services', value: '/services' },
		{ name: 'Contact', value: '/contact' }
	];
</script>

<div class="w-full bg-background shadow-sm">
	<div class="container mx-auto px-4">
		<div class="flex h-16 items-center justify-between">
			<div class="flex-shrink-0">
				<span class="text-xl font-bold">{projectName}</span>
			</div>

			<!-- Desktop Menu -->
			<div class="hidden md:block">
				<Menubar class="border-none">
					{#each menuItems as item}
						<MenubarMenu>
							<MenubarTrigger
								class="focus:bg-transparent {isActive(item)
									? 'bg-accent text-accent-foreground'
									: ''}"
							>
								<a href={item.value}>{item.name}</a>
							</MenubarTrigger>
						</MenubarMenu>
					{/each}
					<MenubarMenu>
						<Button on:click={handleModeChange} variant="outline" size="icon">
							<Sun
								class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
							/>
							<Moon
								class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
							/>
							<span class="sr-only">Toggle theme</span>
						</Button>
					</MenubarMenu>
				</Menubar>
			</div>

			<!-- Mobile Menu -->
			<div class="md:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button variant="ghost" size="icon">
							<Menu class="h-5 w-5" />
							<span class="sr-only">Toggle menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{#each menuItems as item}
							<DropdownMenuItem class={isActive(item) ? 'bg-accent text-accent-foreground' : ''}>
								<a href={item.value} class="w-full">{item.name}</a>
							</DropdownMenuItem>
						{/each}
						<DropdownMenuItem
							><Button on:click={handleModeChange} variant="ghost">
								<Sun
									class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
								/>
								<Moon
									class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
								/>
							</Button></DropdownMenuItem
						>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	</div>
</div>
