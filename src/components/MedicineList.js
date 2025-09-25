import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import AddMedicineForm from './AddMedicineForm';
import EditMedicineForm from './EditMedicineForm';
import ErrorBoundary from './ErrorBoundary';

const BASE_URL = 'https://med-catalog.onrender.com'; // ✅ Live backend URL

function MedicineList() {
  const [medicines, setMedicines] = useState([]);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const itemsPerPage = 5;

  // 🔄 Fetch medicines from backend
  const fetchMedicines = () => {
    axios.get(`${BASE_URL}/api/medicines`)
      .then(res => setMedicines(res.data))
      .catch(err => {
        console.error('Fetch error:', err.response?.data || err.message);
        toast.error('Failed to fetch medicines.');
      });
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // 🗑️ Delete medicine
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;

    axios.delete(`${BASE_URL}/api/medicines/${id}`)
      .then(() => {
        toast.success('Medicine deleted successfully!');
        fetchMedicines();
      })
      .catch(err => {
        console.error('Delete failed:', err.response?.data || err.message);
        toast.error('Failed to delete medicine.');
      });
  };

  // 🔍 Filter medicines by search term
  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 📄 Pagination logic
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMedicines = filteredMedicines.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredMedicines.length / itemsPerPage);

  return (
    <div style={{ padding: '20px' }}>
      <h2>💊 Medicine Catalog</h2>

      {/* ➕ Toggle Add Form */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        style={{
          marginBottom: '20px',
          padding: '8px 12px',
          backgroundColor: '#28a745',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showAddForm ? 'Hide Add Form' : 'Add New Medicine'}
      </button>

      {/* 🧾 Add Medicine Form */}
      {showAddForm && (
        <AddMedicineForm onAdded={fetchMedicines} />
      )}

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search by name or manufacturer"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on search
        }}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />

      {/* 📋 Medicine Table */}
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Manufacturer</th>
            <th>Price</th>
            <th>Expiry Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedMedicines.map((med) => (
            <tr key={med._id}>
              <td>{med.name}</td>
              <td>{med.manufacturer}</td>
              <td>{med.price}</td>
              <td>{new Date(med.expiryDate).toLocaleDateString()}</td>
              <td>
                <button onClick={() => setEditingMedicine(med)}>Edit</button>
                <button onClick={() => handleDelete(med._id)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 📄 Pagination Buttons */}
      <div style={{ marginBottom: '20px' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            style={{
              margin: '0 5px',
              padding: '5px 10px',
              backgroundColor: currentPage === i + 1 ? '#007bff' : '#f0f0f0',
              color: currentPage === i + 1 ? '#fff' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* ✏️ Edit Form */}
      {editingMedicine && (
        <ErrorBoundary>
          <EditMedicineForm
            medicine={editingMedicine}
            onCancel={() => setEditingMedicine(null)}
            onUpdated={fetchMedicines}
          />
        </ErrorBoundary>
      )}
    </div>
  );
}

export default MedicineList;