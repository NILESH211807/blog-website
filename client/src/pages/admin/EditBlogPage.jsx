import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    tags: '',
    image: '',
  });
  const [previewImage, setPreviewImage] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/admin/blog/${id}`);
        const blog = res.data;
        setFormData({
          id: blog._id,
          title: blog.title || '',
          content: blog.content || '',
          tags: blog.tags?.join(', ') || '',
          image: blog.image || '',
        });
        setPreviewImage(blog.image || '');
        setLoading(false);
      } catch (err) {
        toast.error('Failed to fetch blog');
        navigate('/admin');
      }
    };
    fetchBlog();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'your_upload_preset'); // for Cloudinary

    const res = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData);
    return res.data.secure_url;
  };

  const handleUpdate = async () => {
  try {
    const form = new FormData();
    form.append('blogId', formData.id);
    form.append('title', formData.title);
    form.append('content', formData.content);
    form.append('tags', JSON.stringify(formData.tags.split(',').map(tag => tag.trim())));

    if (newImageFile) {
      form.append('file', newImageFile);
    }

    await axios.put('/api/admin/blog/update-blog', form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    toast.success('Blog updated successfully');
    navigate('/admin');
  } catch (err) {
    toast.error('Update failed');
  }
};


  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Blog</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="input input-bordered w-full mb-3"
      />
      <textarea
        name="content"
        value={formData.content}
        onChange={handleChange}
        placeholder="Content"
        className="textarea textarea-bordered w-full mb-3"
      />
      <input
        name="tags"
        value={formData.tags}
        onChange={handleChange}
        placeholder="Tags (comma separated)"
        className="input input-bordered w-full mb-3"
      />

      <label className="block mb-2 font-medium">Change Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="file-input file-input-bordered w-full mb-3"
      />
      {previewImage && (
        <img
          src={previewImage}
          alt="Preview"
          className="w-full h-auto mb-4 rounded-lg border"
        />
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button onClick={() => navigate('/admin')} className="btn btn-outline">Cancel</button>
        <button onClick={handleUpdate} className="btn btn-primary">Update</button>
      </div>
    </div>
  );
};

export default EditBlogPage;
