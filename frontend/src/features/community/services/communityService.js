/**
 * Community Service
 * All strings use template literals to avoid apostrophe/quote escaping issues.
 */

const USERS = [
    { id: 'u1', name: 'Rahul Kumar',  avatar: '\u{1F9D1}\u200D\u{1F33E}', district: 'Agra',    points: 1420, badge: 'Expert Farmer' },
    { id: 'u2', name: 'Sunita Devi',  avatar: '\u{1F469}\u200D\u{1F33E}', district: 'Varanasi', points: 980,  badge: 'Water Saver' },
    { id: 'u3', name: 'Vikram Pawar', avatar: '\u{1F9D1}\u200D\u{1F33E}', district: 'Nashik',   points: 875,  badge: 'Pest Specialist' },
    { id: 'u4', name: 'Geetha Rani',  avatar: '\u{1F469}\u200D\u{1F33E}', district: 'Kurnool',  points: 760,  badge: 'Seed Expert' },
    { id: 'u5', name: 'Arjun Singh',  avatar: '\u{1F9D1}\u200D\u{1F33E}', district: 'Amritsar', points: 650,  badge: 'Expert Farmer' },
    { id: 'u6', name: 'Priya Sharma', avatar: '\u{1F469}\u200D\u{1F33E}', district: 'Jaipur',   points: 540,  badge: 'Newcomer' },
    { id: 'u7', name: 'Mohan Lal',    avatar: '\u{1F9D1}\u200D\u{1F33E}', district: 'Hisar',    points: 420,  badge: 'Water Saver' },
    { id: 'u8', name: 'Kavitha Nair', avatar: '\u{1F469}\u200D\u{1F33E}', district: 'Thrissur', points: 310,  badge: 'Newcomer' },
];

const POSTS = [
    {
        id: 'p1', userId: 'u1',
        category: 'pests',
        title: `Yellow rust spreading fast on wheat — urgent help needed!`,
        body: `My wheat field in Block C has started showing yellow rust symptoms over the last 3 days. The progress is alarming. I have attached a clear image. What fungicide schedule should I follow immediately?`,
        tags: ['Wheat', 'Rust', 'Fungicide'],
        likes: 47, saves: 12, views: 340, commentCount: 18,
        time: '2h ago', timeMs: Date.now() - 2 * 3600 * 1000,
        aiSuggested: true, pinned: false, solved: false,
    },
    {
        id: 'p2', userId: 'u2',
        category: 'irrigation',
        title: `Drip irrigation setup for paddy — my experience after 60 days`,
        body: `Sharing my detailed notes after switching from flood irrigation to drip. Water usage fell by 38% and we saw a 12% yield improvement. Happy to answer questions from anyone considering the switch.`,
        tags: ['Rice', 'Drip Irrigation', 'Water Saving'],
        likes: 128, saves: 56, views: 1240, commentCount: 34,
        time: '5h ago', timeMs: Date.now() - 5 * 3600 * 1000,
        aiSuggested: false, pinned: true, solved: true,
    },
    {
        id: 'p3', userId: 'u3',
        category: 'soil',
        title: `Soil pH dropping to 4.8 — what corrective measures work best?`,
        body: `My soil test came back with pH 4.8 in the lower plot. This is acidic, significantly below optimal. I have heard about lime application but am not sure of the rate per acre for my black soil type.`,
        tags: ['Soil pH', 'Lime', 'Black Soil'],
        likes: 33, saves: 8, views: 220, commentCount: 9,
        time: '1d ago', timeMs: Date.now() - 24 * 3600 * 1000,
        aiSuggested: true, pinned: false, solved: false,
    },
    {
        id: 'p4', userId: 'u4',
        category: 'crops',
        title: `Hybrid maize vs open-pollinated on red laterite soil — what yields better?`,
        body: `Planning to sow 4 acres with maize this kharif. Our soil is red laterite with moderate organic matter. Has anyone done direct comparisons between HQPM-1 and local hybrids here in Andhra?`,
        tags: ['Maize', 'Hybrid Seeds', 'Kharif'],
        likes: 61, saves: 29, views: 560, commentCount: 22,
        time: '2d ago', timeMs: Date.now() - 48 * 3600 * 1000,
        aiSuggested: false, pinned: false, solved: true,
    },
    {
        id: 'p5', userId: 'u5',
        category: 'weather',
        title: `Unexpected frost warning tonight — protecting mustard crop`,
        body: `Met office has issued a frost watch for our tehsil tonight. Temperature expected to drop to 2 degrees C. What immediate protective measures can we take for our mustard crop at the flowering stage?`,
        tags: ['Mustard', 'Frost', 'Weather Alert'],
        likes: 92, saves: 44, views: 870, commentCount: 28,
        time: '3d ago', timeMs: Date.now() - 72 * 3600 * 1000,
        aiSuggested: true, pinned: false, solved: true,
    },
    {
        id: 'p6', userId: 'u6',
        category: 'crops',
        title: `Best variety of okra for summer cultivation in Rajasthan heat?`,
        body: `Looking for heat-tolerant okra (bhindi) varieties suited for Jaipur summer conditions where mercury hits 45C and above. Any success stories from fellow farmers in arid zones?`,
        tags: ['Okra', 'Summer Crop', 'Heat Tolerance'],
        likes: 15, saves: 6, views: 145, commentCount: 5,
        time: '4d ago', timeMs: Date.now() - 96 * 3600 * 1000,
        aiSuggested: false, pinned: false, solved: false,
    },
];

