import { PropsWithChildren } from "react";
import "./Button.scss";

type ButtonProps = PropsWithChildren &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, ...props }: ButtonProps): React.ReactElement => {
  return (
    <button
      {...props}
      className={`button ${props.className} ? ${props.className} : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
