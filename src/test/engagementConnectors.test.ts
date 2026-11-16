import { beforeEach, describe, expect, it } from "vitest";
import { deriveEngagementConnectors, getClientEngagementConnectors, withoutClientAccountingConnectors } from "@/lib/engagementConnectors";
import { connectClientSource, disconnectClientSource } from "@/lib/clientSource";

// Copied from TB (6c5c18c). Tests marked it.skip depend on TB's own demo clients/connections, which are not part of
// this repo (see the DEMO_* constants in src/lib/clientSource.ts); the reason is noted on each one.
describe("client-managed engagement accounting connectors", () => {
  beforeEach(() => localStorage.clear());

  it.each([
    ["quickbooks", "qbo"], ["xero", "xero"], ["sage", "sage50"],
  ] as const)("shows only the active %s provider and preserves other connectors", (provider, id) => {
    expect([...deriveEngagementConnectors(["qbo", "xero", "sage50", "gdrive"], provider)]).toEqual(["gdrive", id]);
  });

  it("disconnected clients have no accounting connectors despite stale local entries", () => {
    expect([...deriveEngagementConnectors(["qbo", "xero", "sage50", "plaid"], null)]).toEqual(["plaid"]);
  });

  it("cleans only client-managed accounting entries from persistence", () => {
    expect([...withoutClientAccountingConnectors(["qbo", "xero", "sage50", "gdrive", "netsuite"])]).toEqual(["gdrive", "netsuite"]);
  });

  // skipped: starts from TB's QuickBooks Harbor Freight (Xero in this repo)
  it.skip("resolves both client name variants and follows connect, switch and disconnect", () => {
    const oldName = "Harbor Freight Logistics";
    const name = "Harbor Freight Logistics LLC";
    expect([...getClientEngagementConnectors(name, [])]).toEqual(["qbo"]);
    connectClientSource(oldName, "xero");
    expect([...getClientEngagementConnectors(name, ["qbo"])]).toEqual(["xero"]);
    disconnectClientSource(oldName);
    expect([...getClientEngagementConnectors(name, ["qbo", "xero"])]).toEqual([]);
  });

  // skipped: TB demo client "Maple Ridge Dental Corp." does not exist here
  it.skip("uses Maple Ridge's live connection rather than its engagement's older connection", () => {
    expect([...getClientEngagementConnectors("Maple Ridge Dental Corp.", ["xero"])]).toEqual(["qbo"]);
    expect([...getClientEngagementConnectors("Maple Ridge Dental", [])]).toEqual(["qbo"]);
  });

  // skipped: TB demo client "Cedar Point Logistics" does not exist here (it would pass without testing anything)
  it.skip("keeps Cedar Point disconnected even if the local list contains providers", () => {
    expect([...getClientEngagementConnectors("Cedar Point Logistics", ["qbo", "xero", "sage50"])]).toEqual([]);
  });
});