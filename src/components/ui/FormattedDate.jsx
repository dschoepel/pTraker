import "./FormattedDate.css";
function FormattedDate({ title, dateString, separator }) {
  const date = new Date(dateString);
  return (
    <>
      <span className="date-title-style">{title}</span>
      <span>
        {date.toLocaleDateString("en-us", {
          // weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>
      <span>{separator ? `${separator}` : ""}</span>
    </>
  );
}
export default FormattedDate;
