export default function LoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <form style={{ 
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <h1>Login</h1>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            style={{ 
              display: 'block',
              marginTop: '5px',
              padding: '5px',
              width: '200px'
            }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            style={{ 
              display: 'block',
              marginTop: '5px',
              padding: '5px',
              width: '200px'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '5px 10px',
            cursor: 'pointer'
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
} 