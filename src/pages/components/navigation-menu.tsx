// "use client";

// import {
//   NavigationMenu,
//   NavigationMenuList,
//   NavigationMenuItem,
//   NavigationMenuDropdown,
//   NavigationMenuTrigger,
//   NavigationMenuContent,
//   NavigationMenuLink,
//   ListItem,
//   NavigationMenuHeader,
//   NavigationMenuFooter,
//   NavigationMenuSection,
//   NavigationMenuViewAll,
// } from "@/components/ui/navigation-menu";
// import {
//   IconPackage,
//   IconCode,
//   IconBook,
//   IconSettings,
//   IconUsers,
//   IconChartBar,
//   IconCalendar,
//   IconMessage,
//   IconShield,
//   IconRocket,
// } from "@tabler/icons-react";

// export function NavigationMenuPage() {
//   return (
//     <div className="p-8 max-w-4xl space-y-12">
//       <header>
//         <h1 className="text-3xl font-bold mb-2">Navigation Menu</h1>
//         <p className="text-muted-foreground">
//           A navigation component for site-wide navigation with dropdowns. Now
//           with mega menu support, icons, and enhanced layout components.
//         </p>
//       </header>

//       Basic Navigation
//       <section className="space-y-4 min-h-[280px]">
//         <h2 className="text-xl font-semibold border-b border-border pb-2">
//           Basic Navigation with Dropdowns
//         </h2>
//         <NavigationMenu>
//           <NavigationMenuList>
//             <NavigationMenuItem>
//               <NavigationMenuDropdown menuId="getting-started">
//                 <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
//                 <NavigationMenuContent className="w-[400px] md:w-[500px]">
//                   <ul className="grid gap-3 p-4 md:grid-cols-2">
//                     <ListItem
//                       href="#"
//                       title="Introduction"
//                       icon={<IconBook className="h-5 w-5" />}
//                     >
//                       Re-usable components built with Base UI.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Installation"
//                       icon={<IconPackage className="h-5 w-5" />}
//                     >
//                       How to install and configure the library.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Typography"
//                       icon={<IconCode className="h-5 w-5" />}
//                     >
//                       Styles for headings, paragraphs, and more.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Theming"
//                       icon={<IconSettings className="h-5 w-5" />}
//                     >
//                       Customize colors and appearance.
//                     </ListItem>
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuDropdown>
//             </NavigationMenuItem>

//             <NavigationMenuItem>
//               <NavigationMenuDropdown menuId="components">
//                 <NavigationMenuTrigger>Components</NavigationMenuTrigger>
//                 <NavigationMenuContent className="w-[400px] md:w-[600px]">
//                   <ul className="grid gap-3 p-4 md:grid-cols-3">
//                     <ListItem
//                       href="#"
//                       title="Button"
//                       icon={<IconPackage className="h-5 w-5" />}
//                     >
//                       Trigger actions with buttons.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Dialog"
//                       icon={<IconMessage className="h-5 w-5" />}
//                     >
//                       Modal dialogs for user interaction.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Dropdown"
//                       icon={<IconCode className="h-5 w-5" />}
//                     >
//                       Contextual menus and actions.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Input"
//                       icon={<IconBook className="h-5 w-5" />}
//                     >
//                       Text inputs and form fields.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Select"
//                       icon={<IconSettings className="h-5 w-5" />}
//                     >
//                       Selection from a list of options.
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Calendar"
//                       icon={<IconCalendar className="h-5 w-5" />}
//                     >
//                       Date selection components.
//                     </ListItem>
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuDropdown>
//             </NavigationMenuItem>

//             <NavigationMenuItem>
//               <NavigationMenuLink href="#">Documentation</NavigationMenuLink>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//       </section>

//       {/* Mega Menu */}
//       <section className="space-y-4 pt-8">
//         <h2 className="text-xl font-semibold border-b border-border pb-2">
//           Mega Menu
//         </h2>
//         <p className="text-sm text-muted-foreground">
//           Use <code>megaMenu</code> prop for larger, more complex dropdown
//           layouts.
//         </p>
//         <NavigationMenu>
//           <NavigationMenuList>
//             <NavigationMenuItem>
//               <NavigationMenuDropdown menuId="products">
//                 <NavigationMenuTrigger>Products</NavigationMenuTrigger>
//                 <NavigationMenuContent
//                   megaMenu
//                   className="w-[800px] max-w-full"
//                 >
//                   <div className="grid grid-cols-4 gap-4 p-4">
//                     <NavigationMenuSection title="Web Apps">
//                       <ListItem
//                         href="#"
//                         title="Dashboard"
//                         icon={<IconChartBar className="h-4 w-4" />}
//                       >
//                         Analytics and metrics
//                       </ListItem>
//                       <ListItem
//                         href="#"
//                         title="CMS"
//                         icon={<IconBook className="h-4 w-4" />}
//                       >
//                         Content management
//                       </ListItem>
//                       <ListItem
//                         href="#"
//                         title="E-commerce"
//                         icon={<IconRocket className="h-4 w-4" />}
//                       >
//                         Online store platform
//                       </ListItem>
//                     </NavigationMenuSection>

