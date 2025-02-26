import React, { useContext, useEffect, useState } from "react";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Shield,
  CreditCard,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  File,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { DOCUMENT_CATEGORIES } from "../lib/constants";
import { toast } from "react-toastify";
import AppContext from "../context/AppContext";
import { updateDocument } from "../lib/documents";

interface FormData {
  title: string;
}

const EditDocument = () => {
  const appContext = useContext(AppContext);
  const isModalOpen = appContext?.editDocModalVisible;
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
  });

  useEffect(() => {
    if (appContext?.selectedDocument) {
      setFormData((prev) => ({
        ...prev,
        title: appContext?.selectedDocument.title,
      }));

      setCategory(appContext?.selectedDocument.category);
      setSubcategory(appContext?.selectedDocument.subcategory);
    }
  }, [appContext?.selectedDocument]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (category == "" || subcategory == "") {
        toast.info("Please fill in all the fields");
        return;
      }
      console.log("data", formData);
      console.log("selected", {
        category,
        subcategory,
      });

      const res = await updateDocument(appContext?.selectedDocument.id, {
        title: formData.title,
        category,
        subcategory,
      });

      setLoading(false);

      setSuccess(true);
      appContext?.setEditDocModalVisible(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update document"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOk = () => {
    appContext?.setEditDocModalVisible(false);
  };
  const handleCancel = () => {
    appContext?.setEditDocModalVisible(false);
  };
  return (
    <>
      <Modal
        title="Edit Document Information"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={false}
      >
        <div className="space-y-6">
          {/* Form */}
          <div className="bg-white rounded-lg shadow">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Name */}
                <div className="sm:col-span-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Document Titles
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <File className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Doc Title"
                      />
                    </div>
                  </div>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Shield className="h-5 w-5 text-gray-400" />
                    </div>

                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setSubcategory("");
                      }}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {Object.keys(DOCUMENT_CATEGORIES).map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Subcategory
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CheckCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      disabled={!category}
                    >
                      <option value="">Select Subcategory</option>
                      {category &&
                        DOCUMENT_CATEGORIES[
                          category as keyof typeof DOCUMENT_CATEGORIES
                        ].map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  //   onClick={() => navigate("/dashboard/users") }
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {loading ? "Updating..." : "Update Document"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default EditDocument;
