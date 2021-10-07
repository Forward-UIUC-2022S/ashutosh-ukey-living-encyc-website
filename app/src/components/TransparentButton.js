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
        textDecoration: props.linkUnderline,
        ...props.style,
      }}
      rel="noopener"
      {...props}
    >
      {props.children}
    </Link>
  );
}
