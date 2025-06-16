export default function DashboardPage() {
  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Your Courses</h1>
      
      <div style={{
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#fafafa'
      }}>
        <p style={{ 
          marginBottom: '20px',
          color: '#666',
          fontSize: '16px'
        }}>
          No courses yet
        </p>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#007cba',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Create Your First Course
        </button>
      </div>
    </div>
  );
} 