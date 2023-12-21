import { Link } from "react-router-dom";

function Button({ children, primary, secondary, outline, ...rest }) {
  let primaryStyle = `rounded-lg border-none bg-[#F87060] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#F87060] focus:outline-none focus:ring focus:ring-[#F87060] 
  focus:ring-offset-2 active:bg-[#F87060] disabled:cursor-not-allowed disabled:bg-purple-200 text-zinc-800`;

  let primaryOutline = `rounded-lg border border-[#F87060] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#F87060] focus:outline-none focus:ring focus:ring-[#F87060] 
  focus:ring-offset-2 active:bg-[#F87060] disabled:cursor-not-allowed disabled:bg-purple-200`;

  let secondaryStyle = `rounded-lg border-none bg-[#b2ebf9] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#92d8e1] focus:outline-none focus:ring focus:ring-[#92d8e1] 
  focus:ring-offset-2 active:bg-[#72d8e1] disabled:cursor-not-allowed disabled:bg-purple-200 text-zinc-800 `;

  let secondaryOutline = `rounded-lg border border-[#72d8e1] font-semibold  tracking-wide
  transition-all duration-150 hover:bg-[#92d8e1] focus:outline-none focus:ring focus:ring-[#92d8e1] 
  focus:ring-offset-2 active:bg-[#72d8e1] disabled:cursor-not-allowed disabled:bg-purple-200 text-zinc-700`;

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
