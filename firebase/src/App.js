import './App.css';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import 'firebase/firestore';
import { initializeApp } from "firebase/app";

// Firebase configuration, copy-paste from firebase console
const firebaseConfig = {
  apiKey: "xyz",
  authDomain: "xyz.firebaseapp.com",
  projectId: "xyz-xyz-xyz-xyz",
  storageBucket: "xyz.appspot.com",
  messagingSenderId: "xyz",
  appId: "1:xyz:web:xyz"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();



function CreatePost({addPost}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addPost({title, content});
    setTitle('');
    setContent('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title" 
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      <button type="submit">Submit</button>
    </form>
  )
}

function Post({ post, updatePost, deletePost }) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  const handleUpdate = () => {
    updatePost(post.id, {title, content});
  }

  return (
    <div>
      <input 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea 
        value={content}
        onChange={(e) => setContent(e.target.value)}  
      />
      <button onClick={handleUpdate}>Update</button>
      <button onClick={() => deletePost(post.id)}>Delete</button>
    </div>
  )
}



function App() {
  const [posts, setPosts] = useState([]);
  
  // Create
const addPost = async (post) => {
  const ref = collection(db, 'posts');
  const doc = await addDoc(ref, post);
  setPosts(prev => [...prev, {...post, id: doc.id}]);
}

// Read
useEffect(() => {
  const getPosts = async () => {
    const snapshot = await getDocs(collection(db, 'posts'));
    const allPosts = snapshot.docs.map(doc => {
      const data = doc.data();
      if (doc.id && data) {
        return {...data, id: doc.id};
      }
      return null;  // or you can return an empty object {}, based on your requirements
    }).filter(Boolean);  // This will filter out any null values
  
    setPosts(allPosts);
  }

  getPosts();
}, [])

// Update
const updatePost = async (id, updatedPost) => {
  console.log("Printing id here!")
  console.log(id)
  if(id){
    const postDoc = doc(db, 'posts', id);
    await updateDoc(postDoc, updatedPost);
    setPosts(prev => prev.map(post => {
      if (post.id === id) {
        return { ...updatedPost, id: id };  // Ensure ID is retained
      }
      return post; 
    
  }));
  }

}

// Delete 
const deletePost = async (id) => {
  console.log("Printing id here!")
  console.log(id)
  if(!id){
    console.error("Invalid ID");
    return;
  }
  const postDoc = doc(db, 'posts', id);
  await deleteDoc(postDoc);
  setPosts(prev => prev.filter(post => post.id !== id));
}

  return (
    <div className="App">
      <h1>My Blog</h1>
      
      <CreatePost addPost={addPost} />

      {posts.map(post => (
        <Post 
          key={post.id}
          post={post}
          updatePost={updatePost}
          deletePost={deletePost}
        />
      ))}
    </div>
  );
}

export default App;
