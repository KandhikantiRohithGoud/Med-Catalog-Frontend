import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BASE_URL = 'https://med-catalog.onrender.com'; // ✅ Live backend URL

function EditMedicineForm({ medicine, onCancel, onUpdated }) {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    price: '',
    expiryDate: ''
  });

  useEffect(() => {
    if (medicine) {
      setFormData({
        name: medicine.name || '',
        manufacturer: medicine.manufacturer || '',
        price: medicine.price || '',
        expiryDate: medicine.expiryDate ? medicine.expiryDate.slice(0, 10) : ''
      });
    }
  }, [medicine]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!medicine?._id) {
      toast.error('Invalid medicine ID');
      return;
    }

    try {
      const res = await axios.put(`${BASE_URL}/api/medicines/${medicine._id}`, formData);
      toast.success('Medicine updated successfully!');
      onUpdated(); // ✅ Notify parent
      onCancel();  // ✅ Close form
    } catch (err) {
      console.error('Update failed:', err.response?.data || err.message);
      toast.error('Failed to update medicine. Please try again.');
    }
  };

  if (!medicine) {
    return <p>⚠️ No medicine selected for editing.</p>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Edit Medicine</h3>
      <input
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
        style={{ marginRight: '10px' }}
      />
      <input
        name="manufacturer"
        placeholder="Manufacturer"
        value={formData.manufacturer}
        onChange={handleChange}
        required
        style={{ marginRight: '10px' }}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        style={{ marginRight: '10px' }}
      />
      <input
        name="expiryDate"
        type="date"
        value={formData.expiryDate}
        onChange={handleChange}
        required
        style={{ marginRight: '10px' }}
      />
      <button type="submit">Update</button>
      <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
        Cancel
      </button>
    </form>
  );
}

export default EditMedicineForm;