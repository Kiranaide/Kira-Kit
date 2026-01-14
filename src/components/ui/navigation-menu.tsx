// import * as React from "react";
// import { Menu as MenuPrimitive } from "@base-ui/react/menu";
// import { Link } from "@tanstack/react-router";
// import { cn } from "@/lib/utils";

// // Context to close other menus when one opens
// interface NavigationMenuContextValue {
//   openMenu: string | null;
//   setOpenMenu: (id: string | null) => void;
// }

// const NavigationMenuContext =
//   React.createContext<NavigationMenuContextValue | null>(null);

// // Navigation Menu Root with context for closing other menus
// function NavigationMenu({
//   className,
//   children,
//   ...props
// }: React.HTMLAttributes<HTMLElement>) {
//   const [openMenu, setOpenMenu] = React.useState<string | null>(null);

//   return (
//     <NavigationMenuContext.Provider value={{ openMenu, setOpenMenu }}>
//       <nav
//         data-slot="navigation-menu"
//         className={cn("relative z-10 flex items-center gap-1", className)}
//         {...props}
//       >
//         {children}
//       </nav>
//     </NavigationMenuContext.Provider>
//   );
// }

// // Navigation Menu List
// function NavigationMenuList({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLUListElement>) {
//   return (
//     <ul
//       data-slot="navigation-menu-list"
//       className={cn("flex items-center gap-1", className)}
//       {...props}
//     />
//   );
// }

// // Navigation Menu Item
// function NavigationMenuItem({
//   className,
//   ...props
// }: React.HTMLAttributes<HTMLLIElement>) {
//   return (
//     <li
//       data-slot="navigation-menu-item"
//       className={cn("relative", className)}
//       {...props}
//     />
//   );
// }

// // Navigation Menu Trigger Style
// const navigationMenuTriggerStyle =
//   "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground focus:bg-muted focus:text-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[popup-open]:bg-muted";

// // Navigation Menu using Base UI Menu for dropdown
// interface NavigationMenuDropdownProps
//   extends Omit<MenuPrimitive.Root.Props, "open" | "onOpenChange"> {
//   menuId: string;
// }

// function NavigationMenuDropdown({
//   menuId,
//   children,
//   ...props
// }: NavigationMenuDropdownProps) {
//   const context = React.useContext(NavigationMenuContext);

//   const isOpen = context?.openMenu === menuId;

//   const handleOpenChange = React.useCallback(
//     (open: boolean) => {
//       if (context) {
//         context.setOpenMenu(open ? menuId : null);
//       }
//     },
//     [context, menuId]
//   );

//   return (
//     <MenuPrimitive.Root
//       data-slot="navigation-menu-dropdown"
//       open={isOpen}
//       onOpenChange={handleOpenChange}
//       {...props}
//     >
//       {children}
//     </MenuPrimitive.Root>
//   );
// }

// function NavigationMenuTrigger({
//   className,
//   children,
//   ...props
// }: MenuPrimitive.Trigger.Props) {
//   return (
//     <MenuPrimitive.Trigger
//       data-slot="navigation-menu-trigger"
//       className={cn(navigationMenuTriggerStyle, "gap-1", className)}
//       {...props}
//     >
//       {children}
//       <svg
//         className="h-3 w-3 transition-transform duration-200 group-data-[popup-open]:rotate-180"
//         fill="none"
//         stroke="currentColor"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           strokeWidth={2}
//           d="M19 9l-7 7-7-7"
//         />
//       </svg>
//     </MenuPrimitive.Trigger>
//   );
// }

// // Navigation Menu Content (dropdown)
// function NavigationMenuContent({
//   className,
//   ...props
// }: MenuPrimitive.Popup.Props) {
//   return (
//     <MenuPrimitive.Portal>
//       <MenuPrimitive.Positioner sideOffset={4}>
//         <MenuPrimitive.Popup
//           data-slot="navigation-menu-content"
//           className={cn(
//             "z-[100] w-full rounded-lg border border-border bg-popover p-4 shadow-lg md:w-auto",
//             "data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2",
//             className
//           )}
//           {...props}
//         />
//       </MenuPrimitive.Positioner>
//     </MenuPrimitive.Portal>
//   );
// }

// // Navigation Menu Link (for direct links without dropdown)
// interface NavigationMenuLinkProps
//   extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
//   to?: string;
//   active?: boolean;
// }

// function NavigationMenuLink({
//   className,
//   to,
//   active,
//   children,
//   ...props
// }: NavigationMenuLinkProps) {
//   const baseClass = cn(
//     navigationMenuTriggerStyle,
//     active && "bg-muted",
//     className
//   );

//   if (to) {
//     return (
//       <Link to={to} data-slot="navigation-menu-link" className={baseClass}>
//         {children}
//       </Link>
//     );
//   }

//   return (
//     <a data-slot="navigation-menu-link" className={baseClass} {...props}>
//       {children}
//     </a>
//   );
// }

// // List Item component for grid layouts in content
// interface ListItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
//   to?: string;
//   title: string;
// }

// function ListItem({ className, title, to, children, ...props }: ListItemProps) {
//   const content = (
//     <>
//       <div className="text-sm font-medium leading-none">{title}</div>
//       {children && (
//         <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
//           {children}
//         </p>
//       )}
//     </>
//   );

//   const baseClass = cn(
//     "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-muted",
//     className
//   );

//   if (to) {
//     return (
//       <Link to={to} className={baseClass}>
//         {content}
//       </Link>
//     );
//   }

//   return (
//     <a className={baseClass} {...props}>
//       {content}
//     </a>
//   );
// }

// export {
//   NavigationMenu,
//   NavigationMenuList,
//   NavigationMenuItem,
//   NavigationMenuDropdown,
//   NavigationMenuTrigger,
//   NavigationMenuContent,
//   NavigationMenuLink,
//   ListItem,
//   navigationMenuTriggerStyle,
// };
