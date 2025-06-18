export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      color: '#171717'
    }}>
      <h1 style={{ marginBottom: '20px', color: '#171717' }}>L&D Course Platform</h1>
      <p style={{ marginBottom: '20px', color: '#666' }}>
        Create and manage courses for your organization
      </p>
      <a 
        href="/login"
        style={{
          padding: '10px 20px',
          backgroundColor: '#007cba',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px'
        }}
      >
        Get Started
      </a>
    </div>
  );
}
