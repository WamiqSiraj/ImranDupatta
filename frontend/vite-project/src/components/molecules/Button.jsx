const Button = ({ children, variant = "primary", className, ...props }) => {
  const baseStyles = "px-6 py-2 transition-all duration-300 font-medium text-sm";
  const variants = {
    primary: "bg-[#7A3E3E] text-white hover:bg-[#5a2e2e]", // Dark brownish tone from your design
    outline: "border border-[#7A3E3E] text-[#7A3E3E] hover:bg-[#7A3E3E] hover:text-white",
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;