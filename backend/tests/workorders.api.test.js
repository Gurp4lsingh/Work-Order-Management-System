const request = require("supertest");
const store = require("../src/data/workorders.store");

process.env.API_KEY = "test-key";
const app = require("../src/app");

const authHeader = { "x-api-key": "test-key" };

describe("Work orders API", () => {
  beforeEach(() => {
    store.clear();
  });

  test("returns VALIDATION_ERROR for invalid create payload", async () => {
    const response = await request(app)
      .post("/api/workorders")
      .set(authHeader)
      .send({
        title: "abc",
        description: "short",
        department: "IT",
        priority: "HIGH",
        requesterName: "ab",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "title" }),
        expect.objectContaining({ field: "description" }),
        expect.objectContaining({ field: "requesterName" }),
      ])
    );
  });

  test("returns INVALID_TRANSITION for disallowed status change", async () => {
    const created = await request(app)
      .post("/api/workorders")
      .set(authHeader)
      .send({
        title: "Server room check",
        description: "Inspect all racks and cable trays today",
        department: "IT",
        priority: "MEDIUM",
        requesterName: "Neha",
      });

    const response = await request(app)
      .patch(`/api/workorders/${created.body.data.id}/status`)
      .set(authHeader)
      .send({ status: "DONE" });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("INVALID_TRANSITION");
  });

  test("returns VALIDATION_ERROR when upload is missing required headers", async () => {
    const csv = "title,description,department,priority\nA title,Long enough text,IT,HIGH";
    const response = await request(app)
      .post("/api/workorders/data-transfer")
      .set(authHeader)
      .attach("file", Buffer.from(csv), {
        filename: "invalid-headers.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(response.body.error.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ reason: expect.stringContaining("Missing required column") }),
      ])
    );
  });

  test("returns PAYLOAD_TOO_LARGE when CSV exceeds 2MB", async () => {
    const largeCsv = Buffer.alloc(2 * 1024 * 1024 + 50, "a");
    const response = await request(app)
      .post("/api/workorders/data-transfer")
      .set(authHeader)
      .attach("file", largeCsv, {
        filename: "too-large.csv",
        contentType: "text/csv",
      });

    expect(response.status).toBe(413);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("PAYLOAD_TOO_LARGE");
  });
});
