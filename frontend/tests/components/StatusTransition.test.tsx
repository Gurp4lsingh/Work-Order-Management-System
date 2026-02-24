import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StatusTransition from "../../components/StatusTransition";

describe("StatusTransition", () => {
  test("shows allowed options and triggers callback on apply", async () => {
    const user = userEvent.setup();
    const onChangeStatus = jest.fn();
    render(<StatusTransition current="IN_PROGRESS" onChangeStatus={onChangeStatus} />);

    expect(screen.getByRole("heading", { name: "Status Transition" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "BLOCKED" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DONE" })).toBeInTheDocument();

    const button = screen.getByRole("button", { name: "Apply" });
    expect(button).toBeDisabled();

    await user.selectOptions(screen.getByRole("combobox"), "BLOCKED");
    expect(button).toBeEnabled();

    await user.click(button);
    expect(onChangeStatus).toHaveBeenCalledTimes(1);
    expect(onChangeStatus).toHaveBeenCalledWith("BLOCKED");
  });

  test("shows no transitions text for DONE", () => {
    render(<StatusTransition current="DONE" onChangeStatus={jest.fn()} />);
    expect(screen.getByText("No transitions allowed from DONE.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Apply" })).not.toBeInTheDocument();
  });
});
