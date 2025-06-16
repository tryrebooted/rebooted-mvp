'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just redirect without actual authentication
    router.push('/management-dashboard');
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      color: '#171717'
    }}>
      <form onSubmit={handleLogin} style={{ 
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        backgroundColor: '#ffffff'
      }}>
        <h1 style={{ color: '#171717' }}>Login</h1>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email" style={{ color: '#171717' }}>Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            style={{ 
              display: 'block',
              marginTop: '5px',
              padding: '5px',
              width: '200px',
              backgroundColor: '#ffffff',
              color: '#171717',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password" style={{ color: '#171717' }}>Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            style={{ 
              display: 'block',
              marginTop: '5px',
              padding: '5px',
              width: '200px',
              backgroundColor: '#ffffff',
              color: '#171717',
              border: '1px solid #ccc'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '5px 10px',
            cursor: 'pointer',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
} 