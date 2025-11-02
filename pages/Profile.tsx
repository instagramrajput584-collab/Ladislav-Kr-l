import React from 'react';
import Card from '../components/Card';
import { Post, User } from '../types';
import { CalendarDaysIcon, UsersIcon, PhotoIcon } from '../components/icons';

const currentUser: User = {
    id: '0',
    name: 'Karel Novák',
    avatarUrl: 'https://picsum.photos/id/1/200',
};

const userPosts: Post[] = [
    {
        id: 'up1', author: currentUser, timestamp: '3 days ago',
        content: 'Planning my trip for next year. Any suggestions for countries with fascinating public holidays in March?',
        likes: 15, comments: 8
    },
    {
        id: 'up2', author: currentUser, timestamp: '1 week ago',
        content: 'What a beautiful sunset!',
        imageUrl: 'https://picsum.photos/seed/profile1/600/400',
        likes: 52, comments: 11
    }
];

const Profile: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <Card className="mb-8">
                <div className="relative">
                    <img className="h-48 w-full object-cover rounded-t-xl" src="https://picsum.photos/seed/banner/1200/400" alt="Profile banner" />
                    <div className="absolute -bottom-16 left-8">
                        <img className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" src={currentUser.avatarUrl} alt={currentUser.name} />
                    </div>
                </div>
                <div className="pt-20 pb-6 px-8">
                    <h2 className="text-3xl font-bold text-gray-900">{currentUser.name}</h2>
                    <p className="text-gray-500 mt-1">Lover of culture, travel, and celebrations.</p>
                </div>
                <div className="flex justify-around p-4 border-t border-gray-100 text-center">
                    <div>
                        <p className="text-2xl font-bold">128</p>
                        <p className="text-sm text-gray-500">Posts</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">543</p>
                        <p className="text-sm text-gray-500">Contacts</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold">1.2k</p>
                        <p className="text-sm text-gray-500">Likes</p>
                    </div>
                </div>
            </Card>

            <h3 className="text-2xl font-bold text-neutral mb-4">My Posts</h3>
            <div className="space-y-6">
            {userPosts.map(post => (
                 <Card key={post.id}>
                    <div className="p-5">
                        <div className="flex items-center mb-4">
                        <img className="h-12 w-12 rounded-full object-cover" src={post.author.avatarUrl} alt={post.author.name} />
                        <div className="ml-4">
                            <p className="font-semibold text-gray-800">{post.author.name}</p>
                            <p className="text-sm text-gray-500">{post.timestamp}</p>
                        </div>
                        </div>
                        <p className="text-gray-700">{post.content}</p>
                    </div>
                    {post.imageUrl && (
                        <img className="w-full h-auto" src={post.imageUrl} alt="Post content" />
                    )}
                </Card>
            ))}
            </div>
        </div>
    );
};

export default Profile;