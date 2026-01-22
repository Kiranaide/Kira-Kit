export const STATIC_STYLES = `
/* Mac-like scrollbar styling with cross-browser support */
@layer base {
  /* Standard scrollbar styling (Firefox) */
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
  }

  :root {
    --scrollbar-thumb: oklch(0.7 0 0 / 40%);
    --scrollbar-track: transparent;
    --scrollbar-thumb-hover: oklch(0.6 0 0 / 60%);
  }

  .dark {
    --scrollbar-thumb: oklch(0.5 0 0 / 40%);
    --scrollbar-thumb-hover: oklch(0.6 0 0 / 60%);
  }

  /* Webkit scrollbar styling (Chrome, Safari, Edge) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--scrollbar-track);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb);
    border-radius: 4px;
    border: 2px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--scrollbar-thumb-hover);
    background-clip: content-box;
  }

  ::-webkit-scrollbar-corner {
    background: transparent;
  }

  /* Accessibility: Respect user preferences for reduced motion */
  @media (prefers-reduced-motion: reduce) {
    ::-webkit-scrollbar-thumb {
      transition: none;
    }
  }

  /* Accessibility: High contrast mode support */
  @media (forced-colors: active) {
    ::-webkit-scrollbar-thumb {
      background: CanvasText;
    }
    ::-webkit-scrollbar-track {
      background: Canvas;
    }
  }
}

/* Shimmer animation for skeleton loading */
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* Wave animation for skeleton loading */
@keyframes skeleton-wave {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Progress bar animations */
@keyframes progress-stripes {
  from { background-position: 1rem 0; }
  to { background-position: 0 0; }
}

@keyframes progress-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}

/* Date Picker Calendar Styles */
@layer components {
  .rdp-nav, .rdp-button_previous, .rdp-button_next { display: none !important; }
  .rdp-month_caption { margin-top: 0 !important; padding-top: 0 !important; }
  .rdp-months { margin-top: 0 !important; padding-top: 0 !important; }
  [data-picker-grid], [data-picker-container] { width: 100% !important; min-width: 0; }
  
  .rdp-day_selected { @apply bg-primary text-primary-foreground rounded-md; }
  .rdp-day_selected:hover { @apply bg-primary/90; }
  .rdp-day_selected .rdp-day_button { @apply ring-0 outline-none; box-shadow: none !important; border: none !important; }
  
  .rdp-day_today:not(.rdp-day_selected) { @apply bg-muted/30; }
  .rdp-day_today:not(.rdp-day_selected) .rdp-day_button::after {
    content: ""; position: absolute; bottom: 2px; left: 50%; transform: translateX(-50%);
    width: 4px; height: 4px; border-radius: 50%; background-color: var(--primary);
  }
  
  .rdp-day_selected .rdp-day_button::after, .rdp-day_today.rdp-day_selected .rdp-day_button::after { display: none !important; }
  
  .rdp-day_button { @apply rounded-md; }
  .rdp-day_button:hover:not(.rdp-day_selected):not(.rdp-day_disabled) { @apply bg-muted/50; }
  .rdp-day_button:focus-visible { @apply ring-2 ring-ring ring-offset-2 ring-offset-background; }
  
  .rdp-day_range_start, .rdp-day_range_end { @apply bg-primary text-primary-foreground rounded-md; }
  .rdp-day_range_middle { @apply bg-primary/10 rounded-none; }
  .rdp-day_range_middle:hover { @apply bg-primary/15; }
  .rdp-day_range_middle .rdp-day_button { @apply text-foreground font-medium; color: var(--foreground) !important; }
  
  @media (forced-colors: active) {
    .rdp-day_selected { @apply bg-[Highlight] text-[HighlightText]; }
    .rdp-day_today:not(.rdp-day_selected) { @apply border-2 border-[Highlight]; }
    .rdp-day_today .rdp-day_button::after { background-color: Highlight; }
  }
}
`;
