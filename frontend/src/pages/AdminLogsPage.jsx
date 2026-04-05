import { useEffect, useState } from 'react';
import client from '../api/client';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    totalSuccess: 0,
    totalFailure: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    async function loadData() {
      const response = await client.get('/admin/login-logs');
      setLogs(response.data.logs);
      setStats(response.data.stats);
    }

    loadData();
  }, []);

  return (
    <>
      <section className="hero-big hero-public">
        <div>
          <p className="hero-label">Admin View</p>
          <h1>Admin Login Logs</h1>
          <p>Track login attempts, success rates, and user activity from one secure place.</p>
        </div>
        <div className="stat-boxes">
          <article><p>Total Attempts</p><strong>{stats.totalAttempts}</strong></article>
          <article><p>Success</p><strong>{stats.totalSuccess}</strong></article>
          <article><p>Failure</p><strong>{stats.totalFailure}</strong></article>
          <article><p>Users</p><strong>{stats.totalUsers}</strong></article>
        </div>
      </section>

      <section className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>User</th>
                <th>Email Attempted</th>
                <th>Status</th>
                <th>IP</th>
                <th>User Agent</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log._id}>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>{log.userId?.name || '-'}</td>
                  <td>{log.emailAttempted}</td>
                  <td>
                    <span className={`badge ${log.loginStatus === 'SUCCESS' ? 'success' : 'failure'}`}>
                      {log.loginStatus}
                    </span>
                  </td>
                  <td>{log.ipAddress || '-'}</td>
                  <td>{log.userAgent || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
