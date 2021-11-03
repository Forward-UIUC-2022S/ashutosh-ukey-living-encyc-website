export const tabToLabelType = {
  domain: "keyword",
  tutorial: "tutorial",
  definition: "definition",
};

function getDefaultValue(cookieValue, defaultValue) {
  if (cookieValue === undefined) return defaultValue;
  else return cookieValue;
}

export function getHoverInteract(cookies) {
  return getDefaultValue(cookies.settings?.hoverInteract, true);
}

export const iconProps = (iconSize) => ({
  sx: { fontSize: iconSize },
});

export function staticButtonColorStyle(color) {
  return {
    backgroundColor: color,
    "&:hover": {
      background: color,
    },
  };
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
