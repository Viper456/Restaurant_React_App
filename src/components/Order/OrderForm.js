
import React, { useState, useEffect } from 'react'
import Form from "../../layouts/Form";
import { Grid, InputAdornment, makeStyles, ButtonGroup, Button as MuiButton } from '@material-ui/core';
import { Input, Select, Button } from "../../controls";
import ReplayIcon from '@material-ui/icons/Replay';
import RestaurantMenuIcon from '@material-ui/icons/RestaurantMenu';
import ReorderIcon from '@material-ui/icons/Reorder';
import { createAPIEndpoint, ENDPOINTS } from "../../api";
import { roundTo2DecimalPoint } from "../../utils";
import Popup from '../../layouts/Popup';
import OrderList from './OrderList';
import Notification from "../../layouts/Notification";

const pMethods = [
    { id: 'none', title: 'Select' },
    { id: 'Готівка', title: 'Готівка' },
    { id: 'Карта', title: 'Карта' },
]

const useStyles = makeStyles(theme => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#f3b33d',
            fontWeight: 'bolder',
            fontSize: '1.5em'
        },
    },
    submitButtonGroup: {
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    }
}))

export default function OrderForm(props) {

    const { values, setValues, errors, setErrors,
        handleInputChange, resetFormControls } = props;
    const classes = useStyles();

    const [customerList, setCustomerList] = useState([]);
    const [orderListVisibility, setOrderListVisibility] = useState(false);
    const [orderId, setOrderId] = useState(0);
    const [notify, setNotify] = useState({ isOpen: false })

    useEffect(() => {
        createAPIEndpoint(ENDPOINTS.CUSTOMER).fetchAll()
            .then(res => {
                let customerList = res.data.map(item => ({
                    id: item.customerID,
                    title: item.customerName
                }));
                customerList = [{ id: 0, title: 'Select' }].concat(customerList);
                setCustomerList(customerList);
            })
            .catch(err => console.log(err))
    }, [])


    useEffect(() => {
        let gTotal = values.orderDetails.reduce((tempTotal, item) => {
            return tempTotal + (item.quantity * item.foodItemPrice);
        }, 0);
        setValues({
            ...values,
            gTotal: roundTo2DecimalPoint(gTotal)
        })
        
    }, [JSON.stringify(values.orderDetails)]);

    useEffect(() => {
        if (orderId === 0) resetFormControls()
        else {
            createAPIEndpoint(ENDPOINTS.ORDER).fetachById(orderId)
                .then(res => {
                    setValues(res.data);
                    setErrors({});
                })
                .catch(err => console.log(err))
        }
    }, [orderId]);

    const validateForm = () => {
        let temp = {};
        temp.customerId = values.customerId !== 0 ? "" : "Це поле обовязкове.";
        temp.pMethod = values.pMethod !== "none" ? "" : "Це поле обовязкове.";
        temp.orderDetails = values.orderDetails.length !== 0 ? "" : "Це поле обовязкове.";
        setErrors({ ...temp });
        return Object.values(temp).every(x => x === "");
    }

    const resetForm = () => {
        resetFormControls();
        setOrderId(0);
    }

    const submitOrder = e => {
        e.preventDefault();
        if (validateForm()) {
            if (values.orderMasterId === 0) {
                createAPIEndpoint(ENDPOINTS.ORDER).create(values)
                    .then(res => {
                        resetFormControls();
                        setNotify({isOpen:true, message:'Нове замовлення створено.'});
                    })
                    .catch(err => console.log(err));
            }
            else {
                createAPIEndpoint(ENDPOINTS.ORDER).update(values.orderMasterId, values)
                    .then(res => {
                        setOrderId(0);
                        setNotify({isOpen:true, message:'Замовлення відновлено.'});
                    })
                    .catch(err => console.log(err));
            }
        }

    }

    const openListOfOrders = () => {
        setOrderListVisibility(true);
    }

    return (
        <>
            <Form onSubmit={submitOrder}>
                <Grid container>
                    <Grid item xs={6}>
                        <Input
                            disabled
                            label="Номер замовлення"
                            name="orderNumber"
                            value={values.orderNumber}
                            InputProps={{
                                startAdornment: <InputAdornment
                                    className={classes.adornmentText}
                                    position="start">#</InputAdornment>
                            }}
                        />
                        <Select
                            label="Клієнт"
                            name='customerId'
                            value={values.customerId}
                            onChange={handleInputChange}
                            options={customerList}
                            error={errors.customerId}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Select
                            label="Метод оплати"
                            name="pMethod"
                            value={values.pMethod}
                            onChange={handleInputChange}
                            options={pMethods}
                            error={errors.pMethod}
                        />
                        <Input
                            disabled
                            label="Загальна сума"
                            name="gTotal"
                            value={values.gTotal}
                            InputProps={{
                                startAdornment: <InputAdornment
                                    className={classes.adornmentText}
                                    position="start">$</InputAdornment>
                            }}
                        />
                        <ButtonGroup className={classes.submitButtonGroup}>
                            <MuiButton
                                size="large"
                                endIcon={<RestaurantMenuIcon />}
                                type="submit">Зберегти</MuiButton>
                            <MuiButton
                                size="small"
                                onClick={resetForm}
                                startIcon={<ReplayIcon />}
                            />
                        </ButtonGroup>
                        <Button
                            size="large"
                            onClick={openListOfOrders}
                            startIcon={<ReorderIcon />}
                        >Замовлення</Button>
                    </Grid>
                </Grid>
            </Form>
            <Popup
                title="Список замовлень"
                openPopup={orderListVisibility}
                setOpenPopup={setOrderListVisibility}>
                <OrderList
                    {...{ setOrderId, setOrderListVisibility,resetFormControls,setNotify }} />
            </Popup>
            <Notification
                {...{ notify, setNotify }} />
        </>
    )
}