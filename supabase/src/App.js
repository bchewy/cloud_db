import './App.css';
import { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SECRET
);

function App() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [updatedContent, setUpdatedContent] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');


  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    const { data } = await supabase.from("posts").select();
    setPosts(data);
  }
  async function createPost() {
    const { data } = await supabase.from('posts').insert([
      { title: newPostTitle, content: newPostContent }
    ]);
    getPosts();
  }
  async function deletePost(id) {
    const { data } = await supabase.from('posts').delete().eq('id', id);
    getPosts();
  }
  async function updatePost(id, newContent, newTitle) {
    const { data } = await supabase
      .from('posts')
      .update({ content: newContent, title: newTitle })
      .eq('id', id);
    getPosts();
  }
  

  return (
    <div className="App">
      <h1>my posts</h1>
        {posts.map((post) => (
  <li key={post.id}>
  {editingPostId === post.id ? (
    <input
      value={updatedTitle}
      onChange={e => setUpdatedTitle(e.target.value)}
      placeholder="Update title..."
    />
  ) : (
    post.title
  )}: 
  
  {editingPostId === post.id ? (
    <input
      value={updatedContent}
      onChange={e => setUpdatedContent(e.target.value)}
      placeholder="Update content..."
    />
  ) : (
    post.content
  )}
  
  {editingPostId === post.id ? (
    <>
      <button onClick={() => {
        updatePost(post.id, updatedContent, updatedTitle);
        setEditingPostId(null);  // Exit edit mode
        setUpdatedContent('');   // Reset updated content
        setUpdatedTitle('');     // Reset updated title
      }}>
        Save
      </button>
      <button onClick={() => setEditingPostId(null)}>Cancel</button>
    </>
  ) : (
    <button onClick={() => {
      setEditingPostId(post.id);
      setUpdatedContent(post.content);  // Set initial value to current content
      setUpdatedTitle(post.title);      // Set initial value to current title
    }}>
      Edit
    </button>
  )}

  <button onClick={() => deletePost(post.id)}>Delete</button>
</li>
          
        ))}


      <input
          value={newPostTitle}
          onChange={e => setNewPostTitle(e.target.value)}
          placeholder="Title"
        />
        <input
          value={newPostContent}
          onChange={e => setNewPostContent(e.target.value)}
          placeholder="Content"
        />
        <button onClick={createPost}>Add Post</button>
          </div>
  );
}

export default App;
