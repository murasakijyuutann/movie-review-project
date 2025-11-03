import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoggedOut() {
  const navigate = useNavigate();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const isUserLoggedOut = sessionStorage.getItem('logoutReason') === 'inactivity';

    if (!isUserLoggedOut) {
      navigate('/'); // ❌ Not a valid logout, go back to home
      return;
    }

    setShowMessage(true); // ✅ Now we can show the logout message
    sessionStorage.removeItem('logoutReason'); // 🧼 Clean it up

    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  if (!showMessage) return null; // 🛑 Block rendering until confirmed

  return (
    <div className="text-center text-yellow-200 bg-yellow-500/20 p-6 mt-24 mx-auto max-w-md rounded shadow-lg">
      ⚠️ You were logged out due to inactivity.<br />
      Redirecting to home...
    </div>
  );
}
