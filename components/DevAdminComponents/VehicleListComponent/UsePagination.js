import { useState, useEffect } from 'react';
import { collection, query, orderBy, startAfter, limit, onSnapshot } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { setVehicleListData } from '../redux/store';
import { useDispatch } from 'react-redux';

export const UsePagination = (projectExtensionFirestore) => {
    const dispatch = useDispatch();
    const [currentPage, setCurrentPage] = useState(1);
    const [lastVisible, setLastVisible] = useState(null);
    // const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const handleNextPage = () => {
        setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let q;
                if (lastVisible) {
                    q = query(
                        collection(projectExtensionFirestore, 'VehicleProducts'),
                        orderBy('dateAdded', 'desc'),
                        startAfter(lastVisible),
                        limit(pageSize)
                    );
                } else {
                    q = query(
                        collection(projectExtensionFirestore, 'VehicleProducts'),
                        orderBy('dateAdded', 'desc'),
                        limit(pageSize)
                    );
                }

                const unsubscribe = onSnapshot(q, (snapshot) => {
                    const vehicleProductData = [];
                    snapshot.forEach((doc) => {
                        vehicleProductData.push({
                            id: doc.id,
                            ...doc.data(),
                        });
                    });

                    if (!snapshot.empty) {
                        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                    }

                    // setData(vehicleProductData);
                    dispatch(setVehicleListData(vehicleProductData));
                });

                return unsubscribe;
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        fetchData();
    }, [projectExtensionFirestore, currentPage, pageSize]);

    return { handleNextPage, handlePreviousPage };
};