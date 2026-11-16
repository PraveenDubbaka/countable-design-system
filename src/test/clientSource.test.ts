import { beforeEach, describe, expect, it } from "vitest";
import {
  connectClientSource,
  disconnectClientSource,
  getClientConnectionId,
  getClientConnectionState,
  getClientSourceIntegration,
  getEngagementConnectionOverride,
} from "@/lib/clientSource";

// Copied from TB (6c5c18c). Tests marked it.skip depend on TB's own demo clients/connections, which are not part of
// this repo (see the DEMO_* constants in src/lib/clientSource.ts); the reason is noted on each one.
describe("client-level source connections", () => {
  beforeEach(() => localStorage.clear());

  it("returns undefined when a client has no saved entry", () => {
    expect(getClientConnectionState("Nobody Inc")).toBeUndefined();
  });

  // skipped: TB's Harbor Freight is on QuickBooks; this repo's clientsData has it on Xero
  it.skip('resolves "Harbor Freight" to its QuickBooks client connection', () => {
    expect(getClientSourceIntegration("Harbor Freight")).toBe("quickbooks");
    expect(getClientConnectionId("Harbor Freight")).toBe(getClientConnectionId("Harbor Freight Logistics LLC"));
    disconnectClientSource("Harbor Freight Logistics LLC");
    expect(getClientSourceIntegration("Harbor Freight")).toBeNull();
    expect(getClientConnectionState("Harbor Freight")).toBeNull();
    expect(getClientConnectionId("Harbor Freight")).toBeNull();
  });

  // skipped: needs two "Maple…" clients (TB's Maple Ridge Dental); here there is one, so it would pass without testing ambiguity
  it.skip("does not resolve an ambiguous partial client name", () => {
    expect(getClientSourceIntegration("Maple")).toBeNull();
    expect(getClientConnectionState("Maple")).toBeUndefined();
    expect(getClientConnectionId("Maple")).toBeNull();
  });

  // skipped: asserts TB's QuickBooks Harbor Freight (Xero in this repo)
  it.skip("matches partial names case-insensitively in either direction", () => {
    expect(getClientSourceIntegration("  HARBOR FREIGHT  ")).toBe("quickbooks");
    expect(getClientSourceIntegration("Harbor Freight Logistics LLC accounting")).toBe("quickbooks");
  });

  // skipped: TB demo client "Maple Ridge Dental Corp." does not exist here
  it.skip("keeps exact matches ahead of ambiguous partial matches", () => {
    expect(getClientSourceIntegration("Maple Ridge Dental Corp.")).toBe("quickbooks");
    expect(getClientConnectionId("Maple Ridge Dental Corp.")).toBe("quickbooks-reconnected-1");
  });

  // skipped: TB demo client "Riverstone Capital" (DEMO_EXACT_CONNECTIONS is empty here)
  it.skip("Riverstone starts on QuickBooks and can be disconnected", () => {
    expect(getClientSourceIntegration("Riverstone Capital")).toBe("quickbooks");
    disconnectClientSource("Riverstone Capital");
    expect(getClientConnectionState("Riverstone Capital")).toBeNull();
    expect(getClientSourceIntegration("Riverstone Capital")).toBeNull();
  });

  it("connecting saves the provider for the client, not the engagement", () => {
    localStorage.setItem("engagement-connection-ENG1", "xero");
    connectClientSource("Riverstone Capital", "sage", "ENG1");
    expect(localStorage.getItem("engagement-connection-ENG1")).toBeNull();
    expect(getClientSourceIntegration("Riverstone Capital")).toBe("sage");
  });

  it("disconnecting clears every engagement-level connection key", () => {
    localStorage.setItem("engagement-connection-A", "xero");
    localStorage.setItem("engagement-connection-B", "quickbooks");
    disconnectClientSource("Riverstone Capital");
    expect(localStorage.getItem("engagement-connection-A")).toBeNull();
    expect(localStorage.getItem("engagement-connection-B")).toBeNull();
  });

  it("engagement-level overrides are never used", () => {
    localStorage.setItem("engagement-connection-A", "xero");
    expect(getEngagementConnectionOverride("A")).toBeNull();
  });
});
