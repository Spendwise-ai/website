<script setup lang="ts">
import type { NavGroup, NavLink, NavSectionTitle } from "~/types/nav";
import { navMenu, navMenuBottom } from "~/constants/menus";

function resolveNavItemComponent(
  item: NavLink | NavGroup | NavSectionTitle,
): any {
  if ("children" in item) return resolveComponent("LayoutSidebarNavGroup");

  return resolveComponent("LayoutSidebarNavLink");
}

const teams: {
  name: string;
  logo: string;
  plan: string;
}[] = [
  {
    name: "Acme Inc",
    logo: "i-lucide-gallery-vertical-end",
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: "i-lucide-audio-waveform",
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: "i-lucide-command",
    plan: "Free",
  },
];

const user = useSupabaseUser();
const client = useSupabaseClient();

const { data: profile } = await useAsyncData("profile", async () => {
  const { data } = await client
    .from("profiles")
    .select()
    .eq("id", user.value?.id as string)
    .single();
  return data;
});

const { sidebar } = useAppSettings();
</script>

<template>
  <Sidebar
    :collapsible="sidebar.collapsible"
    :side="sidebar.side"
    :variant="sidebar.variant"
  >
    <SidebarHeader>
      <LayoutSidebarNavHeader :teams="teams" />
      <Search />
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup v-for="(nav, indexGroup) in navMenu" :key="indexGroup">
        <SidebarGroupLabel v-if="nav.heading">
          {{ nav.heading }}
        </SidebarGroupLabel>
        <component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in nav.items"
          :key="index"
          :item="item"
        />
      </SidebarGroup>
      <SidebarGroup class="mt-auto">
        <component
          :is="resolveNavItemComponent(item)"
          v-for="(item, index) in navMenuBottom"
          :key="index"
          :item="item"
          size="sm"
        />
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <LayoutSidebarNavFooter :profile="profile" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>

<style scoped></style>
