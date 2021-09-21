import { render, screen } from "@testing-library/react";
import App from "../App";

test("Contains Welcome Message", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to ink Playground!/i);
  expect(linkElement).toBeInTheDocument();
});
