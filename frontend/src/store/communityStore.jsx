/**
 * Community Store — Kisaan Setu
 * Global state for Community Dashboard using React Context
 */
import React, { createContext, useContext, useState, useCallback } from 'react';
import communityService from '../features/community/services/communityService';

const CommunityContext = createContext(null);

export const CommunityProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [savedPostIds, setSavedPostIds] = useState(new Set());
    const [likedPostIds, setLikedPostIds] = useState(new Set());
    const [notifications, setNotifications] = useState([
        { id: 'n1', text: 'Rahul Kumar replied to your post', time: '10m ago', read: false },
        { id: 'n2', text: 'Your question on Wheat Rust is trending!', time: '1h ago', read: false },
        { id: 'n3', text: 'Weather Alert: Frost warning in your region', time: '3h ago', read: true },
    ]);

    const loadPosts = useCallback(async (filters) => {
        const data = await communityService.getPosts(filters);
        setPosts(data);
        return data;
    }, []);

    const submitPost = useCallback(async (postData) => {
        const newPost = await communityService.submitPost(postData);
        setPosts(prev => [newPost, ...prev]);
        return newPost;
    }, []);

    const toggleLike = useCallback(async (postId) => {
        setLikedPostIds(prev => {
            const next = new Set(prev);
            if (next.has(postId)) next.delete(postId);
            else next.add(postId);
            return next;
        });
        await communityService.likePost(postId);
    }, []);

    const toggleSave = useCallback(async (postId) => {
        setSavedPostIds(prev => {
            const next = new Set(prev);
            if (next.has(postId)) next.delete(postId);
            else next.add(postId);
            return next;
        });
        await communityService.savePost(postId);
    }, []);

    const markAllNotificationsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <CommunityContext.Provider value={{
            posts, loadPosts, submitPost,
            savedPostIds, toggleSave,
            likedPostIds, toggleLike,
            notifications, unreadCount, markAllNotificationsRead,
        }}>
            {children}
        </CommunityContext.Provider>
    );
};

export const useCommunity = () => {
    const ctx = useContext(CommunityContext);
    if (!ctx) throw new Error('useCommunity must be used inside CommunityProvider');
    return ctx;
};
