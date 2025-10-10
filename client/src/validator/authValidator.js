import * as yup from "yup";

export const registerSchema = yup.object({
    name: yup.string().required('Please enter name'),
    email: yup.string().email('Invalid email format').required('Please enter email'),
    username: yup.string()
        .required('Please enter username')
        .matches(/^\w+$/, 'Username can only contain letters, numbers, and underscores')
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username cannot exceed 30 characters'),
    password: yup.string()
        .required('Please enter password')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot exceed 20 characters')
});

export const loginSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Please enter email'),
    password: yup.string()
        .required('Please enter password')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot exceed 20 characters')
});


export const profileUpdate = yup.object().shape({
    name: yup.string().optional().trim()
        .transform(value => value?.replace(/\s+/g, ' '))
        .min(3, 'Name must be at least 3 characters')
        .max(30, 'Name cannot exceed 30 characters')
        .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
    username: yup.string().required("Please enter username").trim()
        .transform(value => value?.replace(/\s+/g, ' '))
        .matches(/^@[a-zA-Z0-9_@]+$/, 'Username can only contain letters, numbers, underscores, and @ symbol')
        .min(4, 'Username must be at least 4 characters')
        .max(30, 'Username cannot exceed 30 characters')
        .transform(value => value?.replace(/@+/g, '@'))
        .transform(value => value?.startsWith('@') ? value : '@' + value),
    bio: yup.string().optional().trim()
        .transform(value => value?.replace(/\s+/g, ' '))
        .min(3, 'Bio must be at least 3 characters')
        .max(250, 'Bio cannot exceed 250 characters')
        // .matches(/^[a-zA-Z0-9\s,.]+$/, 'Bio can only contain letters, numbers, spaces, commas, and dots')
        .transform(value => value?.replace(/\s+/g, ' ')),
    socialLinks: yup.object({
        youtube: yup.string().optional().trim().url("Invalid youtube url"),
        instagram: yup.string().optional().trim().url("Invalid instagram url"),
        facebook: yup.string().optional().trim().url("Invalid facebook url"),
        twitter: yup.string().optional().trim().url("Invalid twitter url"),
    })
});


export const changePassword = yup.object({
    oldPassword: yup.string().required('Please enter old password'),
    newPassword: yup.string()
        .required('Please enter new password')
        .min(6, 'Password must be at least 6 characters')
        .max(20, 'Password cannot exceed 20 characters'),
    confirmPassword: yup.string()
        .required('Please enter confirm password')
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
});
