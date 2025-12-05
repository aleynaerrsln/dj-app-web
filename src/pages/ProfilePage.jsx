// src/pages/ProfilePage.jsx
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  
  return (
    <div className="container section">
      <h1 className="section-title">Profile</h1>
      <p className="text-secondary">User ID: {id}</p>
      <p className="text-tertiary">Profil sayfası yakında eklenecek...</p>
    </div>
  );
};

export default ProfilePage;