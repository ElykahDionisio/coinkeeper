export default function Avatar({ user, size = 40 }) {
  const initial = (user.displayName || user.email || "?").charAt(0).toUpperCase();
  const style = { width: size, height: size, fontSize: size * 0.42 };
  return user.photoURL ? (
    <img className="avatar" style={style} src={user.photoURL} alt="Profile" />
  ) : (
    <span className="avatar avatar-initial" style={style}>
      {initial}
    </span>
  );
}
