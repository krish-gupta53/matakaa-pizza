import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/food/list', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                setList(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching food items:', error);
            toast.error('Failed to fetch food items');
        }
    };

    const removeFood = async (foodId) => {
        try {
            const response = await axios.post('http://localhost:4000/api/food/admin/remove', {
                id: foodId
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.data.success) {
                toast.success('Food item removed successfully');
                fetchList();
            }
        } catch (error) {
            console.error('Error removing food item:', error);
            toast.error('Failed to remove food item');
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className='list'>
            <h1>All Foods List</h1>
            <div className="list-table-format">
                <b>Image</b>
                <b>Name</b>
                <b>Category</b>
                <b>Price</b>
                <b>Action</b>
            </div>
            {list.map((item, index) => {
                return (
                    <div key={index} className="list-table-format">
                        <img 
                            src={`http://localhost:4000/uploads/${item.image}`} 
                            alt={item.name}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150?text=No+Image';
                            }}
                        />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>₹{item.price}</p>
                        <button onClick={() => removeFood(item._id)} className='cursor'>Remove</button>
                    </div>
                );
            })}
        </div>
    );
};

export default List; 