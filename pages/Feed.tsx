import React, { useState } from 'react';
import { Post, User } from '../types';
import Card from '../components/Card';
import { PhotoIcon, VideoCameraIcon, PencilSquareIcon } from '../components/icons';

const mockUsers: { [key: string]: User } = {
  '1': { id: '1', name: 'Alena Novakova', avatarUrl: 'https://picsum.photos/id/1027/200' },
  '2': { id: '2', name: 'Jan Svoboda', avatarUrl: 'https://picsum.photos/id/1005/200' },
};

const initialPosts: Post[] = [
  {
    id: 'p1',
    author: mockUsers['1'],
    timestamp: '2 hours ago',
    content: 'Just discovered the name day for "Adéla" is September 2nd in the Czech Republic! So cool. 🎉 #nameday #czechia',
    likes: 12,
    comments: 4,
  },
  {
    id: 'p2',
    author: mockUsers['2'],
    timestamp: '5 hours ago',
    content: 'Enjoying the beautiful day outside!',
    imageUrl: 'https://picsum.photos/seed/feed2/600/400',
    likes: 45,
    comments: 18,
  },
    {
    id: 'p3',
    author: mockUsers['1'],
    timestamp: '1 day ago',
    content: 'Who knew there were so many interesting holidays in Japan this month? Learning something new every day thanks to this app!',
    imageUrl: 'https://picsum.photos/seed/feed3/600/400',
    likes: 28,
    comments: 9,
  },
];

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <Card className="mb-6">
      <div className="p-5">
        <div className="flex items-center mb-4">
          <img className="h-12 w-12 rounded-full object-cover" src={post.author.avatarUrl} alt={post.author.name} />
          <div className="ml-4">
            <p className="font-semibold text-gray-800">{post.author.name}</p>
            <p className="text-sm text-gray-500">{post.timestamp}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-4">{post.content}</p>
      </div>
      {post.imageUrl && (
        <img className="w-full h-auto" src={post.imageUrl} alt="Post content" />
      )}
      <div className="p-4 flex justify-between items-center text-gray-500 border-t border-gray-100">
        <div className="text-sm">{post.likes} likes • {post.comments} comments</div>
        <div>
           {/* Placeholder for actions */}
        </div>
      </div>
    </Card>
  );
};


const CreatePost: React.FC<{ onAddPost: (content: string) => void }> = ({ onAddPost }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            onAddPost(content);
            setContent('');
        }
    };

    return (
        <Card className="mb-8 p-5">
            <div className="flex items-start space-x-4">
                <img className="h-12 w-12 rounded-full object-cover" src="https://picsum.photos/id/1/200" alt="Current User" />
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full p-3 bg-base-200 border-transparent rounded-lg focus:ring-2 focus:ring-primary-light transition"
                        rows={3}
                        placeholder="What's happening?"
                    />
                </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
                <div className="flex space-x-4 text-gray-500">
                    <button className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"><PhotoIcon className="w-6 h-6 text-green-500" /><span>Photo</span></button>
                    <button className="flex items-center space-x-2 py-2 px-3 rounded-lg hover:bg-base-200 transition-colors"><VideoCameraIcon className="w-6 h-6 text-red-500" /><span>Video</span></button>
                </div>
                <button 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:shadow-indigo-200/80 text-white font-bold py-2 px-6 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    disabled={!content.trim()}
                >
                    Post
                </button>
            </div>
        </Card>
    );
};


const Feed: React.FC = () => {
    const [posts, setPosts] = useState(initialPosts);

    const handleAddPost = (content: string) => {
        const newPost: Post = {
            id: `p${Date.now()}`,
            author: { id: '0', name: 'You', avatarUrl: 'https://picsum.photos/id/1/200' }, // Current user
            timestamp: 'Just now',
            content,
            likes: 0,
            comments: 0,
        };
        setPosts([newPost, ...posts]);
    };

  return (
    <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-neutral mb-8">Feed</h1>
        <CreatePost onAddPost={handleAddPost} />
        <div>
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    </div>
  );
};

export default Feed;