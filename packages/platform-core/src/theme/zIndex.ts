/**
 * Centralized z-index scale for the application.
 * Based on MUI defaults with semantic naming.
 *
 * MUI Default Reference:
 * - mobileStepper: 1000
 * - fab: 1050
 * - speedDial: 1050
 * - appBar: 1100
 * - drawer: 1200
 * - modal: 1300
 * - snackbar: 1400
 * - tooltip: 1500
 */
export const zIndexScale = {
  // Base layer - background decorations
  base: 0,

  // Content layer - default stacking
  content: 1,

  // Elevated content - cards, highlighted items
  elevated: 2,

  // Local stacking within components
  local: {
    behind: -1,
    base: 0,
    above: 1,
    highlight: 2,
    overlay: 3,
  },

  // Global UI layers (aligned with MUI)
  appBar: 1100,
  drawer: 1200,
  dropdown: 1300,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,

  // Custom application layers
  loadingBackdrop: 1400, // Above modal but below tooltip
  search: 1350, // Between dropdown and snackbar
} as const

export type ZIndexScale = typeof zIndexScale
