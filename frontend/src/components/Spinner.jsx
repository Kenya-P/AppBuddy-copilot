import "./Spinner.css";

function Spinner({ size = "small", label = "Loading" }) {
  return (
    <span
      className={`spinner spinner_${size}`}
      role="status"
      aria-label={label}
    />
  );
}

export default Spinner;