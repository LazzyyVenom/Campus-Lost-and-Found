import { useEffect, useState } from 'react';
import client from '../api/client';

export default function MyPostsPage() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState('');
  const [editForm, setEditForm] = useState({ title: '', description: '', locationLost: '', locationFound: '', contactInfo: '' });

  async function loadPosts() {
    const response = await client.get('/items/my-posts');
    setPosts(response.data.posts);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  function startEdit(post) {
    setEditingId(post._id);
    setEditForm({
      title: post.title,
      description: post.description,
      locationLost: post.locationLost || '',
      locationFound: post.locationFound || '',
      contactInfo: post.contactInfo,
    });
  }

  function onChange(event) {
    setEditForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function saveEdit(postId) {
    await client.put(`/items/${postId}`, editForm);
    setEditingId('');
    loadPosts();
  }

  async function deletePost(postId) {
    await client.delete(`/items/${postId}`);
    loadPosts();
  }

  async function markReturned(postId) {
    await client.post(`/items/${postId}/mark-returned`);
    loadPosts();
  }

  return (
    <section className="panel">
      <h1>My Posts</h1>
      <div className="cards-grid">
        {posts.map((post) => (
          <article key={post._id} className="item-card">
            {editingId === post._id ? (
              <>
                <input name="title" value={editForm.title} onChange={onChange} />
                <textarea name="description" value={editForm.description} onChange={onChange} rows={4} />
                <input name="locationLost" value={editForm.locationLost} onChange={onChange} placeholder="Lost location" />
                <input name="locationFound" value={editForm.locationFound} onChange={onChange} placeholder="Found location" />
                <input name="contactInfo" value={editForm.contactInfo} onChange={onChange} placeholder="Contact" />
                <div className="actions">
                  <button className="btn btn-gold" onClick={() => saveEdit(post._id)} type="button">Save</button>
                  <button className="btn btn-secondary" onClick={() => setEditingId('')} type="button">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="item-row">
                  <span className="chip">{post.itemType}</span>
                  <span className={`badge ${post.status.toLowerCase()}`}>{post.status}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <p><strong>Contact:</strong> {post.contactInfo}</p>
                <div className="actions">
                  <button className="btn btn-secondary" onClick={() => startEdit(post)} type="button">Edit</button>
                  <button className="btn btn-danger" onClick={() => deletePost(post._id)} type="button">Delete</button>
                  {post.status !== 'RETURNED' && (
                    <button className="btn btn-gold" onClick={() => markReturned(post._id)} type="button">Mark Returned</button>
                  )}
                </div>
              </>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