const COMMENTS = {
    p1: [
        {
            id: 'c1', userId: 'u3',
            text: `Apply Propiconazole 25 EC at 0.1% immediately. Repeat after 14 days if needed. Do not wait — yellow rust spreads exponentially in cool, humid conditions.`,
            upvotes: 18, downvotes: 0, time: '1h ago', isAI: false, isAccepted: true,
        },
        {
            id: 'c2', userId: null,
            text: `AI Analysis: Based on current weather (17 deg C, 78% RH) in Agra and the visible infection pattern, this appears to be Puccinia striiformis. Recommended: Tebuconazole 250 EC at 0.1% as foliar spray. Ensure uniform coverage on flag leaves. Repeat in 10 days.`,
            upvotes: 25, downvotes: 1, time: '1h ago', isAI: true, isAccepted: false,
        },
        {
            id: 'c3', userId: 'u5',
            text: `Make sure you remove severely infected leaves before spraying to break the spore cycle. Also check your seed lot — some batches from last year were already pre-infected.`,
            upvotes: 7, downvotes: 0, time: '45m ago', isAI: false, isAccepted: false,
        },
    ],
    p2: [
        {
            id: 'c4', userId: 'u1',
            text: `Amazing results! What brand of drip tape are you using? And did you need any government subsidy to cover the initial setup cost?`,
            upvotes: 12, downvotes: 0, time: '4h ago', isAI: false, isAccepted: false,
        },
        {
            id: 'c5', userId: 'u2',
            text: `Reply: I used Netafim tapes via PM Micro Irrigation Scheme. Got 45% subsidy. Highly recommend applying before the April 30 deadline this year.`,
            upvotes: 22, downvotes: 0, time: '3h ago', isAI: false, isAccepted: true,
        },
    ],
};

const FORUMS = [
    { id: 'f1', name: 'Wheat & Rabi',       icon: 'barley',        color: '#F9A825', threads: 128, members: 4201, category: 'crops' },
    { id: 'f2', name: 'Rice & Paddy',        icon: 'clover',        color: '#00897B', threads: 94,  members: 3870, category: 'crops' },
    { id: 'f3', name: 'Water & Irrigation',  icon: 'water',         color: '#0288D1', threads: 67,  members: 2910, category: 'irrigation' },
    { id: 'f4', name: 'Soil Science',        icon: 'shovel',        color: '#6D4C41', threads: 55,  members: 1980, category: 'soil' },
    { id: 'f5', name: 'Pest Control',        icon: 'bug',           color: '#E53935', threads: 84,  members: 3120, category: 'pests' },
    { id: 'f6', name: 'Organic Farming',     icon: 'leaf',          color: '#2E7D32', threads: 41,  members: 1540, category: 'crops' },
];

const KNOWLEDGE_TIPS = [
    {
        id: 'k1', tag: 'Irrigation', savedBy: 342, updated: '2 days ago',
        title: `Top 5 Irrigation Practices This Week`,
        summary: `Community consensus: Drip irrigation and soil moisture sensors cut water usage by 35-40% vs flood irrigation. Early morning watering reduces evaporation loss by about 18%.`,
    },
    {
        id: 'k2', tag: 'Disease', savedBy: 218, updated: '1 week ago',
        title: `Rust Prevention Before Sowing`,
        summary: `Treat seeds with Thiram and Carbendazim (2g+1g per kg) before every rabi sowing. Community data across 200+ farms showed 94% rust prevention rate.`,
    },
    {
        id: 'k3', tag: 'Soil', savedBy: 175, updated: '3 days ago',
        title: `Soil pH Correction Guide`,
        summary: `For acidic soils (pH below 6): Apply 2-3 tonnes per acre of agricultural lime 3-4 weeks before sowing. Re-test after 45 days. Beneficial for all rabi crops.`,
    },
];

const LEADERBOARD = [...USERS].sort((a, b) => b.points - a.points);

