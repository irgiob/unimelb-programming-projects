import { Message } from "rsuite";

export const WarningMessage = (text: string) => {
  return (
    <Message duration={3000} showIcon type={"warning"}>
      {text}
    </Message>
  );
};
export const InfoMessage = (text: string) => {
  return (
    <Message duration={3000} showIcon type={"info"}>
      {text}
    </Message>
  );
};
export const ErrorMessage = (text: string) => {
  return (
    <Message duration={3000} showIcon type={"error"}>
      {text}
    </Message>
  );
};

export const SuccessMessage = (text: string) => {
  return (
    <Message duration={3000} showIcon type={"success"}>
      {text}
    </Message>
  );
};
