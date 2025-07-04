// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getAllCategories } from "../../services/CategoryService";
import { createPost, updatePost } from "../../services/PostService";
import { generatePostDescription } from "../../services/PostService";

// eslint-disable-next-line react/prop-types
const RichTextEditor = ({ onSave, onCancel, initialPost = {} }) => {
  const [content, setContent] = useState(initialPost.content || "");
  const [title, setTitle] = useState(initialPost.title || "");
  const [description, setDescription] = useState(initialPost.description || "");
  const [category, setCategory] = useState(initialPost.categoryId || "");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    getAllCategories()
      .then((res) => setCategories(res.data))
      .catch((error) => alert("Error fetching categories:", error));
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Chỉ lấy 1 ảnh duy nhất
    if (file) {
      setThumbnail(file);
    }
  };

  const handleGenerateDescription = async () => {
    if (!title) {
      alert("Please enter a title before generating a description.");
      return;
    }
    try {
      setLoading(true);
      const result = await generatePostDescription(title);
      setDescription(result);
    } catch (error) {
      alert("Error generating description:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title || !content || !description || !category || !thumbnail) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let response;
      const formData = new FormData();

      // Đảm bảo JSON được gửi đúng định dạng
      formData.append(
        "post",
        new Blob(
          [
            JSON.stringify({
              id: initialPost.id,
              title,
              content,
              description,
              categoryId: category,
            }),
          ],
          { type: "application/json" }
        )
      );

      // Nếu có ảnh mới, thêm vào FormData
      if (thumbnail) {
        formData.append("mediaFile", thumbnail);
      }

      if (initialPost.id) {
        response = await updatePost(initialPost.id, formData);
      } else {
        response = await createPost(formData);
      }

      onSave(response);
    } catch (err) {
      setError("Failed to save post. Please try again.");
      alert("Error saving post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="editor-header">
        <input
          type="text"
          placeholder="Enter post title"
          className="editor-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          type="text"
          placeholder="Enter post description"
          className="editor-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3} // Increase the number of visible lines
        />
        <div>
          <button
            className="btn btn-primary"
            onClick={handleGenerateDescription}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate description"}
          </button>
        </div>
        <select
          className="editor-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Thumbnail */}
      <div className="editor-image-upload" style={{ marginBottom: "1rem" }}>
        <span>Select a thumbnail: </span>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <div className="editor-wrapper">
        <ReactQuill
          value={content}
          onChange={setContent}
          className="editor-body"
          modules={RichTextEditor.modules}
          formats={RichTextEditor.formats}
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="editor-actions">
        <button
          className="btn btn-primary"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Publishing..." : "Publish"}
        </button>
        <button className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

RichTextEditor.modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }], // Kích thước tiêu đề
    [{ font: [] }], // Font chữ
    [{ size: ["small", false, "large", "huge"] }], // Cỡ chữ
    ["bold", "italic", "underline", "strike"], // In đậm, nghiêng, gạch chân, gạch ngang
    [{ color: [] }, { background: [] }], // Màu chữ, màu nền
    [{ script: "sub" }, { script: "super" }], // Chỉ số dưới và trên
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], // Danh sách số, danh sách chấm, danh sách checklist
    [{ indent: "-1" }, { indent: "+1" }], // Giảm/tăng thụt lề
    [{ align: [] }], // Căn chỉnh trái, phải, giữa, đều
    ["blockquote", "code-block"], // Trích dẫn, mã code
    ["link", "image", "video"], // Chèn liên kết, ảnh, video
    ["clean"], // Xóa định dạng
  ],
};

RichTextEditor.formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "script",
  "sub",
  "super",
  "list",
  "bullet",
  "check",
  "indent",
  "align",
  "blockquote",
  "code-block",
  "link",
  "image",
  "video",
];

export default RichTextEditor;
