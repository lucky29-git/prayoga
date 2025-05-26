import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SimplifiedResource {
  type: string; // 'bucket', etc.
  name: string;
  location: string;
  time_created: string;
  updated: string;
}

const Resources = () => {
  const [state, setState] = useState<SimplifiedResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchState = async () => {
      setLoading(true);
      const username = localStorage.getItem('username');
      const uuid = localStorage.getItem('uuid');
      if (!username || !uuid) {
        setState([]);
        setLoading(false);
        return;
      }
      const stateRes = await axios.get(`http://localhost:3000/prayoga/api/v1/resources/state?username=${username}&uuid=${uuid}`);
      setState(stateRes.data.resources || []);
      setLoading(false);
    };
    fetchState();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>Provisioned Resources</h1>
      <div>
        {state.length === 0 && <div>No resources found.</div>}
        <ul>
          {state.map((resource, idx) => (
            <li key={idx} style={{ marginBottom: 16, padding: 12, border: '1px solid #eee', borderRadius: 6 }}>
              <div><strong>Type:</strong> {resource.type}</div>
              <div><strong>Name:</strong> {resource.name}</div>
              <div><strong>Location:</strong> {resource.location}</div>
              <div><strong>Time Created:</strong> {resource.time_created}</div>
              <div><strong>Updated:</strong> {resource.updated}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Resources;
