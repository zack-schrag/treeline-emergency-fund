import type { Plugin, PluginContext } from "./types";
import EmergencyFundView from "./EmergencyFundView.svelte";
import { mount, unmount } from "svelte";

export const plugin: Plugin = {
  manifest: {
    id: "emergency-fund",
    name: "Emergency Fund",
    version: "0.1.0",
    description: "Track emergency fund runway based on your actual expenses",
    author: "Treeline",
    permissions: {
      tables: {
        write: [
          "sys_plugin_emergency_fund_config",
          "sys_plugin_emergency_fund_snapshots",
        ],
      },
    },
  },

  activate(context: PluginContext) {
    // Register the emergency fund view
    context.registerView({
      id: "emergency-fund",
      name: "Emergency Fund",
      icon: "🛡️",
      mount: (target: HTMLElement, props: Record<string, any>) => {
        const instance = mount(EmergencyFundView, {
          target,
          props,
        });

        return () => {
          unmount(instance);
        };
      },
    });

    // Add sidebar item
    context.registerSidebarItem({
      sectionId: "main",
      id: "emergency-fund",
      label: "Emergency Fund",
      icon: "🛡️",
      viewId: "emergency-fund",
    });

    // Register command for quick access
    context.registerCommand({
      id: "emergency-fund.open",
      name: "View Emergency Fund",
      description: "Open the emergency fund tracker",
      execute: () => {
        context.openView("emergency-fund");
      },
    });

    console.log("✓ Emergency Fund plugin loaded");
  },

  deactivate() {
    console.log("Emergency Fund plugin deactivated");
  },
};
