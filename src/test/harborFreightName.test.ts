import { describe, it, expect, beforeEach } from "vitest";
import { getClientSourceIntegration, getClientConnectionId, getClientConnectionState } from "@/lib/clientSource";
// Copied from TB (6c5c18c). Tests marked skip depend on TB's own demo clients/connections, which are not part of
// this repo (see the DEMO_* constants in src/lib/clientSource.ts); the reason is noted on each one.
describe("Harbor Freight display name", () => {
  beforeEach(() => localStorage.clear());
  // skipped: asserts TB's QuickBooks Harbor Freight (Xero in this repo)
  it.skip("defaults to QuickBooks under both names", () => {
    expect(getClientSourceIntegration("Harbor Freight Logistics LLC")).toBe("quickbooks");
    expect(getClientSourceIntegration("Harbor Freight Logistics")).toBe("quickbooks");
  });
  it("reads a legacy override saved only under the short name", () => {
    localStorage.setItem("client-connection-overrides", JSON.stringify({ "harbor freight logistics": "none" }));
    expect(getClientConnectionState("Harbor Freight Logistics LLC")).toBeNull();
    expect(getClientConnectionId("Harbor Freight Logistics LLC")).toBeNull();
    expect(getClientSourceIntegration("Harbor Freight Logistics LLC")).toBeNull();
  });
});

// skipped (both tests): TB demo client "Maple Ridge Dental Corp." does not exist here
describe.skip("Maple Ridge display name", () => {
  beforeEach(() => localStorage.clear());
  it("keeps the reconnected demo connection under both names", () => {
    expect(getClientConnectionId("Maple Ridge Dental Corp.")).toBe("quickbooks-reconnected-1");
    expect(getClientConnectionId("Maple Ridge Dental")).toBe("quickbooks-reconnected-1");
  });
  it("reads a legacy override saved only under the old name", () => {
    localStorage.setItem("client-connection-overrides", JSON.stringify({ "maple ridge dental": "none" }));
    expect(getClientSourceIntegration("Maple Ridge Dental Corp.")).toBeNull();
  });
});
