# API Documentation

This document provides an overview of all APIs available in the application, organized and serialized for better understanding.

## Base URL
```
http://localhost:5000/api
```

---

## Authentication APIs

### 1. Signup
**Endpoint:**
```
POST /auth/signup
```
**Description:** Creates a new user account.
**Request Body:**
| Field     | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `name`    | `string` | Yes      | Full name of the user.   |
| `email`   | `string` | Yes      | Email address.           |
| `username`| `string` | Yes      | Unique username.         |
| `password`| `string` | Yes      | Password for the account.|

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "JWT Token",
  "user": {
    "id": "userId",
    "name": "User Name",
    "email": "user@example.com",
    "username": "@username",
    "role": "user"
  }
}
```

### 2. Login
**Endpoint:**
```
POST /auth/login
```
**Description:** Logs in a user.
**Request Body:**
| Field     | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `email`   | `string` | Optional | Email address.           |
| `username`| `string` | Optional | Username.                |
| `password`| `string` | Yes      | Password for the account.|

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT Token",
  "user": {
    "id": "userId",
    "name": "User Name",
    "email": "user@example.com",
    "username": "@username",
    "role": "user"
  }
}
```

### 3. Logout
**Endpoint:**
```
GET /auth/logout
```
**Description:** Logs out the user by clearing the session token.
**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## User APIs

### 4. Get Profile
**Endpoint:**
```
GET /user
```
**Description:** Fetches the profile of the logged-in user.
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "userId",
    "name": "User Name",
    "email": "user@example.com",
    "username": "@username",
    "bio": "User bio",
    "followers": 10,
    "following": 5
  }
}
```

### 5. Update Profile
**Endpoint:**
```
PUT /user/update-profile
```
**Description:** Updates the profile of the logged-in user.
**Request Body:**
| Field       | Type     | Required | Description              |
|-------------|----------|----------|--------------------------|
| `name`      | `string` | Optional | Updated name.            |
| `username`  | `string` | Optional | Updated username.        |
| `bio`       | `string` | Optional | Updated bio.             |
| `socialLinks`| `object`| Optional | Updated social links.    |

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "userId",
    "name": "Updated Name",
    "username": "@updatedUsername",
    "bio": "Updated bio"
  }
}
```

### 6. Upload Profile Image
**Endpoint:**
```
POST /user/upload-profile
```
**Description:** Uploads a new profile image for the user.
**Request Body:**
| Field           | Type     | Required | Description              |
|------------------|----------|----------|--------------------------|
| `profile_image`  | `file`   | Yes      | Profile image file.      |

**Response:**
```json
{
  "success": true,
  "message": "Profile image uploaded successfully",
  "data": {
    "url": "imageUrl",
    "public_id": "publicId"
  }
}
```

### 7. Change Password
**Endpoint:**
```
PUT /user/change-password
```
**Description:** Changes the password of the logged-in user.
**Request Body:**
| Field         | Type     | Required | Description              |
|---------------|----------|----------|--------------------------|
| `oldPassword` | `string` | Yes      | Current password.        |
| `newPassword` | `string` | Yes      | New password.            |

**Response:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### 8. Follow/Unfollow User
**Endpoint:**
```
PUT /user/follow-unfollow
```
**Description:** Toggles the follow status of another user.
**Request Body:**
| Field   | Type     | Required | Description              |
|---------|----------|----------|--------------------------|
| `userId`| `string` | Yes      | ID of the user to follow/unfollow.|

**Response:**
```json
{
  "success": true,
  "message": "Followed/Unfollowed successfully",
  "data": {
    "following": 5,
    "followers": 10
  }
}
```

### 9. Search User
**Endpoint:**
```
GET /user/search
```
**Description:** Searches for users by name, username, or email.
**Query Parameters:**
| Parameter | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `query`   | `string` | Yes      | Search query.            |
| `page`    | `number` | Optional | Page number (default: 1).|
| `limit`   | `number` | Optional | Number of results per page (default: 10).|

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "userId",
      "name": "User Name",
      "username": "@username",
      "profileImage": "imageUrl",
      "bio": "User bio"
    }
  ]
}
```

### 10. Get User Details by Username
**Endpoint:**
```
GET /user/:username
```
**Description:** Fetches the details of a user and their blogs by username.
**Path Parameters:**
| Parameter   | Type     | Required | Description              |
|-------------|----------|----------|--------------------------|
| `username`  | `string` | Yes      | Username of the user.    |

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "name": "User Name",
      "email": "user@example.com",
      "username": "@username",
      "bio": "User bio",
      "role": "user",
      "following": 10,
      "followers": 5,
      "isFollowing": true,
      "profileImage": "imageUrl",
      "socialLinks": {
        "twitter": "https://twitter.com/user",
        "instagram": "https://instagram.com/user"
      }
    },
    "blogs": [
      {
        "id": "blogId",
        "title": "Blog Title",
        "bannerImage": "imageUrl",
        "comments": 2,
        "likes": 5,
        "createdAt": "timestamp",
        "updatedAt": "timestamp"
      }
    ]
  }
}
```

