import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'https://med-catalog.onrender.com'; // ✅ Live backend URL

function AddMedicineForm({ onAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    manufacturer: '',
    price: '',
    expiryDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${BASE_URL}/api/medicines`, formData);
      toast.success('Medicine added successfully!');
      setFormData({ name: '', manufacturer: '', price: '', expiryDate: '' });
      onAdded(); // ✅ Trigger parent update
    } catch (err) {
      console.error('Add failed:', err.response?.data || err.message);
      toast.error('Failed to add medicine. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <h3>Add New Medicine</h3>
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
      <button type="submit">Add</button>
    </form>
  );
}

export default AddMedicineForm;