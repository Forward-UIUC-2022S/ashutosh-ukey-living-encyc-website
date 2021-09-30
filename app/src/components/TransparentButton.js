import Link from "@material-ui/core/Link";

export default function TransparentButton(props) {
  return (
    <Link
      style={{
        color: "inherit",
        textDecoration: props.linkUnderline,
        "&:hover": {
          cursor: "pointer",
        },
        cursor: "pointer",
        ...props.style,
      }}
      rel="noopener"
      {...props}
    >
      {props.children}
    </Link>
  );
}
