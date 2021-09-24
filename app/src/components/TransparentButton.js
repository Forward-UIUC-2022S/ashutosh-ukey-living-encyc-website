import Link from "@material-ui/core/Link";

export default function TransparentButton(props) {
  return (
    <Link
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
    </Link>
  );
}
