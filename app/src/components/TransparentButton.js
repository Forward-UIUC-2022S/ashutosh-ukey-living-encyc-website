export default function TransparentButton(props) {
  return (
    <div
      style={{
        color: "inherit",
        "&:hover": {
          cursor: "pointer",
        },
        cursor: "pointer",
      }}
      rel="noopener"
      {...props}
    >
      {props.children}
    </div>
  );
}
