import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setIsAdmin, setIsApproved, setIsManager, setLoggedIn } from "../../Context/authSlice";
import { SERVER_URL } from './../../constants';
// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
// } from 'chart.js';
// import { Line } from 'react-chartjs-2';
// import {faker} from '@faker-js/faker';

// ChartJS.register(
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend
// );

export default function Orders() {
    const isManager = useSelector(state => state.auth.isManager);
    const isAdmin = useSelector(state => state.auth.isAdmin);
    const userDetails = JSON.parse(localStorage.getItem("user"));
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();

    const [orders, setOrders] = useState([]);
    const [allProducts, setAllProducts] = useState({});
    const [monthly, setMonthly] = useState({});
    // const [labels, setLabels] = useState([]);

    // To add logged in feature
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            //if user exists
            dispatch(setLoggedIn());
            if (user.isAdmin === true) {
                //Change Admin Status is it's an admin
                dispatch(setIsAdmin());
            }

            if (user.isManager === true) {
                dispatch(setIsManager());
            }

            if (user.isApproved === true) {
                dispatch(setIsApproved());
            }
        }

        fetch(SERVER_URL + '/products/list', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(rawResponse => rawResponse.json())
            .then(resp => {
                let tempMap = {};
                resp.forEach(product => {
                    tempMap[product.productId] = product
                })
                setAllProducts(tempMap);
            })
            .catch(err => {
                console.log("Error Occured")
                setMessage(err.toString());
            });
    }, [])

    const changeStatus = (order) => {
        setMessage("");
        fetch(SERVER_URL + "/order/update",
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "orderId": order.orderId,
                    "status": !order.status
                }),
            })
            .then(rawResponse => rawResponse.json())
            .then(resp => console.log(resp))
            .catch(err => {
                console.log("Error Occured")
                setMessage(err.toString());
            });
        setOrders([]);
        listOrders();
        listOrders();
    }

    const listOrders = () => {
        setMessage("");
        fetch(SERVER_URL + "/order/list",
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(rawResponse => rawResponse.json())
            .then(resp => {
                setOrders(resp);
                orders.forEach(order => {
                    const d = new Date(order.date);
                    // monthly[d.getMonth] ? monthly[d.getMonth]++ : monthly[d.getMonth] = 1;
                    // setMonthly(monthly);
                    // setLabels(Array.from(monthly.keys()));

                })
            })
            .catch(err => {
                console.log("Error Occured")
                setMessage(err.toString());
            });
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Chart.js Line Chart',
            },
        },
    };

    // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    // const data = {
    //     labels,
    //     datasets: [
    //       {
    //         label: 'Orders',
    //         data: ['January', 'February', 'March', 'April', 'May', 'June', 'July'].map(() => faker.datatype.number({ min: -1000, max: 1000 })),
    //         borderColor: 'rgb(255, 99, 132)',
    //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
    //       },
    //     ],
    //   };

    useEffect(() => {
        listOrders();
    }, [])


    return (
        (isManager || isAdmin) ? (<div className='py-20 min-h-screen'>
            <h2 className='text-3xl text-white'>Orders</h2>
            <div className='flex flex-wrap justify-center items-center text-center align-middle text-white'>
                Order Status Update
            </div>

            {/* <div className="w-full align-middle items-center justify-center text-center flex"><div className="w-1/2 bg-white m-0 justify-center"><Line options={options} data={data} className=""/></div></div> */}

            <br />
            <p className="text-white">{message}</p>
            <div className="overflow-x-auto relative shadow-md py-5 px-5">
                <table className="w-full text-sm text-left text-gray-500 rounded-xl">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                        <tr>
                            <th scope="col" className="py-3 px-6">
                                Buyer ID
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Order ID
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Date
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Products
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Due in
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Status
                            </th>
                            <th scope="col" className="py-3 px-6">
                                Change Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => {
                            let counter = 0;
                            if (order.items) order.items.orderedProducts.forEach(product => counter += product.quantity);

                            let productsPerOrder = [];
                            order.items.orderedProducts.forEach(product => {
                                if (allProducts[product.productId]) productsPerOrder.push(allProducts[product.productId].productName);
                            })

                            return <tr className="bg-white border-b">
                                <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap">
                                    {order.buyerId}
                                </th>
                                <td className="py-4 px-6">
                                    {order.orderId}
                                </td>
                                <td className="py-4 px-6">
                                    {Date(order.date)}
                                </td>
                                <td className="py-4 px-6">
                                    {productsPerOrder.map(product => product + " ")}
                                </td>
                                <td className="py-4 px-6">
                                    {order.noOfDaysForDelivery} Days
                                </td>
                                <td className="py-4 px-6">
                                    {order.status ? "Delivered" : "Not Delivered"}
                                </td>
                                <td className="py-4 px-6">
                                    <a onClick={() => changeStatus(order)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline hover:cursor-pointer">Change Status</a>
                                </td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>

        </div>) : (
            <div className="justify-center items-center text-center flex flex-col h-screen align-middle">
                <h3 className="text-3xl text-white">You have to be an manager to view this Page</h3>
            </div>
        )
    )
}