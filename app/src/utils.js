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
