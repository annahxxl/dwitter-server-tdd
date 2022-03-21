import httpMocks from "node-mocks-http";
import faker from "faker";
import * as validator from "express-validator";
import { validate } from "../validator.js";

jest.mock("express-validator");

describe("Validator Middleware", () => {
  it("calls next if there are no validation errors", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    validator.validationResult = jest.fn(() => ({
      isEmpty: () => true,
    }));

    validate(request, response, next);

    expect(next).toBeCalled();
  });

  it("returns 400 if there are validation errors", () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    const errorMsg = faker.random.words(3);
    validator.validationResult = jest.fn(() => ({
      isEmpty: () => false,
      array: () => [{ msg: errorMsg }],
    }));

    validate(request, response, next);

    expect(next).not.toBeCalled();
    expect(response.statusCode).toBe(400);
    expect(response._getJSONData().message).toBe(errorMsg);
  });
});
