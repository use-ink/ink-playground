import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders Basic TypeScript App", () => {
  render(<App />);
  const linkElement = screen.getByText(/Basic TypeScript App/i);
  expect(linkElement).toBeInTheDocument();
});
