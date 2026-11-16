import { describe, it, expect, beforeEach } from "vitest";
import { isConnectionChanged, getClientConnectionId, connectClientSource, disconnectClientSource, getClientSourceIntegration, rowProvider } from "@/lib/clientSource";

// Copied from TB (6c5c18c). Tests marked skip depend on TB's own demo clients/connections, which are not part of
// this repo (see the DEMO_* constants in src/lib/clientSource.ts); the reason is noted on each one.
describe("connection id comparison", () => {
  beforeEach(() => localStorage.clear());
  it("same provider and same id is unchanged", () => {
    expect(isConnectionChanged("quickbooks", "quickbooks-initial", "quickbooks", "quickbooks-initial")).toBe(false);
  });
  it("missing saved id defaults to provider-initial", () => {
    expect(isConnectionChanged("quickbooks", undefined, "quickbooks", "quickbooks-initial")).toBe(false);
  });
  it("same provider with a new id is changed", () => {
    expect(isConnectionChanged("quickbooks", "quickbooks-initial", "quickbooks", "quickbooks-abc")).toBe(true);
  });
  it("different provider is changed", () => {
    expect(isConnectionChanged("quickbooks", "quickbooks-initial", "xero", "xero-initial")).toBe(true);
  });
  it("no active connection is not a connection change", () => {
    expect(isConnectionChanged("quickbooks", "quickbooks-initial", null, null)).toBe(false);
  });
  it("legacy plain-string override reads as provider-initial", () => {
    localStorage.setItem("client-connection-overrides", JSON.stringify({ "harbor freight logistics llc": "quickbooks" }));
    expect(getClientSourceIntegration("Harbor Freight Logistics LLC")).toBe("quickbooks");
    expect(getClientConnectionId("Harbor Freight Logistics LLC")).toBe("quickbooks-initial");
  });
  // skipped: asserts TB's QuickBooks Harbor Freight (Xero in this repo)
  it.skip("seeded clients without overrides use provider-initial", () => {
    expect(getClientConnectionId("Harbor Freight Logistics LLC")).toBe("quickbooks-initial");
  });
  // skipped: TB demo client "Maple Ridge Dental Corp." does not exist here
  it.skip("Maple Ridge Dental is seeded on a reconnected QuickBooks connection", () => {
    expect(getClientSourceIntegration("Maple Ridge Dental Corp.")).toBe("quickbooks");
    expect(isConnectionChanged("quickbooks", "quickbooks-initial", "quickbooks", getClientConnectionId("Maple Ridge Dental Corp."))).toBe(true);
  });
  it("disconnect clears the id and reconnecting the same provider makes a new one", () => {
    disconnectClientSource("Harbor Freight Logistics LLC");
    expect(getClientConnectionId("Harbor Freight Logistics LLC")).toBeNull();
    connectClientSource("Harbor Freight Logistics LLC", "quickbooks");
    const id = getClientConnectionId("Harbor Freight Logistics LLC");
    expect(id).not.toBe("quickbooks-initial");
    expect(isConnectionChanged("quickbooks", "quickbooks-initial", "quickbooks", id)).toBe(true);
  });
  it("row provider ignores the previous-connection marker", () => {
    expect(rowProvider("source:quickbooks|prev")).toBe("quickbooks");
  });
});

// skipped (both tests): they assume TB's Harbor Freight starts on QuickBooks / not on Xero; here it starts on Xero
describe.skip("re-confirming a live connection", () => {
  beforeEach(() => localStorage.clear());
  it("keeps the same id when connecting the same provider again without a disconnect", () => {
    connectClientSource("Harbor Freight Logistics LLC", "quickbooks");
    expect(getClientConnectionId("Harbor Freight Logistics LLC")).toBe("quickbooks-initial");
  });
  it("switching provider creates a new id", () => {
    connectClientSource("Harbor Freight Logistics LLC", "xero");
    expect(getClientConnectionId("Harbor Freight Logistics LLC")).toMatch(/^xero-/);
    expect(getClientConnectionId("Harbor Freight Logistics LLC")).not.toBe("xero-initial");
  });
});
