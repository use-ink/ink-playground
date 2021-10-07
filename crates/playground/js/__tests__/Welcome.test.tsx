import { render, screen } from "@testing-library/react";
import Welcome from "../Welcome";

test("Contains Welcome Message", () => {
  render(<Welcome />);
  const linkElement = screen.getByText(/Welcome to the ink! Playground!/i);
  expect(linkElement).toBeInTheDocument();
});
