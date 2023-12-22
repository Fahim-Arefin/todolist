import { Link } from "react-router-dom";

function Button({ children, primary, secondary, outline, ...rest }) {
  let primaryStyle = `rounded-lg border-none bg-[#F87060] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#F87060] focus:outline-none focus:ring focus:ring-[#F87060] 
  focus:ring-offset-2 active:bg-[#F87060] disabled:cursor-not-allowed disabled:bg-purple-200`;

  let primaryOutline = `rounded-lg border border-[#F87060] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#F87060] focus:outline-none focus:ring focus:ring-[#F87060] 
  focus:ring-offset-2 active:bg-[#F87060] disabled:cursor-not-allowed disabled:bg-purple-200`;

  let secondaryStyle = `rounded-lg border-none bg-[#c63525] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#8e2218] focus:outline-none focus:ring focus:ring-[#8e2218] 
  focus:ring-offset-2 active:bg-[#c63525] disabled:cursor-not-allowed disabled:bg-purple-200 `;

  let secondaryOutline = `rounded-lg border border-[#c63525] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#c63525] focus:outline-none focus:ring focus:ring-[#c63525] 
  focus:ring-offset-2 active:bg-[#c63525] disabled:cursor-not-allowed disabled:bg-purple-200`;

  // b2ebf9
  //if button use as a link
  if (rest?.to) {
    return (
      <Link
        className={`${
          primary
            ? outline
              ? primaryOutline
              : primaryStyle
            : secondary
            ? outline
              ? secondaryOutline
              : secondaryStyle
            : ""
        } ${rest.className}`}
        to={rest.to}
      >
        {children}
      </Link>
    );
  }

  //primary button
  return (
    <div>
      <button
        {...rest}
        className={`${
          //   primary ? primaryStyle : secondary ? secondaryStyle : ""
          primary
            ? outline
              ? primaryOutline
              : primaryStyle
            : secondary
            ? outline
              ? secondaryOutline
              : secondaryStyle
            : ""
        } ${rest.className}`}
      >
        {children}
      </button>
    </div>
  );
}

export default Button;
