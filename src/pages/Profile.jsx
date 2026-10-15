import { useEffect, useState } from "react";
import { updateProfile } from "firebase/auth";
import { Camera } from "lucide-react";
import { ref as dbRef, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";

export default function Profile() {
  const { user, refreshUser, logout } = useAuth();
  const [name, setName] = useState(user.displayName || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview]);

  const pick = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return setMsg({ type: "error", text: "Choose an image file (JPG or PNG)." });
    if (f.size > 2 * 1024 * 1024) return setMsg({ type: "error", text: "Image must be smaller than 2 MB." });
    setMsg(null);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return setMsg({ type: "error", text: "Enter your name." });
    setBusy(true);
    setMsg(null);
    try {
      let photoURL = user.photoURL || "";
      if (file) {
        const fileRef = storageRef(storage, `profilePictures/${user.uid}/avatar`);
        await uploadBytes(fileRef, file, { contentType: file.type });
        photoURL = await getDownloadURL(fileRef);
      }
      await updateProfile(auth.currentUser, { displayName: name.trim(), photoURL });
      await update(dbRef(db, `users/${user.uid}/profile`), { displayName: name.trim(), photoURL });
      refreshUser();
      setFile(null);
      setPreview("");
      setMsg({ type: "ok", text: "Profile updated." });
    } catch {
      setMsg({ type: "error", text: "Could not update your profile. Check your connection and try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="page-head">
        <h1>Profile</h1>
      </header>
      <form className="panel form" onSubmit={save}>
        {msg && <p className={`alert alert-${msg.type}`}>{msg.text}</p>}
        <div className="profile-pic">
          {preview ? <img className="avatar" style={{ width: 96, height: 96 }} src={preview} alt="New profile" /> : <Avatar user={user} size={96} />}
          <label className="btn">
            <Camera size={16} /> Choose photo
            <input type="file" accept="image/*" onChange={pick} hidden />
          </label>
        </div>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={50} required />
        </label>
        <label>
          Email
          <input value={user.email} disabled />
        </label>
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </button>
          <button type="button" className="btn" onClick={logout}>
            Log out
          </button>
        </div>
      </form>
    </>
  );
}
