import { useState, useEffect } from 'react';

export function useGrillKitchen() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true);
 
    useEffect (() => {
        //Henter data fra vores backend-endpoint for order
        fetch('http://localhost:8080/api/orders')
        .then((res) => res.json())
        .then((data)=> {
            setOrders(data);
            setLoading(false);
        })
        .catch((err) =>{
            console.error('Fejl ved afhentning af order:', err);
            setLoading(false);
        });
    }, []);
    return {orders, loading} ;
}