/**
 * Plugin SDK Types for Treeline
 *
 * These types define the interface between your plugin and Treeline.
 * The SDK is passed to your view components via props.
 */

// ============================================================================
// Plugin Manifest - Describes your plugin
// ============================================================================

export interface PluginManifest {
  /** Unique identifier (e.g., "my-plugin", "fire-calculator") */
  id: string;
  /** Display name */
  name: string;
  /** Version string (semver recommended) */
  version: string;
  /** Short description */
  description: string;
  /** Author name or organization */
  author: string;
  /** Optional icon (emoji or icon name) */
  icon?: string;
  /** Permissions your plugin requires */
  permissions?: {
    tables?: {
      /** Tables your plugin needs write access to */
      write?: string[];
    };
  };
}

// ============================================================================
// Plugin Interface - What your plugin must export
// ============================================================================

export interface Plugin {
  manifest: PluginManifest;
  activate: (context: PluginContext) => void | Promise<void>;
  deactivate?: () => void | Promise<void>;
}

// ============================================================================
// Plugin Context - Available in activate()
// ============================================================================

export interface PluginContext {
  registerView: (view: ViewRegistration) => void;
  registerSidebarSection: (section: SidebarSection) => void;
  registerSidebarItem: (item: SidebarItem) => void;
  registerCommand: (command: Command) => void;
  registerStatusBarItem: (item: StatusBarItem) => void;
  openView: (viewId: string, props?: Record<string, any>) => void;
  executeCommand: (commandId: string) => void;
}

export interface ViewRegistration {
  id: string;
  name: string;
  icon: string;
  mount: (target: HTMLElement, props: Record<string, any>) => () => void;
}

export interface SidebarSection {
  id: string;
  title: string;
  order: number;
}

export interface SidebarItem {
  sectionId: string;
  id: string;
  label: string;
  icon: string;
  viewId?: string;
  action?: () => void;
}

export interface Command {
  id: string;
  name: string;
  description?: string;
  execute: () => void | Promise<void>;
}

export interface StatusBarItem {
  id: string;
  text: string;
  tooltip?: string;
  alignment?: "left" | "right";
  priority?: number;
}

// ============================================================================
// Plugin SDK - Available in view components via props.sdk
// ============================================================================

export interface PluginSDK {
  /** Execute a read-only SQL query */
  query: <T = Record<string, any>>(sql: string) => Promise<T[]>;

  /** Execute a write SQL query (restricted to your allowed tables) */
  execute: (sql: string) => Promise<{ rowsAffected: number }>;

  /** Show toast notifications */
  toast: {
    show: (message: string, description?: string) => void;
    success: (message: string, description?: string) => void;
    error: (message: string, description?: string) => void;
    warning: (message: string, description?: string) => void;
    info: (message: string, description?: string) => void;
  };

  /** Navigate to another view */
  openView: (viewId: string, props?: Record<string, any>) => void;

  /** Subscribe to data refresh events (called after sync/import) */
  onDataRefresh: (callback: () => void) => () => void;

  /** Emit a data refresh event (call after modifying data) */
  emitDataRefresh: () => void;

  /** Theme utilities */
  theme: {
    current: () => "light" | "dark";
    subscribe: (callback: (theme: string) => void) => () => void;
  };

  /** Platform-aware modifier key ("Cmd" on Mac, "Ctrl" elsewhere) */
  modKey: "Cmd" | "Ctrl";

  /** Format a keyboard shortcut for display */
  formatShortcut: (shortcut: string) => string;

  /** Plugin settings (persisted, scoped to your plugin) */
  settings: {
    get: <T>(key: string) => Promise<T | null>;
    set: <T>(key: string, value: T) => Promise<void>;
  };

  /** Plugin state (ephemeral, scoped to your plugin) */
  state: {
    read: <T>() => Promise<T | null>;
    write: <T>(state: T) => Promise<void>;
  };
}

// ============================================================================
// Emergency Fund Plugin Types
// ============================================================================

export interface FundAllocation {
  account_id: string;
  allocation_type: "percentage" | "fixed";
  allocation_value: number;
}

export interface EmergencyFundConfig {
  id: string;
  linked_goal_id: string | null;
  target_months: number | null;  // null = auto-calculate from goal
  fund_allocations: FundAllocation[];  // for manual mode
  expense_account_ids: string[];
  excluded_tags: string[];
  lookback_months: number;
  calculation_method: "mean" | "median" | "trimmed_mean";
  created_at: string;
  updated_at: string;
}

export interface EmergencyFundSnapshot {
  snapshot_id: string;
  snapshot_date: string;
  fund_balance: number;
  monthly_expenses: number;
  months_of_runway: number;
  notes: string | null;
  created_at: string;
}

export interface Account {
  account_id: string;
  account_name: string;
  account_type: string;
  balance: number;
  institution_name: string;
}

export interface Goal {
  id: string;
  name: string;
  target_amount: number;
  allocations: string; // JSON string
  icon: string;
  active: boolean;
}

export interface RunwayData {
  fundBalance: number;
  monthlyExpenses: number;
  monthsOfRunway: number;
  targetMonths: number;
  targetAmount: number;
  progressPercent: number;
  remainingToTarget: number;
  status: "on-track" | "warning" | "critical";
}
