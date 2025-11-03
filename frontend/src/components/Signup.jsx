import { useState } from 'react';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // 🆕 ADDED

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🆕 ADDED: simple email validator (client-side)
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // 🆕 CHANGED: make submit async and call your API
  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic client-side checks
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      alert('You must not leave any field blank');
      return;
    }
    if (!isValidEmail(form.email)) {
      alert('Please enter a valid email address');
      return;
    }
    if (form.password.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // your age confirmation flow
    const isAdult = window.confirm('Are you 18 years old or older?');
    if (!isAdult) {
      alert('You must be 18 or older to sign up.');
      return;
    }

    // 🆕 ADDED: call backend
    try {
      setIsSubmitting(true); // 🆕 ADDED
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'; // 🆕 ADDED
      const res = await fetch(`${base}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({})); // 🆕 ADDED (avoid JSON parse crash)

      if (!res.ok) {
        // surfaces 409/email duplicate or validation errors from server
        alert(data?.message || 'Signup failed. Please try again.');
        return;
      }

      alert('Your new account has been successfully created!');
      console.log('Created user:', data.user); // safe fields only

      // 🆕 ADDED: reset form
      setForm({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      alert('Network error. Please check your server is running.');
    } finally {
      setIsSubmitting(false); // 🆕 ADDED
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-lg p-10 rounded-xl w-full max-w-md shadow-lg space-y-6 border border-indigo-400/30"
      >
        <h2 className="text-2xl font-bold text-indigo-200 text-center">Ready to register?</h2>

        {/* 이름 */}
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required // 🆕 ADDED (HTML-level guard)
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* 이메일 */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          required // 🆕 ADDED
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Password */}
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required // 🆕 ADDED
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* 비밀번호 확인 */}
        <input
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required // 🆕 ADDED
          className="w-full p-3 rounded-lg bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* Show Password toggle */}
        <label className="flex items-center space-x-2 text-white text-sm">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="accent-indigo-400"
          />
          <span>Show password</span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting} // 🆕 ADDED
          className={`w-full text-white py-3 rounded-lg transition font-semibold ${
            isSubmitting
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          {isSubmitting ? 'Signing up…' : 'Sign Up' /* 🆕 ADDED */}
        </button>
      </form>
    </div>
  );
}
