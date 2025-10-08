import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Eye, Heart, MessageCircle, Bookmark, Search, Filter } from 'lucide-react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function BlogDashboard() {
  const [activeTab, setActiveTab] = useState('feed');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allPosts, setAllPosts] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const[pagination, setPagination] = useState({
    next_page: null,
    prev_page: null,
    base_page: null
  });

  const navigate = useNavigate();
  
  
  function parseUserCookie(cookieValue) {
  try {
    // Try parsing directly (normal login case)
    return JSON.parse(cookieValue);
  } catch {
    try {
      // If that fails, try decoding base64 first (Google OAuth case)
      return JSON.parse(atob(cookieValue));
    } catch {
      console.error("Invalid user cookie format");
      return null;
    }
  }
}

  const userCookie = Cookies.get("user");
  const parsedUser = userCookie ? parseUserCookie(userCookie) : null;

  const currentUser = {
    firstname: parsedUser?.firstname || "Guest",
    email: parsedUser?.email || "unknown",
    avatar: 'JD',
    access_token: localStorage.getItem('access_token')
  };


  useEffect(() => {
    // Fetch all blog posts from the backend
    const fetchAllPosts = async () => {
      try{
        const response = await fetch('http://localhost:8000/dashboard/feed', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access_token}`
        }
      }
        );
        if(response.ok){
          const data = await response.json();
          console.log(data);
          setAllPosts(data.data);
          setPagination(data.pagination);
          const initialLiked = {};
        data.data.forEach(post => {
          initialLiked[post.id] = post.is_liked;
        });
        setLikedPosts(initialLiked);
        }
    }

      catch(error){
        console.error('Error fetching posts:', error);
      }
    };

    fetchAllPosts();
  }, []);

  useEffect(() => {
    // Fetch all blog posts from the backend
    const fetchAllUserPosts = async () => {
      try{
        const response = await fetch('http://localhost:8000/dashboard/userposts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access_token}`
        }
      }
        );
        if(response.ok){
          const data = await response.json();
          setUserPosts(data);
          console.log(data);
          
        }
    }

      catch(error){
        console.error('Error fetching posts:', error);
      }
    };

    fetchAllUserPosts();
  }, []);

  
  const categories = ['all', 'Technology', 'Lifestyle', 'Environment', 'Art'];

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: ''
  });

  const handleLike = async (id) => {
    setLikedPosts(prev => ({ ...prev, [id]: !prev[id] }));

  setAllPosts((prevPosts) =>
    prevPosts.map((post) =>{
      if (post.id == id){
        const newLiked = !post.is_liked; // toggle liked state
        const newLikesCount = newLiked ? post.likes + 1 : post.likes - 1;

        return {
          ...post,
          is_liked: newLiked,
          likes: newLikesCount
        };
      }
      return post;
    })
  );

  const post = allPosts.find((post) => post.id === id);
  const newLikedState = !post.liked;

  try{

    const response = await fetch('http://localhost:8000/blog/like?id='+id, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.access_token}`
      },
      body: JSON.stringify({ is_liked: newLikedState })
    });

    if (!response.ok) {
      // Revert the UI if API call fails
      const data = await response.json();
      console.log(data.message);
      setAllPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === id) {
            const revertLiked = !post.is_liked; // revert toggle
            const revertLikes = revertLiked ? post.likes + 1 : post.likes - 1;
            return { ...post, is_liked: revertLiked, likes: revertLikes };
          }
          return post;
        })
      );
      console.error('Failed to update like on server');
    }

  }
  catch(error){
    // setAllPosts(prevPosts =>
    //   prevPosts.map(p =>
    //     p.id === id
    //       ? {
    //           ...p,
    //           liked: post.liked,
    //           likes: post.liked ? p.likes + 1 : p.likes - 1,
    //         }
    //       : p
    //   )
    // );
    console.error('Error updating like:', error);
  }
    
};

  const handleCreatePost = async () => {
    if (formData.title && formData.content) {
      const payload = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        category: formData.category,
        author: currentUser.firstname,
        authorEmail: currentUser.email
      }

      const response = await fetch('http://localhost:8000/blog/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.access_token}`
    },
        body: JSON.stringify(payload)
    }
);
if (response.ok) 
    console.log('Blog post created successfully');
    navigate('/dashboard');
 }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category
    });
    setShowCreateModal(true);
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });
};



  const handleUpdatePost = async () => {
    if (formData.title && formData.content) {
      const updatedUserPosts = userPosts.map(post =>
        post.id === editingPost.id ? { ...post, ...formData } : post
      );
      
      setUserPosts(updatedUserPosts);
      
      setFormData({ title: '', content: '', excerpt: '', category: 'Technology' });
      setShowCreateModal(false);
      try{
        const response = await fetch('http://localhost:8000/blog/edit?id=' + editingPost.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access_token}`
          },
          body: JSON.stringify(formData)
        });
        if(response.ok){
          const msg = await response.json();
          console.log(msg.message);
          window.location.reload();
        }
    }
    catch(error){
      console.error('Error editing post:', error);
    }

    }
  };

  const handleDeletePost = async (postId) => {
    try{
        const response = await fetch('http://localhost:8000/blog/delete?id=' + postId, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access_token}`
          }
        });
        if(response.ok){
          const msg = await response.json();
          console.log(msg.message);
          window.location.reload(); 
        }
    }
    catch(error){
      console.error('Error deleting post:', error);
    }
  };

  const toggleBookmark = async (postId) => {
    setAllPosts(allPosts.map(post =>
      post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
    ));

    const response = await fetch("http://localhost:8000/blog/bookmark?id="+postId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentUser.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data.message);
    }
  };

  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', excerpt: '', category: 'Technology' });
    setEditingPost(null);
    setShowCreateModal(false);
  };


  //API pagination (offset and limit pagination)
  const handlePagination = async (e) => {
    e.preventDefault();
    const page = e.target.name;

    if (page ==='next' && pagination.next_page){
      try{
        const next_url = new URL(pagination.next_page);

        const response = await fetch(next_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access_token}`
          },
      });
      if(response.ok){
          const data = await response.json();
          setAllPosts(data.data);
          setPagination(data.pagination);

          const initialLiked = {};
        data.forEach(post => {
          initialLiked[post.id] = post.is_liked;
        });
        setLikedPosts(initialLiked);

      }
      }catch(error){
        console.error("No more pages");
        return;
      }
    }

    else if(page ==='previous' && pagination.prev_page){
      try{

        const prev_url = new URL(pagination.prev_page);
        const response = await fetch(prev_url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access_token}`
          },
      });

      if(response.ok){
          const data = await response.json();
          setAllPosts(data.data);
          setPagination(data.pagination);

          const initialLiked = {};
        data.forEach(post => {
          initialLiked[post.id] = post.is_liked;
        });
        setLikedPosts(initialLiked);

      }

      }catch(error){
        console.error("No more pages");
        return;
      }
    }
    else{

      const page = e.target.name;

      try{
        const response = await fetch(`http://localhost:8000/dashboard/feed?page=${page}&page_size=4`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.access_token}`
          },
      });

       if(response.ok){
          const data = await response.json();
          setAllPosts(data.data);
          
          const initialLiked = {};
        data.forEach(post => {
          initialLiked[post.id] = post.is_liked;
        });
        setLikedPosts(initialLiked);
        }
        if(response.status === 404){
          console.error("No more pages");
          return;
        }
      }
      catch(error){
        console.error('Error fetching posts:', error);
      }
    }

  

  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <a href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">BlogHub</span>
            </a>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-medium">
                  {currentUser.avatar}
                </div>
                <span className="text-sm font-medium text-gray-900">{currentUser.firstname}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-8">
        {/* Header with Tabs */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-x-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Create Post
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('feed')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'feed'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Discover
              </button>
              <button
                onClick={() => setActiveTab('my-posts')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-posts'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Posts ({userPosts.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'feed' && (
          <div>
            {/* Search and Filter */}
            <div className="mb-8 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none bg-white"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                      <button
                        onClick={() => toggleBookmark(post.id)}
                        className="p-1 hover:bg-gray-50 rounded"
                      >
                        <Bookmark className={`h-4 w-4 ${post.bookmarked ? 'fill-gray-900 text-gray-900' : 'text-gray-400'}`} />
                      </button>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-3">
                        <div className="h-6 w-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                          {post.authorAvatar}
                        </div>
                        <span>{post.author}</span>
                        <span>•</span>
                        <time>{post.createdAt}</time>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <button className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                        onClick={() => handleLike(post.id)}>
                        <Heart className={`h-4 w-4 ${likedPosts[post.id] ? "fill-red-500 text-red-500" : ""}`} />
                          <span>{post.likes}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                      <button className="text-gray-900 hover:text-gray-700 font-medium text-sm">
                        Read More
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center space-x-2">
              <button onClick={handlePagination} name="previous" className="px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                Previous
              </button>

              <button onClick={handlePagination} name="1" className="px-4 py-2 rounded-lg font-medium text-sm bg-gray-900 text-white transition-colors">
                1
              </button>
              <button onClick={handlePagination} name="2" className="px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                2
              </button>
              <button onClick={handlePagination} name="3" className="px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                3
              </button>
              <button onClick={handlePagination} name="4" className="px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                4
              </button>
              <button onClick={handlePagination} name="5" className="px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                5
              </button>

              <button onClick={handlePagination} name="next" className="px-4 py-2 rounded-lg font-medium text-sm bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
          

        )}

        {activeTab === 'my-posts' && (
          <div>
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Edit3 className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Start writing and share your thoughts with the world.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center gap-x-2 rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Post
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="inline-block bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded-full">
                              {post.category}
                            </span>
                            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${
                              post.isPublished 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {post.excerpt}
                          </p>

                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <time>{post.createdAt}</time>
                            <div className="flex items-center space-x-1">
                              <Heart className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEditPost(post)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create/Edit Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingPost ? 'Edit Post' : 'Create New Post'}
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Enter your post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                >
                <option value="" disabled>
                  Select category
                </option>
                  {categories.slice(1).map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Write a brief description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="Write your post content..."
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingPost ? handleUpdatePost : handleCreatePost}
                className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}