---

## Blog APIs

### 11. Create a New Blog Story
**Endpoint:**
```
POST /blog/create-blog
```
**Description:** Creates a new blog story with a title, content, tags, and an optional banner image.
**Request Headers:**
 `Authorization`: Bearer `<JWT Token>`

**Request Body (Form Data):**
| Field        | Type     | Required | Description                     |
|--------------|----------|----------|---------------------------------|
| `title`      | `string` | Yes      | Title of the blog.              |
| `content`    | `string` | Yes      | Content of the blog.            |
| `tags`       | `array`  | Yes      | Tags related to the blog (1-5). |
| `bannerImage`| `file`   | Yes      | Banner image for the blog.      |

**Response:**
```json
{
  "success": true,
  "message": "Story created successfully",
  "data": {
    "id": "blogId",
    "title": "Blog Title",
    "content": "Blog Content",
    "tags": ["tag1", "tag2"],
    "author": "authorId",
    "bannerImage": "imageUrl",
    "likes": 0,
    "comments": 0,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### 12. Get Blogs
**Endpoint:**
```
GET /blog/get-blogs
```
**Description:** Fetches a paginated list of blogs.
**Query Parameters:**
| Parameter | Type     | Required | Description                     |
|-----------|----------|----------|---------------------------------|
| `page`    | `number` | Optional | Page number (default: 1).       |
| `limit`   | `number` | Optional | Number of blogs per page (default: 10). |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blogId",
      "title": "Blog Title",
      "content": "Blog Content",
      "tags": ["tag1", "tag2"],
      "author": {
        "id": "authorId",
        "name": "Author Name",
        "username": "Author Username",
        "profileImage": "imageUrl"
      },
      "likes": 0,
      "comments": 0,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ],
  "totalPages": 5
}
```

### 13. Edit Blog
**Endpoint:**
```
PUT /blog/edit-blog
```
**Description:** Edits an existing blog post.
**Request Headers:**
- `Authorization`: Bearer `<JWT Token>`

**Request Body (Form Data):**
| Field        | Type     | Required | Description                     |
|--------------|----------|----------|---------------------------------|
| `blogId`     | `string` | Yes      | ID of the blog to edit.         |
| `title`      | `string` | Optional | Updated title of the blog.      |
| `content`    | `string` | Optional | Updated content of the blog.    |
| `tags`       | `array`  | Optional | Updated tags for the blog.      |
| `bannerImage`| `file`   | Optional | Updated banner image.           |

**Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "id": "blogId",
    "title": "Updated Title",
    "content": "Updated Content",
    "tags": ["tag1", "tag2"],
    "bannerImage": "imageUrl",
    "likes": 0,
    "comments": 0,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  }
}
```

### 14. Delete Blog
**Endpoint:**
```
DELETE /blog/delete-blog/:id
```
**Description:** Deletes a blog post.
**Request Headers:**
- `Authorization`: Bearer `<JWT Token>`

**Path Parameters:**
| Parameter | Type     | Required | Description                     |
|-----------|----------|----------|---------------------------------|
| `id`      | `string` | Yes      | ID of the blog to delete.       |

**Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "id": "blogId"
  }
}
```

### 15. Like/Unlike Blog
**Endpoint:**
```
PUT /blog/like-unlike
```
**Description:** Toggles the like status of a blog post.
**Request Headers:**
- `Authorization`: Bearer `<JWT Token>`

**Request Body:**
| Field   | Type     | Required | Description                     |
|---------|----------|----------|---------------------------------|
| `blogId`| `string` | Yes      | ID of the blog to like/unlike.  |

**Response:**
```json
{
  "success": true,
  "message": "Post liked successfully",
  "data": {
    "blogId": "blogId",
    "likes": 10
  }
}
```

