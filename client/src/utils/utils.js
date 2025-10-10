import toast from "react-hot-toast";

export const querySanitizer = (query) => {
    if (typeof query !== 'string') return '';
    return query
        .trim() // Remove extra spaces
        .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
        .replace(/[^a-zA-Z0-9@_. ]/g, '') // Remove all special characters except @, ., and _
        .toLowerCase();
}

export const formatDate = (date) => {
    const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', options);
};

export const tagsOptions = [
    { label: 'Technology', value: 'technology' },
    { label: 'Programming', value: 'programming' },
    { label: 'Design', value: 'design' },
    { label: 'Business', value: 'business' },
    { label: 'Health', value: 'health' },
    { label: 'Science', value: 'science' },
    { label: 'Travel', value: 'travel' },
    { label: 'Food', value: 'food' },
    { label: 'Personal', value: 'personal' },
    { label: 'Lifestyle', value: 'lifestyle' },
    { label: 'Fashion', value: 'fashion' },
    { label: 'Sports', value: 'sports' },
    { label: 'Music', value: 'music' },
    { label: 'Movies', value: 'movies' },
    { label: 'Books', value: 'books' },
    { label: 'Art', value: 'art' },
    { label: 'History', value: 'history' },
    { label: 'Politics', value: 'politics' },
    { label: 'Environment', value: 'environment' },
    { label: 'Education', value: 'education' },
    { label: 'Gaming', value: 'gaming' },
    { label: 'Photography', value: 'photography' },
    { label: 'Pets', value: 'pets' },
    { label: 'Other', value: 'other' },
    { label: 'Hobbies', value: 'hobbies' },
    { label: 'DIY', value: 'diy' },
    { label: 'Home Decor', value: 'home-decor' },
    { label: 'Cooking', value: 'cooking' },
    { label: 'Crafts', value: 'crafts' },
    { label: 'Gardening', value: 'gardening' },
    { label: 'Fitness', value: 'fitness' },
    { label: 'Yoga', value: 'yoga' },
    { label: 'Meditation', value: 'meditation' },
    { label: 'Mindfulness', value: 'mindfulness' },
    { label: 'Travel', value: 'travel' },
    { label: 'Adventure', value: 'adventure' },
    { label: 'Hiking', value: 'hiking' },
    { label: 'Camping', value: 'camping' },
    { label: 'Wildlife', value: 'wildlife' },
    { label: 'Nature', value: 'nature' },
    { label: 'Scuba Diving', value: 'scuba-diving' },
];


// select option styles
export const selectStyle = {
    control: (base, state) => ({
        ...base,
        boxShadow: 'none',
        minHeight: '45px',
        padding: '0 8px',
        fontWeight: '600',
        cursor: 'text',
        borderColor: state.isFocused ? '#4f46e5' : '#e2e8f0',
        '&:hover': {
            borderColor: '#4f46e5',
        },
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: '#f0eded',
        padding: '2px 4px',
    }),
    multiValueLabel: (base) => ({
        ...base,
        fontSize: '0.875rem',
        color: '#374151',
    }),
    multiValueRemove: (base) => ({
        ...base,
        color: 'red',
        cursor: 'pointer',
        ':hover': {
            backgroundColor: '#e5e7eb',
            color: '#1f2937',
        },
    }),
    menu: (base) => ({
        ...base,
        zIndex: 9999,
    }),
    menuList: (base) => ({
        ...base,
        padding: '4px',
    }),
    option: (base, state) => ({
        ...base,
        padding: '8px 12px',
        fontWeight: '500',
        backgroundColor: state.isSelected ? '#4f46e5' : state.isFocused ? '#e0e7ff' : 'transparent',
        color: state.isSelected ? 'white' : '#374151',
        ':active': {
            backgroundColor: state.isSelected ? '#4f46e5' : '#c7d2fe',
        },
    }),
    indicatorsContainer: (base) => ({
        ...base,
        cursor: 'pointer',
    }),
}
