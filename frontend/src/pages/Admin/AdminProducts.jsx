import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search, X, Check } from 'lucide-react';
import api from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal / Form State
  const [showModal, setShowModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    compareAtPrice: '',
    category: '',
    images: '',
    colorway: 'Obsidian Black / Blood Crimson',
    isLimitedEdition: false,
    sizes: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 5 },
      { size: 'XXL', stock: 2 }
    ]
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products?limit=100');
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Fetch admin products error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch (err) {
      console.warn('Fetch categories error:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      slug: '',
      description: 'Engineered from 500GSM double-faced terry in obsidian black.',
      price: '280',
      compareAtPrice: '320',
      category: categories[0]?._id || '',
      images: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop',
      colorway: 'Obsidian Black / Blood Crimson',
      isLimitedEdition: false,
      sizes: [
        { size: 'XS', stock: 5 },
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 10 },
        { size: 'XL', stock: 5 }
      ]
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProductId(product._id);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      compareAtPrice: String(product.compareAtPrice || 0),
      category: typeof product.category === 'object' ? product.category._id : product.category,
      images: product.images?.join(', ') || '',
      colorway: product.colorway || 'Obsidian Black',
      isLimitedEdition: product.isLimitedEdition || false,
      sizes: product.sizes && product.sizes.length ? product.sizes : [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 10 }
      ]
    });
    setShowModal(true);
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted successfully.');
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const imageArray = formData.images.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice),
      images: imageArray
    };

    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload);
        alert('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        alert('New Relic Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleSizeStockChange = (index, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index].stock = Number(value);
    setFormData({ ...formData, sizes: newSizes });
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black text-white py-4 min-vh-100">
      <div className="container-fluid px-4 px-lg-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center border-bottom border-dark pb-3 mb-4 gap-3">
          <div>
            <span className="badge bg-danger text-uppercase fs-8 mb-1">INVENTORY MANAGEMENT</span>
            <h2 className="display-6 fw-bold mb-0 text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
              RELIC PRODUCTS CATALOG ({products.length})
            </h2>
          </div>
          <button onClick={handleOpenCreateModal} className="xo-btn-primary btn-sm">
            <Plus size={16} /> Create New Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-4" style={{ maxWidth: '350px' }}>
          <div className="position-relative">
            <input
              type="text"
              className="xo-input form-control form-control-sm text-white pe-4"
              placeholder="Search product inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={16} className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted" />
          </div>
        </div>

        {/* Products Table */}
        <div className="xo-card p-3">
          {loading ? (
            <div className="text-center py-5 text-danger">
              <div className="spinner-border" role="status"></div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-dark table-hover align-middle mb-0 fs-7">
                <thead>
                  <tr className="text-muted text-uppercase fs-8 border-bottom border-dark">
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Limited Drop</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p._id}>
                      <td>
                        <img
                          src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=100&auto=format&fit=crop'}
                          alt={p.name}
                          className="rounded bg-dark"
                          style={{ width: '45px', height: '55px', objectFit: 'cover' }}
                        />
                      </td>
                      <td className="fw-bold text-white">{p.name}</td>
                      <td className="text-muted">{typeof p.category === 'object' ? p.category?.name : 'Category'}</td>
                      <td className="text-danger fw-bold">${p.price}</td>
                      <td>
                        <span className={`badge ${p.totalStock <= 15 ? 'bg-warning text-dark' : 'bg-dark border border-secondary text-white'}`}>
                          {p.totalStock} units
                        </span>
                      </td>
                      <td>
                        {p.isLimitedEdition ? (
                          <span className="badge bg-danger">⚡ LIMITED</span>
                        ) : (
                          <span className="text-muted fs-8">Standard</span>
                        )}
                      </td>
                      <td className="text-end">
                        <button onClick={() => handleOpenEditModal(p)} className="btn btn-sm btn-outline-light me-2 p-1 px-2" title="Edit">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDeleteProduct(p._id, p.name)} className="btn btn-sm btn-outline-danger p-1 px-2" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CREATE / EDIT MODAL OVERLAY */}
        {showModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1080, backgroundColor: 'rgba(0,0,0,0.85)' }}>
            <div className="xo-card p-4 text-white bg-black border-danger" style={{ maxWidth: '650px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-dark">
                <h5 className="mb-0 text-white" style={{ fontFamily: 'var(--xo-font-heading)' }}>
                  {editingProductId ? 'EDIT PRODUCT RELIC' : 'CREATE NEW STREETWEAR RELIC'}
                </h5>
                <button onClick={() => setShowModal(false)} className="btn btn-sm btn-dark text-muted border-0">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label text-muted fs-8">Product Name</label>
                    <input
                      type="text"
                      required
                      className="xo-input form-control text-white"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted fs-8">Category</label>
                    <select
                      required
                      className="xo-input form-select text-white"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-muted fs-8">Price ($)</label>
                    <input
                      type="number"
                      required
                      className="xo-input form-control text-white"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label text-muted fs-8">Compare Price ($)</label>
                    <input
                      type="number"
                      className="xo-input form-control text-white"
                      value={formData.compareAtPrice}
                      onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted fs-8">Description</label>
                    <textarea
                      required
                      rows="3"
                      className="xo-input form-control text-white"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label text-muted fs-8">Image URLs (comma separated)</label>
                    <input
                      type="text"
                      required
                      className="xo-input form-control text-white"
                      value={formData.images}
                      onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label text-muted fs-8">Colorway</label>
                    <input
                      type="text"
                      className="xo-input form-control text-white"
                      value={formData.colorway}
                      onChange={(e) => setFormData({ ...formData, colorway: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6 d-flex align-items-center mt-4">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input bg-dark border-danger"
                        type="checkbox"
                        id="limitedDropCheck"
                        checked={formData.isLimitedEdition}
                        onChange={(e) => setFormData({ ...formData, isLimitedEdition: e.target.checked })}
                      />
                      <label className="form-check-label text-white fw-bold fs-7" htmlFor="limitedDropCheck">
                        ⚡ Limited Edition Micro Drop
                      </label>
                    </div>
                  </div>

                  {/* Size Stock Matrix */}
                  <div className="col-12">
                    <label className="form-label text-muted fs-8 fw-bold">Size Inventory Breakdown</label>
                    <div className="d-flex flex-wrap gap-2">
                      {formData.sizes.map((s, index) => (
                        <div key={s.size} className="p-2 bg-dark rounded border border-dark text-center" style={{ width: '85px' }}>
                          <span className="fw-bold text-danger fs-8">{s.size}</span>
                          <input
                            type="number"
                            min="0"
                            className="xo-input form-control form-control-sm text-white text-center mt-1 px-1"
                            value={s.stock}
                            onChange={(e) => handleSizeStockChange(index, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top border-dark">
                  <button type="button" onClick={() => setShowModal(false)} className="xo-btn-outline btn-sm">
                    Cancel
                  </button>
                  <button type="submit" className="xo-btn-primary btn-sm">
                    Save Product Relic
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
