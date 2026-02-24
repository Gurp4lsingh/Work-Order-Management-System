import { render, screen } from "@testing-library/react";
import ErrorBanner from "../../components/ErrorBanner";

describe("ErrorBanner", () => {
  test("renders message and request id when provided", () => {
    render(<ErrorBanner message="Unable to reach backend API" requestId="req-123" />);

    expect(screen.getByText("Error:")).toBeInTheDocument();
    expect(screen.getByText("Unable to reach backend API")).toBeInTheDocument();
    expect(screen.getByText("requestId: req-123")).toBeInTheDocument();
  });

  test("renders only message when request id is not provided", () => {
    render(<ErrorBanner message="Validation failed" />);

    expect(screen.getByText("Validation failed")).toBeInTheDocument();
    expect(screen.queryByText(/requestId:/i)).not.toBeInTheDocument();
  });
});