### 16. Search Blogs
**Endpoint:**
```
GET /blog/search
```
**Description:** Searches for blogs by title or tags.
**Query Parameters:**
| Parameter | Type     | Required | Description                     |
|-----------|----------|----------|---------------------------------|
| `query`   | `string` | Yes      | Search query.                   |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blogId",
      "title": "Blog Title",
      "author": {
        "id": "authorId",
        "name": "Author Name",
        "username": "Author Username",
        "profileImage": "imageUrl"
      },
      "tags": ["tag1", "tag2"],
      "bannerImage": "imageUrl",
      "comments": 0,
      "likes": 0,
      "createdAt": "timestamp",
      "updatedAt": "timestamp"
    }
  ]
}
```

---

## Admin APIs

### 1. Create Admin
**Endpoint:**
```
POST /admin/create
```
**Description:** Creates a new admin account.
**Request Body:**
| Field     | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `name`    | `string` | Yes      | Full name of the admin.  |
| `email`   | `string` | Yes      | Email address.           |
| `password`| `string` | Yes      | Password for the account.|

**Response:**
```json
{
  "success": true,
  "message": "Admin created successfully",
  "data": {
    "id": "adminId",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

### 2. Login Admin
**Endpoint:**
```
POST /admin/auth/login
```
**Description:** Logs in an admin.
**Request Body:**
| Field     | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `email`   | `string` | Yes      | Email address.           |
| `password`| `string` | Yes      | Password for the account.|

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "JWT Token",
  "data": {
    "id": "adminId",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

### 3. Logout Admin
**Endpoint:**
```
GET /admin/auth/logout
```
**Description:** Logs out the admin by clearing the session token.
**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### 4. Get Admin Profile
**Endpoint:**
```
GET /admin/profile
```
**Description:** Fetches the profile of the logged-in admin.
**Response:**
```json
{
  "success": true,
  "data": {
    "id": "adminId",
    "name": "Admin Name",
    "email": "admin@example.com"
  }
}
```

### 5. Get Dashboard Stats
**Endpoint:**
```
GET /admin/dashboard-stats
```
**Description:** Fetches statistics for the admin dashboard.
**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 100,
    "totalBlogs": 50,
    "totalComments": 200
  }
}
```

### 6. Fetch Users
**Endpoint:**
```
GET /admin/users
```
**Description:** Fetches a list of all users.
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "userId",
      "name": "User Name",
      "email": "user@example.com",
      "username": "@username",
      "role": "user"
    }
  ]
}
```

### 7. Block/Unblock User
**Endpoint:**
```
PUT /admin/user/block-unblock-user
```
**Description:** Toggles the block status of a user.
**Request Body:**
| Field   | Type     | Required | Description              |
|---------|----------|----------|--------------------------|
| `userId`| `string` | Yes      | ID of the user to block/unblock.|

**Response:**
```json
{
  "success": true,
  "message": "User blocked/unblocked successfully"
}
```

### 8. Get User Details by ID
**Endpoint:**
```
GET /admin/user/:userId
```
**Description:** Fetches the details of a user by their ID.
**Path Parameters:**
| Parameter | Type     | Required | Description              |
|-----------|----------|----------|--------------------------|
| `userId`  | `string` | Yes      | ID of the user.          |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "userId",
    "name": "User Name",
    "email": "user@example.com",
    "username": "@username",
    "role": "user"
  }
}
```

### 9. Update Blog
**Endpoint:**
```
PUT /admin/blog/update-blog
```
**Description:** Updates a blog post.
**Request Body (Form Data):**
| Field        | Type     | Required | Description                     |
|--------------|----------|----------|---------------------------------|
| `blogId`     | `string` | Yes      | ID of the blog to update.       |
| `title`      | `string` | Optional | Updated title of the blog.      |
| `content`    | `string` | Optional | Updated content of the blog.    |
| `tags`       | `array`  | Optional | Updated tags for the blog.      |
| `bannerImage`| `file`   | Optional | Updated banner image.           |

**Response:**
```json
{
  "success": true,
  "message": "Blog updated successfully",
  "data": {
    "id": "blogId",
    "title": "Updated Title",
    "content": "Updated Content",
    "tags": ["tag1", "tag2"],
    "bannerImage": "imageUrl"
  }
}
```

### 10. Delete Blog
**Endpoint:**
```
DELETE /admin/blog/delete/:blogId
```
**Description:** Deletes a blog post.
**Path Parameters:**
| Parameter | Type     | Required | Description                     |
|-----------|----------|----------|---------------------------------|
| `blogId`  | `string` | Yes      | ID of the blog to delete.       |

**Response:**
```json
{
  "success": true,
  "message": "Blog deleted successfully"
}
```

---

## Notes
- All endpoints requiring authentication must include a valid JWT token in the `Authorization` header.
- Ensure that file uploads are sent as `multipart/form-data` where applicable.

Feel free to reach out if you have any questions or need further clarification!
