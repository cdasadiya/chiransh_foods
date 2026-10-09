import { describe, expect, it } from "vitest";
import { validateEnquiry } from "./enquiry";

describe("validateEnquiry", () => {
  it("accepts a normal enquiry", () => {
    const result = validateEnquiry({ name: "Asha Patel", phone: "+91 91063 54619", message: "નમસ્તે" });
    expect(result.errors).toEqual([]);
    expect(result.value.name).toBe("Asha Patel");
  });

  it("rejects a filled honeypot", () => {
    const result = validateEnquiry({ name: "Asha Patel", phone: "9106354619", website: "spam" });
    expect(result.honeypot).toBe(true);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects a short phone and an oversized message", () => {
    const result = validateEnquiry({ name: "Asha", phone: "123", message: "x".repeat(2001) });
    expect(result.errors.map((error) => error.loc[1])).toEqual(["phone", "message"]);
  });
});