//                     <NavigationMenuSection title="Mobile">
//                       <ListItem
//                         href="#"
//                         title="React Native"
//                         icon={<IconPackage className="h-4 w-4" />}
//                       >
//                         Cross-platform apps
//                       </ListItem>
//                       <ListItem
//                         href="#"
//                         title="Flutter"
//                         icon={<IconCode className="h-4 w-4" />}
//                       >
//                         Fast mobile development
//                       </ListItem>
//                       <ListItem
//                         href="#"
//                         title="iOS"
//                         icon={<IconApple className="h-4 w-4" />}
//                       >
//                         Native Apple apps
//                       </ListItem>
//                     </NavigationMenuSection>

//                     <NavigationMenuSection title="Backend">
//                       <ListItem
//                         href="#"
//                         title="API"
//                         icon={<IconCode className="h-4 w-4" />}
//                       >
//                         RESTful APIs
//                       </ListItem>
//                       <ListItem
//                         href="#"
//                         title="Database"
//                         icon={<IconSettings className="h-4 w-4" />}
//                       >
//                         Data storage
//                       </ListItem>
//                       <ListItem
//                         href="#"
//                         title="Auth"
//                         icon={<IconShield className="h-4 w-4" />}
//                       >
//                         User authentication
//                       </ListItem>
//                     </NavigationMenuSection>

//                     <div className="space-y-3">
//                       <NavigationMenuHeader>
//                         <h4 className="font-medium text-sm">Featured</h4>
//                       </NavigationMenuHeader>
//                       <ListItem
//                         href="#"
//                         title="New Release 2.0"
//                         description="Check out what's new"
//                       >
//                         Major update with new features
//                       </ListItem>
//                       <NavigationMenuViewAll
//                         href="#"
//                         title="View All Products"
//                         description="Browse our complete catalog"
//                       />
//                     </div>
//                   </div>
//                   <NavigationMenuFooter>
//                     <span>© 2024 Your Company</span>
//                     <a href="#" className="hover:underline">
//                       Privacy Policy
//                     </a>
//                   </NavigationMenuFooter>
//                 </NavigationMenuContent>
//               </NavigationMenuDropdown>
//             </NavigationMenuItem>

//             <NavigationMenuItem>
//               <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
//             </NavigationMenuItem>

//             <NavigationMenuItem>
//               <NavigationMenuDropdown menuId="resources">
//                 <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
//                 <NavigationMenuContent className="w-[400px]">
//                   <ul className="grid gap-3 p-4 md:grid-cols-2">
//                     <ListItem
//                       href="#"
//                       title="Documentation"
//                       icon={<IconBook className="h-5 w-5" />}
//                     >
//                       Complete API reference
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Guides"
//                       icon={<IconCode className="h-5 w-5" />}
//                     >
//                       Step-by-step tutorials
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Blog"
//                       icon={<IconMessage className="h-5 w-5" />}
//                     >
//                       Latest updates and news
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Support"
//                       icon={<IconUsers className="h-5 w-5" />}
//                     >
//                       Get help from our team
//                     </ListItem>
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuDropdown>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//       </section>

//       {/* Simple Links */}
//       <section className="space-y-4 pt-8">
//         <h2 className="text-xl font-semibold border-b border-border pb-2">
//           Simple Links (Without Dropdowns)
//         </h2>
//         <p className="text-sm text-muted-foreground">
//           Navigation menu with direct links, no dropdowns.
//         </p>
//         <NavigationMenu>
//           <NavigationMenuList>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#">Home</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#">About</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#">Products</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#" active>
//                 Contact
//               </NavigationMenuLink>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//       </section>

