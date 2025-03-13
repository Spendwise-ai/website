import type { NavMenu, NavMenuItems } from "~/types/nav";

export const navMenu: NavMenu[] = [
  {
    heading: "General",
    items: [
      {
        title: "Home",
        icon: "i-lucide-home",
        link: "/",
      },
      {
        title: "Accounts",
        icon: "i-lucide-credit-card",
        link: "/accounts",
      },
      {
        title: "Transactions",
        icon: "i-lucide-arrow-left-right",
        link: "/transactions",
        new: true,
      },
    ],
  },
];

export const navMenuBottom: NavMenuItems = [
  {
    title: "Help & Support",
    icon: "i-lucide-circle-help",
    link: "/support",
  },
  {
    title: "Feedback",
    icon: "i-lucide-send",
    link: "/feedback",
  },
];
