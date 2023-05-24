import React, { useState, useEffect } from 'react'
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import Table from "../../layouts/Table";
import { TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';

export default function OrderList(props) {

    const { setOrderId, setOrderListVisibility, resetFormControls, setNotify } = props;

    const [orderList, setOrderList] = useState([]);

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.ORDER).fetchAll()
            .then(res => {
                setOrderList(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    const showForUpdate = id => {
        setOrderId(id);
        setOrderListVisibility(false);
    }

    const deleteOrder = id => {
        if (window.confirm('Ви впевнені що хочете видалити замовлення?')) {
            createAPIEndpoint(ENDPOINTS.ORDER).delete(id)
                .then(res => {
                    setOrderListVisibility(false);
                    setOrderId(0);
                    resetFormControls();
                    setNotify({ isOpen: true, message: 'Видалення успішне.' });
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Номер замовлення</TableCell>
                        <TableCell>Клієнт</TableCell>
                        <TableCell>Метод оплати</TableCell>
                        <TableCell>Сума замовлення</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        orderList.map(item => (
                            <TableRow key={item.orderMasterId}>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.orderNumber}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.customer.customerName}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.pMethod}
                                </TableCell>
                                <TableCell
                                    onClick={e => showForUpdate(item.orderMasterId)}>
                                    {item.gTotal}
                                </TableCell>
                                <TableCell>
                                    <DeleteOutlineTwoToneIcon
                                        color="secondary"
                                        onClick={e => deleteOrder(item.orderMasterId)} />
                                </TableCell>

                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </>
    )
}