//       {/* Mixed Navigation */}
//       <section className="space-y-4 pt-8">
//         <h2 className="text-xl font-semibold border-b border-border pb-2">
//           Mixed Navigation
//         </h2>
//         <p className="text-sm text-muted-foreground">
//           Combine dropdowns and direct links in the same navigation menu.
//         </p>
//         <NavigationMenu>
//           <NavigationMenuList>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#">Home</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuDropdown menuId="products">
//                 <NavigationMenuTrigger>Products</NavigationMenuTrigger>
//                 <NavigationMenuContent className="w-[300px]">
//                   <ul className="grid gap-3 p-4">
//                     <ListItem
//                       href="#"
//                       title="Web App"
//                       icon={<IconRocket className="h-5 w-5" />}
//                     >
//                       Build modern web applications
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Mobile App"
//                       icon={<IconPackage className="h-5 w-5" />}
//                     >
//                       Native mobile experiences
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="API"
//                       icon={<IconCode className="h-5 w-5" />}
//                     >
//                       Integrate with our API
//                     </ListItem>
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuDropdown>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuLink href="#">Pricing</NavigationMenuLink>
//             </NavigationMenuItem>
//             <NavigationMenuItem>
//               <NavigationMenuDropdown menuId="resources">
//                 <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
//                 <NavigationMenuContent className="w-[400px]">
//                   <ul className="grid gap-3 p-4 md:grid-cols-2">
//                     <ListItem
//                       href="#"
//                       title="Documentation"
//                       icon={<IconBook className="h-5 w-5" />}
//                     >
//                       Complete API reference
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Guides"
//                       icon={<IconCode className="h-5 w-5" />}
//                     >
//                       Step-by-step tutorials
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Blog"
//                       icon={<IconMessage className="h-5 w-5" />}
//                     >
//                       Latest updates and news
//                     </ListItem>
//                     <ListItem
//                       href="#"
//                       title="Support"
//                       icon={<IconUsers className="h-5 w-5" />}
//                     >
//                       Get help from our team
//                     </ListItem>
//                   </ul>
//                 </NavigationMenuContent>
//               </NavigationMenuDropdown>
//             </NavigationMenuItem>
//           </NavigationMenuList>
//         </NavigationMenu>
//       </section>

//       {/* Features */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-semibold border-b border-border pb-2">
//           Features
//         </h2>
//         <ul className="list-disc list-inside space-y-2 text-muted-foreground">
//           <li>
//             <strong className="text-foreground">Mega Menu:</strong> Use{" "}
//             <code>megaMenu</code> prop for larger dropdowns
//           </li>
//           <li>
//             <strong className="text-foreground">Icons:</strong> Add icons to
//             ListItem components
//           </li>
//           <li>
//             <strong className="text-foreground">Layout Components:</strong>{" "}
//             NavigationMenuHeader, Footer, Section for organized layouts
//           </li>
//           <li>
//             <strong className="text-foreground">View All Link:</strong>{" "}
//             Convenience component for "View All" links
//           </li>
//           <li>
//             <strong className="text-foreground">Auto-close:</strong> Only one
//             dropdown menu can be open at a time
//           </li>
//           <li>
//             <strong className="text-foreground">Keyboard Navigation:</strong>{" "}
//             Full keyboard support with arrow keys and Escape
//           </li>
//           <li>
//             <strong className="text-foreground">Router Integration:</strong>{" "}
//             Works with TanStack Router for client-side navigation
//           </li>
//         </ul>
//       </section>

//       {/* Usage */}
//       <section className="space-y-4">
//         <h2 className="text-xl font-semibold border-b border-border pb-2">
//           Usage
//         </h2>
//         <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
//           <pre className="text-sm text-foreground">
//             {`import {
//   NavigationMenu,
//   NavigationMenuList,
//   NavigationMenuItem,
//   NavigationMenuDropdown,
//   NavigationMenuTrigger,
//   NavigationMenuContent,
//   NavigationMenuLink,
//   ListItem,
//   NavigationMenuHeader,
//   NavigationMenuFooter,
//   NavigationMenuSection,
//   NavigationMenuViewAll,
// } from "@/components/ui/navigation-menu"

// // Basic dropdown
// <NavigationMenu>
//   <NavigationMenuList>
//     <NavigationMenuItem>
//       <NavigationMenuDropdown menuId="products">
//         <NavigationMenuTrigger>Products</NavigationMenuTrigger>
//         <NavigationMenuContent>
//           <ul className="grid gap-3 p-4">
//             <ListItem href="#" title="Item" icon={<IconPackage className="h-5 w-5" />}>
//               Description here
//             </ListItem>
//           </ul>
//         </NavigationMenuContent>
//       </NavigationMenuDropdown>
//       </NavigationMenu</NavigationMenuItem>
// List>
// </NavigationMenu>

// // Mega menu
// <NavigationMenuContent megaMenu className="w-[800px]">
//   <div className="grid grid-cols-4 gap-4 p-4">
//     <NavigationMenuSection title="Section">
//       <ListItem href="#" title="Item">Description</ListItem>
//     </NavigationMenuSection>
//   </div>
//   <NavigationMenuFooter>© 2024</NavigationMenuFooter>
// </NavigationMenuContent>`}
//           </pre>
//         </div>
//       </section>
//     </div>
//   );
// }

// // Simple IconApple component since it doesn't exist in tabler
// function IconApple({ className }: { className?: string }) {
//   return (
//     <svg
//       className={className}
//       viewBox="0 0 24 24"
//       fill="currentColor"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.69C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
//     </svg>
//   );
// }
