import React, { useState, useEffect } from 'react';

const API = 'http://localhost:8080/albums';

function App() {
  const [albums, setAlbums] = useState([]);
  const [form, setForm] = useState({ id: '', title: '', artist: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(setAlbums);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const url = editingId ? `${API}/${editingId}` : API;
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
    });
    const updated = await fetch(API).then(r => r.json());
    setAlbums(updated);
    setForm({ id: '', title: '', artist: '', price: '' });
    setEditingId(null);
  };

   const startEdit = album => {
   setEditingId(album.id);
    setForm({
      id: album.id,
      title: album.title,
      artist: album.artist,
      price: album.price.toString(),
    });
  };

  const handleDelete = async id => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    setAlbums(albums.filter(a => a.ID !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Albums</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr><th>ID</th><th>Title</th><th>Artist</th><th>Price</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {albums.map(a =>
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>{a.artist}</td>
              <td>${a.price.toFixed(2)}</td>
              <td>
                <button onClick={() => startEdit(a)}>Edit</button>
                <button onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <h2>{editingId ? 'Edit' : 'Add'} Album</h2>
      <form onSubmit={handleSubmit}>
        <input name="id"     placeholder="ID"     value={form.id}     onChange={handleChange} required />
        <input name="title"  placeholder="Title"  value={form.title}  onChange={handleChange} required />
        <input name="artist" placeholder="Artist" value={form.artist} onChange={handleChange} required />
        <input name="price"  placeholder="Price"  value={form.price}  onChange={handleChange} required type="number" step="0.01" />
        <button type="submit">{editingId ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
}

export default App;
