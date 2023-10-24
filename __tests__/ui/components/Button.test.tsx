/**
 * @jest-environment jsdom
 */
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { render, screen } from "@testing-library/react";

import { Button } from "~/components/core";

describe("Button", () => {
  describe("Primary", () => {
    it("text", () => {
      render(<Button>Click</Button>);
      const button = screen.getByRole("button", { name: "Click" });
      expect(button).toBeInTheDocument();
      expect(button).toMatchSnapshot();
    });

    it("text and icon", () => {
      render(<Button Icon={PlusIcon}>Click</Button>);
      const button = screen.getByRole("button", { name: "Click" });
      expect(button).toBeInTheDocument();
      expect(button).toMatchSnapshot();

      const icon = document.querySelector("svg") as SVGSVGElement;
      expect(button).toContainElement(icon);
      expect(icon.classList.toString()).toMatchInlineSnapshot(`"mr-2 h-5 w-5"`);
    });

    it("icon only", () => {
      render(<Button Icon={PlusIcon} />);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
      expect(button).toMatchSnapshot();

      const icon = document.querySelector("svg") as SVGSVGElement;
      expect(button).toContainElement(icon);
      expect(icon.classList.toString()).toEqual("h-5 w-5");
    });

    it("loading", () => {
      render(<Button isLoading={true}>Click</Button>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
      expect(button).toMatchSnapshot();

      const spinner = screen.getByTestId("spinner");
      expect(button).toContainElement(spinner);
      expect(spinner).toHaveClass("animate-spin mr-2 h-5 w-5", { exact: true });
    });

    it("disabled", () => {
      render(<Button disabled>Click</Button>);
      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
      expect(button).toMatchSnapshot();

      const icon = document.querySelector("svg") as SVGSVGElement;
      expect(icon).toBeNull();
    });
  });
});

describe("secondary", () => {
  it("text", () => {
    render(<Button>Click</Button>);
    const button = screen.getByRole("button", { name: "Click" });
    expect(button).toBeInTheDocument();
    expect(button).toMatchSnapshot();
  });

  it("rounded", () => {
    render(<Button rounded>Click</Button>);
    const button = screen.getByRole("button", { name: "Click" });
    expect(button).toBeInTheDocument();
    expect(button).toMatchSnapshot();
  });

  it("fullWidth", () => {
    render(<Button fullWidth>Click</Button>);
    const button = screen.getByRole("button", { name: "Click" });
    expect(button).toBeInTheDocument();
    expect(button).toMatchSnapshot();
  });
});