const BADGE_META = {
    'Expert Farmer':   { icon: 'medal',        color: '#F9A825', desc: '100+ helpful answers accepted' },
    'Water Saver':     { icon: 'water-check',  color: '#0288D1', desc: 'Promoted drip irrigation practices' },
    'Pest Specialist': { icon: 'bug-check',    color: '#E53935', desc: '50+ pest-related solutions given' },
    'Seed Expert':     { icon: 'sprout',       color: '#2E7D32', desc: 'Expert in seed selection and treatment' },
    'Newcomer':        { icon: 'account-plus', color: '#9E9E9E', desc: 'Welcome to the community!' },
};

const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

const communityService = {
    getUserById: (id) => USERS.find(u => u.id === id) || null,
    getAllUsers: () => USERS,
    getBadgeMeta: (badge) => BADGE_META[badge] || BADGE_META['Newcomer'],

    getPosts: async ({ category = 'all', sort = 'latest' } = {}) => {
        await simulateDelay(300);
        let result = [...POSTS];
        if (category !== 'all') result = result.filter(p => p.category === category);
        if (sort === 'trending') result.sort((a, b) => (b.likes + b.commentCount) - (a.likes + a.commentCount));
        else if (sort === 'latest') result.sort((a, b) => b.timeMs - a.timeMs);
        else if (sort === 'saved') result.sort((a, b) => b.saves - a.saves);
        result.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
        return result;
    },

    getComments: async (postId) => {
        await simulateDelay(250);
        return COMMENTS[postId] || [];
    },

    likePost: async (postId) => {
        const post = POSTS.find(p => p.id === postId);
        if (post) post.likes++;
        return { success: true, newLikes: post ? post.likes : 0 };
    },

    savePost: async (postId) => {
        const post = POSTS.find(p => p.id === postId);
        if (post) post.saves++;
        return { success: true };
    },

    submitComment: async (postId, text, isAI = false) => {
        await simulateDelay(300);
        const newComment = {
            id: `c_${Date.now()}`,
            userId: 'u1',
            text,
            upvotes: 0,
            downvotes: 0,
            time: 'Just now',
            isAI,
            isAccepted: false,
        };
        if (!COMMENTS[postId]) COMMENTS[postId] = [];
        COMMENTS[postId].unshift(newComment);
        const post = POSTS.find(p => p.id === postId);
        if (post) post.commentCount++;
        return newComment;
    },

    getAISuggestion: async (postTitle, postBody) => {
        await simulateDelay(800);
        const suggestions = [
            `Based on the described symptoms and current agro-climatic conditions, this appears to be a fungal infection. Recommended: Apply systemic fungicide (Propiconazole 25 EC at 1ml/L) as foliar spray at 14-day intervals. Ensure soil drainage is adequate.`,
            `AI Analysis: Soil conditions described suggest moderate nutrient deficiency. Apply vermicompost (1.5 tonnes per acre) with micro-nutrient foliar spray containing Zinc and Boron. Re-test soil pH after 30 days.`,
            `Weather Intelligence: Moisture stress predicted over next 7 days in your region. Pre-emptive light irrigation (15-20mm) recommended 48hrs before expected dry spell. Monitor crop at flag leaf stage.`,
        ];
        return suggestions[Math.floor(Math.random() * suggestions.length)];
    },

    submitPost: async (postData) => {
        await simulateDelay(500);
        let currentUserId = 'u1';

        if (postData.authorName || postData.authorLocation) {
            currentUserId = `u_${Date.now()}`;
            USERS.push({
                id: currentUserId,
                name: postData.authorName || 'Farmer',
                district: postData.authorLocation || 'Unknown',
                avatar: '\u{1F9D1}\u200D\u{1F33E}',
                points: 0,
                badge: 'Newcomer'
            });
        }

        const newPost = {
            id: `p_${Date.now()}`,
            userId: currentUserId,
            title: postData.title,
            body: postData.body,
            category: postData.category,
            tags: postData.tags,
            likes: 0, saves: 0, views: 1, commentCount: 0,
            time: 'Just now', timeMs: Date.now(),
            aiSuggested: false, pinned: false, solved: false,
        };
        POSTS.unshift(newPost);
        return newPost;
    },

    getForums: async () => {
        await simulateDelay(200);
        return FORUMS;
    },

    getForumPosts: async (forumCategory) => {
        await simulateDelay(200);
        return POSTS.filter(p => p.category === forumCategory);
    },

    getKnowledgeHub: async () => {
        await simulateDelay(200);
        return KNOWLEDGE_TIPS;
    },

    getLeaderboard: async () => {
        await simulateDelay(200);
        return LEADERBOARD;
    },

    upvoteComment: async (commentId) => {
        for (const key of Object.keys(COMMENTS)) {
            const c = COMMENTS[key].find(c => c.id === commentId);
            if (c) {
                c.upvotes++;
                return { success: true, newUpvotes: c.upvotes };
            }
        }
        return { success: false };
    },
};

export default communityService;
